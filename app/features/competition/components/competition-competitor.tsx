import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import type { Competitor } from "@/types/competitor";
import type { QualificationResultState, Shot } from "../types/competition";
import { ShotButtons } from "./shot-buttons";

interface CompetitionCompetitorProps {
  competitor: Competitor;
  result?: QualificationResultState;
  handleRegisterShot(competitorId: string, shot: Shot): void;
}

export function CompetitionCompetitor({
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
          setShot={(shot) => handleRegisterShot(competitor.id, shot)}
        />
      </ItemActions>
    </Item>
  );
}
