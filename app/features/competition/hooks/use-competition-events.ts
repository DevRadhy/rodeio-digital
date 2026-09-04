import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api, getAccessToken, getActiveEventId } from "@/providers/api";

const competitionKeys = [
  "qualification-review",
  "scoreboard",
  "competition",
  "groups",
  "competition-group",
  "competition-round",
  "group-registrations",
] as const;

export function useCompetitionEvents(competitionId: string) {
  const queryClient = useQueryClient();
  const [connection, setConnection] = useState<
    "connecting" | "live" | "reconnecting"
  >("connecting");

  useEffect(() => {
    const controller = new AbortController();
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        for (const key of competitionKeys)
          void queryClient.invalidateQueries({
            queryKey: [key, competitionId],
          });
      }, 50);
    };
    const retry = () =>
      new Promise<void>((resolve) => {
        const timeout = setTimeout(resolve, 2_000);
        controller.signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timeout);
            resolve();
          },
          { once: true },
        );
      });

    async function connect() {
      let firstAttempt = true;
      while (!controller.signal.aborted) {
        const eventId = getActiveEventId();
        const token = getAccessToken();
        if (!eventId || !token) return;
        setConnection(firstAttempt ? "connecting" : "reconnecting");
        firstAttempt = false;
        try {
          const response = await fetch(
            `${(api.defaults.baseURL ?? "").replace(/\/$/, "")}/events/${encodeURIComponent(eventId)}/competition/${competitionId}/events`,
            {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            },
          );
          if (!response.ok || !response.body)
            throw new Error("SSE indisponível");
          setConnection("live");
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          while (!controller.signal.aborted) {
            const { done, value } = await reader.read();
            if (done) throw new Error("SSE encerrado");
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split("\n\n");
            buffer = events.pop() ?? "";
            if (events.some((event) => event.includes("data:"))) refresh();
          }
        } catch {
          if (!controller.signal.aborted) {
            setConnection("reconnecting");
            await retry();
          }
        }
      }
    }

    void connect();
    return () => {
      controller.abort();
      clearTimeout(refreshTimer);
    };
  }, [competitionId, queryClient]);

  return connection;
}
