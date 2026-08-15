import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import type { Competitor } from "@/types/competitor";
import { ShotButtons } from "./shot-buttons";

interface CompetitionCompetitorProps {
  competitor: Competitor;
}

export function CompetitionCompetitor({
  competitor,
}: CompetitionCompetitorProps) {
  return (
    <Item size={"xs"}>
      <ItemContent>
        <ItemTitle className="text-base font-bold">{competitor.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <ShotButtons value={null} setShot={() => {}} disabled={false} />
      </ItemActions>
    </Item>
  );
}
