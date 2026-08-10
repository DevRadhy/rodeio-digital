import type { Competitor } from "@/types/competitor";
import { ShotButtons } from "./shot-buttons";
import { Item, ItemActions, ItemContent, ItemTitle } from "../../ui/item";
import type { Registration } from "@/types/registration";
import type { Competition, CompetitionGroup, Shot } from "@/types/competition";
import { CompetitionService } from "@/services/competition-service";
import { useCompetitionSessionStore } from "@/stores/competition";
import { useParams } from "react-router";

interface CompetitionCompetitorProps {
  competitor: Competitor;
  registration: Registration;
  group: CompetitionGroup;
}

export function CompetitionCompetitor({
  competitor,
  registration,
  group,
}: CompetitionCompetitorProps) {
  const { updateCompetition, getSession } = useCompetitionSessionStore();

  const { categoryId } = useParams();

  if (!categoryId) return;

  const onSetShot = (value: Shot) => {
    const updatedGroup = CompetitionService.updateShot(
      group,
      registration.id,
      competitor.id,
      value,
    );

    if (!categoryId) return;

    const session = getSession(categoryId);

    const newSession: Competition = {
      ...session,
      groups: session.groups.map((group) => {
        if (group.id !== updatedGroup.id) {
          return group;
        }

        return updatedGroup;
      }),
    };

    updateCompetition(newSession);
  };

  const round = group.rounds.find(
    (round) => round.number === group.currentRound,
  );

  const result = round?.results.find(
    (result) => result.registrationId === registration.id,
  );

  const competitorShot = result?.competitors.find(
    (c) => c.competitorId === competitor.id,
  );

  return (
    <Item>
      <ItemContent>
        <ItemTitle className="text-base font-bold">{competitor.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <ShotButtons
          value={competitorShot?.shot ?? null}
          setShot={onSetShot}
          disabled={group.status !== "running"}
        />
      </ItemActions>
    </Item>
  );
}
