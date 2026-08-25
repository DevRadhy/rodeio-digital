import { useRoundGroupResults } from "../hooks/use-competition";
import type { Competition, Group } from "../types/competition";
import { CompetitionFooter } from "./competition-footer";
import { CompetitionHeader } from "./competition-header";
import { CompetitionList } from "./competition-list";

interface CompetitionGroupProps {
  group: Group;
  competition: Competition;
}

export function CompetitionGroup({
  group,
  competition,
}: CompetitionGroupProps) {
  const results = useRoundGroupResults(
    group.competitionId,
    group.id,
    group.currentRound,
  );

  if (results.isLoading) return;

  if (!results.data || results.isError) return;

  return (
    <>
      <CompetitionHeader results={results.data} competition={competition} />

      <CompetitionList group={group} results={results.data} />

      <CompetitionFooter
        group={group}
        competition={competition}
        results={results.data}
      />
    </>
  );
}
