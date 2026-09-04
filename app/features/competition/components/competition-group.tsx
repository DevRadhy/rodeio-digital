import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/providers/api";
import { groupKeys, groupOptions, roundOptions } from "../api/group-queries";
import type { Competition, Group } from "../types/competition";
import { CompetitionFooter } from "./competition-footer";
import { CompetitionHeader } from "./competition-header";
import { CompetitionList } from "./competition-list";
import { ResetGroupBonuses } from "./reset-group-bonuses";

interface CompetitionGroupProps {
  group: Group;
  competition: Competition;
  groupIndex: number;
  groupCount: number;
  isActive: boolean;
}
export function CompetitionGroup({
  group: summary,
  competition,
  groupIndex,
  groupCount,
  isActive,
}: CompetitionGroupProps) {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const transmission = useMutation({
    mutationFn: () =>
      api.post(`/competition/${competition.id}/scoreboard/focus`, {
        groupId: summary.id,
      }),
  });
  useEffect(() => {
    if (isActive && competition.status === "running") transmission.mutate();
  }, [competition.status, isActive, transmission.mutate]);
  const groupQuery = useQuery(groupOptions(competition.id, summary.id));
  const queryClient = useQueryClient();
  const start = useMutation({
    mutationFn: () =>
      api.post(`/competition/${competition.id}/groups/${summary.id}/start`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: groupKeys.group(competition.id, summary.id),
      }),
  });
  const current = groupQuery.data?.roundNumber || null;
  const [selected, setSelected] = useState<number | null>(null);
  const [followsCurrent, setFollowsCurrent] = useState(true);
  useEffect(() => {
    if (followsCurrent && current !== null) setSelected(current);
  }, [current, followsCurrent]);
  const roundQuery = useQuery(
    roundOptions(competition.id, summary.id, selected),
  );
  const group = useMemo<Group | null>(() => {
    if (!groupQuery.data || !roundQuery.data) return null;
    const historical = roundQuery.data.number !== groupQuery.data.roundNumber;
    return {
      id: groupQuery.data.id,
      competitionId: groupQuery.data.competitionId,
      name: groupQuery.data.name,
      status: historical ? "finished" : groupQuery.data.status,
      currentRound: {
        id: roundQuery.data.id,
        number: roundQuery.data.number,
        status: historical ? "finished" : roundQuery.data.status,
      },
    };
  }, [groupQuery.data, roundQuery.data]);
  if (groupQuery.isPending) return <p>Carregando pelotão...</p>;
  if (groupQuery.isError) return <p>Não foi possível carregar o pelotão.</p>;
  if (
    groupQuery.data.phase === "final" &&
    summary.totalRegistrationCount === 0
  ) {
    return (
      <div
        role="status"
        className="rounded-xl border border-dashed p-8 text-center text-muted-foreground"
      >
        {competition.category.categoryType === "duel"
          ? "Nenhum competidor classificou nesta força."
          : "Nenhum competidor classificou neste grupo de final."}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {competition.phase === "final" &&
        competition.status === "running" &&
        competition.category.finalBonusEnabled &&
        groupQuery.data.status !== "finished" && (
          <ResetGroupBonuses
            competitionId={competition.id}
            groupId={summary.id}
            groupName={groupQuery.data.name}
          />
        )}
      {groupQuery.data.roundNumber === 0 &&
        groupQuery.data.status !== "finished" &&
        competition.status === "running" && (
          <Button
            type="button"
            disabled={start.isPending}
            onClick={() => start.mutate()}
          >
            Iniciar final deste grupo
          </Button>
        )}
      {groupQuery.data.roundNumber === 0 &&
        competition.status === "finished" && (
          <p>Grupo encerrado sem iniciar a final.</p>
        )}
      {start.isError && (
        <p role="alert" className="text-destructive">
          {isAxiosError(start.error)
            ? (start.error.response?.data?.message ??
              "Não foi possível iniciar a final.")
            : "Não foi possível iniciar a final."}
        </p>
      )}
      {selected !== null && groupQuery.data.roundNumber > 0 && (
        <CompetitionHeader
          selectedRound={selected}
          availableRounds={groupQuery.data.roundNumber}
          totalRounds={
            competition.phase === "qualification"
              ? competition.category.qualification.rounds
              : undefined
          }
          groupLabel={
            competition.phase === "qualification"
              ? `Pelotão ${groupIndex} de ${groupCount}`
              : `${groupQuery.data.name} · Grupo ${groupIndex} de ${groupCount}`
          }
          pending={
            roundQuery.data
              ? roundQuery.data.registrations.reduce(
                  (count, registration) =>
                    count +
                    registration.competitors.filter(
                      (competitor) =>
                        !roundQuery.data.results.some(
                          (result) =>
                            result.registrationId === registration.id &&
                            result.competitorId === competitor.id,
                        ),
                    ).length,
                  0,
                )
              : null
          }
          finished={
            roundQuery.data?.status === "finished" ||
            competition.status === "finished"
          }
          onSelectRound={(number) => {
            if (number < 1 || number > groupQuery.data.roundNumber) return;
            setSelected(number);
            setFollowsCurrent(number === groupQuery.data.roundNumber);
          }}
        />
      )}
      {selected !== null && roundQuery.isPending && <p>Carregando rodada...</p>}
      {roundQuery.isError && <p>Não foi possível carregar a rodada.</p>}
      {group && roundQuery.data && (
        <>
          <CompetitionList
            key={group.currentRound.id}
            competitionRunning={competition.status === "running"}
            shortcutsEnabled={shortcutsEnabled}
            onShortcutsEnabledChange={setShortcutsEnabled}
            group={group}
            allowCorrection={competition.phase === "qualification"}
            registrations={roundQuery.data.registrations}
            results={roundQuery.data.results}
          />
          {roundQuery.data.number === groupQuery.data.roundNumber && (
            <CompetitionFooter
              group={group}
              competition={competition}
              shortcutsEnabled={shortcutsEnabled}
              hasPendingCompetitors={roundQuery.data.registrations.some(
                (registration) =>
                  registration.competitors.some(
                    (competitor) =>
                      !roundQuery.data.results.some(
                        (result) =>
                          result.registrationId === registration.id &&
                          result.competitorId === competitor.id,
                      ),
                  ),
              )}
            />
          )}
        </>
      )}
    </div>
  );
}
