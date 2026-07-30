import type { Category } from "@/types/category";
import type { Competition, Shot } from "@/types/competition";
import type { Registration } from "@/types/registration";
import {
  finishRound,
  isFinished,
  setFinalShot,
  startRound,
} from "./final-service";
import { createFinalGroups } from "./force-service";
import {
  createQualification,
  finishCurrentRound,
  isLastQualificationRound,
  setQualificationShot,
} from "./qualification-service";

function createCompetition(
  category: Category,
  registrations: Registration[],
): Competition {
  return {
    categoryId: category.id,
    phase: "qualification",
    qualification: createQualification(category, registrations),
    final: undefined,
  };
}

function updateQualificationShot(
  competition: Competition,
  registrationId: string,
  competitorId: string,
  shot: Shot,
): Competition {
  return {
    ...competition,
    qualification: setQualificationShot(
      competition.qualification,
      registrationId,
      competitorId,
      shot,
    ),
  };
}

function finishQualificationRound(
  category: Category,
  competition: Competition,
): Competition {
  if (!isLastQualificationRound(competition.qualification, category)) {
    return {
      ...competition,
      qualification: finishCurrentRound(category, competition.qualification),
    };
  }

  return {
    categoryId: category.id,
    phase: "final",
    qualification: competition.qualification,
    final: {
      groups: createFinalGroups(category, competition.qualification),
    },
  };
}

function startFinalRound(
  competition: Competition,
  groupId: string,
  registrations: Registration[],
): Competition {
  if (!competition.final) {
    return competition;
  }

  return {
    ...competition,
    final: startRound(competition.final, groupId, registrations),
  };
}

function updateFinalShot(
  competition: Competition,
  groupId: string,
  registrationId: string,
  competitiorId: string,
  shot: Shot,
): Competition {
  if (!competition.final) {
    return competition;
  }

  return {
    ...competition,
    final: setFinalShot(
      competition.final,
      groupId,
      registrationId,
      competitiorId,
      shot,
    ),
  };
}

function finishFinalRound(
  competition: Competition,
  groupId: string,
): Competition {
  if (!competition.final) {
    return competition;
  }

  const final = finishRound(competition.final, groupId);

  const closed = final.groups.every(isFinished);

  return {
    ...competition,
    phase: closed ? "closed" : "final",
    final,
  };
}

export const CompetitionService = {
  create: createCompetition,
  qualification: {
    updateShot: updateQualificationShot,
    finishRound: finishQualificationRound,
  },
  final: {
    startRound: startFinalRound,
    updateShot: updateFinalShot,
    finishRound: finishFinalRound,
  }
}