import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import type { Competitor } from "@/types/competitor";
import type { Group, Result, Shot } from "../types/competition";
import { ShotButtons } from "./shot-buttons";

interface CompetitionCompetitorProps {
  group: Group;
  competitor: Competitor;
  result?: Result;
  handleRegisterShot(competitorId: string, shot: Shot): void;
}

export function CompetitionCompetitor({
  group,
  competitor,
  result,
  handleRegisterShot,
}: CompetitionCompetitorProps) {
  return (
    <Item size={"xs"}>
      <ItemContent>
        <ItemTitle className="text-base font-bold">{competitor.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <ShotButtons
          value={result?.shot ?? null}
          disabled={
            group.status === "finished" ||
            group.currentRound.status === "finished"
          }
          setShot={(shot) => handleRegisterShot(competitor.id, shot)}
        />
      </ItemActions>
    </Item>
  );
}
