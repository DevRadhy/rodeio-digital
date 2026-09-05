import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { registerShot } from "../api/registerShot";
import {
  isJudgingShortcutBlocked,
  nextPendingCompetitor,
  shotFromKey,
} from "../lib/judging-shortcuts";
import type {
  Group,
  GroupRegistration,
  Result,
  Shot,
} from "../types/competition";
import { RegistrationCard } from "./competition-registration-card";

interface Props {
  group: Group;
  registrations: GroupRegistration[];
  results: Result[];
  competitionRunning: boolean;
  allowCorrection?: boolean;
  shortcutsEnabled: boolean;
  onShortcutsEnabledChange(enabled: boolean): void;
}
export function CompetitionList({
  group,
  registrations,
  results,
  competitionRunning,
  allowCorrection,
  shortcutsEnabled,
  onShortcutsEnabledChange,
}: Props) {
  const client = useQueryClient();
  const container = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const confirmedRef = useRef(new Set<string>());
  const advancing =
    useIsMutating({
      mutationKey: ["competition-advance", group.competitionId],
    }) > 0;
  // A successful POST must not be submitted again while a refetch is catching up.
  // This component is keyed by round ID; confirmations never spill into another round.
  const [confirmed, setConfirmed] = useState<Set<string>>(() => new Set());
  const active =
    competitionRunning &&
    group.status !== "finished" &&
    group.currentRound.status !== "finished";
  const current = active
    ? nextPendingCompetitor(registrations, results, confirmed)
    : undefined;
  const currentRegistrationId = current?.registration.id;
  const currentCompetitorId = current?.competitor.id;

  useEffect(() => {
    if (!currentRegistrationId || !currentCompetitorId) return;
    const frame = requestAnimationFrame(() => {
      const card = container.current?.querySelector<HTMLElement>(
        '[data-slot="card"][aria-current="true"]',
      );
      if (!card?.getClientRects().length) return;
      if (
        [
          ...document.querySelectorAll('[role="dialog"], [role="alertdialog"]'),
        ].some((dialog) => dialog.getClientRects().length > 0)
      )
        return;

      const margin = 16;
      const viewportHeight = window.innerHeight;
      // For a large team card, keep the competitor being judged in view.
      const target =
        card.getBoundingClientRect().height > viewportHeight - margin * 2
          ? (card.querySelector<HTMLElement>('[aria-current="true"]') ?? card)
          : card;
      const bounds = target.getBoundingClientRect();
      if (bounds.top >= margin && bounds.bottom <= viewportHeight - margin)
        return;
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
        inline: "nearest",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [currentRegistrationId, currentCompetitorId]);

  const mutation = useMutation({
    mutationKey: ["judging-shot", group.competitionId],
    mutationFn: registerShot,
    onSuccess: async (_, variables) => {
      confirmedRef.current.add(
        JSON.stringify([variables.registrationId, variables.competitorId]),
      );
      setConfirmed((previous) =>
        new Set(previous).add(
          JSON.stringify([variables.registrationId, variables.competitorId]),
        ),
      );
      await Promise.all(
        [
          "qualification-review",
          "scoreboard",
          "competition",
          "groups",
          "competition-group",
          "competition-round",
        ].map((key) =>
          client.invalidateQueries({
            queryKey: [key, variables.competitionId],
          }),
        ),
      );
    },
    onError: (error) =>
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ??
              "Não foi possível salvar o resultado. Tente novamente.")
          : "Não foi possível salvar o resultado. Tente novamente.",
      ),
  });
  const submit = useCallback(
    (registrationId: string, competitorId: string, shot: Shot) => {
      if (
        busy.current ||
        client.isMutating({
          mutationKey: ["competition-advance", group.competitionId],
        })
      )
        return;
      busy.current = true;
      void mutation
        .mutateAsync({
          competitionId: group.competitionId,
          groupId: group.id,
          roundId: group.currentRound.id,
          registrationId,
          competitorId,
          shot,
        })
        .catch(() => {})
        .finally(() => {
          busy.current = false;
        });
    },
    [
      client,
      group.competitionId,
      group.id,
      group.currentRound.id,
      mutation.mutateAsync,
    ],
  );
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const shot = shotFromKey(event);
      if (
        !shot ||
        !shortcutsEnabled ||
        !current ||
        busy.current ||
        confirmedRef.current.has(
          JSON.stringify([current.registration.id, current.competitor.id]),
        ) ||
        !container.current?.getClientRects().length
      )
        return;
      if (isJudgingShortcutBlocked(event)) return;
      event.preventDefault();
      submit(current.registration.id, current.competitor.id, shot);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, shortcutsEnabled, submit]);

  return (
    <div ref={container} className="flex flex-col justify-center gap-4 py-8">
      {active && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
          <div className="space-y-1">
            <p className="text-sm">
              <kbd className="rounded border bg-muted px-1.5 py-0.5">Z</kbd>{" "}
              positiva ·{" "}
              <kbd className="rounded border bg-muted px-1.5 py-0.5">X</kbd>{" "}
              negativa ·{" "}
              <kbd className="rounded border bg-muted px-1.5 py-0.5">C</kbd>{" "}
              próxima volta
            </p>
            <p role="status" className="text-sm text-muted-foreground">
              {mutation.isPending
                ? "Salvando veredito…"
                : current
                  ? `Julgando: #${current.registration.number} · ${current.competitor.name}`
                  : "Todos os competidores desta armada foram julgados."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={shortcutsEnabled}
            onClick={() => onShortcutsEnabledChange(!shortcutsEnabled)}
          >
            {shortcutsEnabled ? "Pausar atalhos" : "Ativar atalhos"}
          </Button>
        </div>
      )}
      {registrations.map((registration) => (
        <RegistrationCard
          key={registration.id}
          group={group}
          allowCorrection={allowCorrection}
          registration={registration}
          saving={mutation.isPending || advancing}
          onRegisterShot={submit}
          isJudging={registration.id === current?.registration.id}
          currentCompetitorId={
            registration.id === current?.registration.id
              ? current.competitor.id
              : undefined
          }
          results={results.filter(
            (result) => result.registrationId === registration.id,
          )}
        />
      ))}
    </div>
  );
}
