import { Button } from "@/components/ui/button";
import { api } from "@/providers/api";
import { groupKeys } from "../api/group-queries";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Competition, Group } from "../types/competition";
import { groupOptions, roundOptions } from "../api/group-queries";
import { CompetitionFooter } from "./competition-footer";
import { CompetitionHeader } from "./competition-header";
import { CompetitionList } from "./competition-list";

interface CompetitionGroupProps {
  group: Group;
  competition: Competition;
}
export function CompetitionGroup({
  group: summary,
  competition,
}: CompetitionGroupProps) {
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
  return (
    <div className="space-y-4">
      {groupQuery.data.roundNumber === 0 && (
        <Button
          type="button"
          disabled={start.isPending}
          onClick={() => start.mutate()}
        >
          Iniciar final deste grupo
        </Button>
      )}
      {start.isError && <p>Não foi possível iniciar a final.</p>}
      <nav aria-label="Rodadas" className="flex flex-wrap gap-2">
        {Array.from(
          { length: groupQuery.data.roundNumber },
          (_, index) => index + 1,
        ).map((number) => (
          <Button
            key={number}
            type="button"
            aria-current={selected === number ? "page" : undefined}
            variant={selected === number ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelected(number);
              setFollowsCurrent(number === groupQuery.data.roundNumber);
            }}
          >
            {number}
          </Button>
        ))}
      </nav>
      {selected !== null && roundQuery.isPending && <p>Carregando rodada...</p>}
      {roundQuery.isError && <p>Não foi possível carregar a rodada.</p>}
      {group && roundQuery.data && (
        <>
          <CompetitionHeader group={group} competition={competition} />
          <CompetitionList
            group={group}
            registrations={roundQuery.data.registrations}
            results={roundQuery.data.results}
          />
          {roundQuery.data.number === groupQuery.data.roundNumber && (
            <CompetitionFooter group={group} competition={competition} />
          )}
        </>
      )}
    </div>
  );
}
