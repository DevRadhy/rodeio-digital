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
  return (
    <>
      <CompetitionHeader group={group} competition={competition} />

      <CompetitionList group={group} />

      <CompetitionFooter group={group} competition={competition} />
    </>
  );
}
