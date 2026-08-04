import type { Category } from "@/types/category";
import type {
  Competition,
  CompetitionGroup,
  CompetitionResult,
  Shot,
} from "@/types/competition";
import type { Registration } from "@/types/registration";
import { v4 } from "uuid";

function getRegistrationChuncks(registrations: Registration[], length: number) {
  const chunks = [];

  for (let i = 0; i < registrations.length; i += length) {
    chunks.push(registrations.slice(i, i + length));
  }

  return chunks;
}

function create(
  category: Category,
  registrations: Registration[],
): Competition {
  const registrationsChunks = getRegistrationChuncks(registrations, 5);

  return {
    categoryId: category.id,
    phase: "qualification",
    status: "running",
    groups: registrationsChunks.map((registrations, index) => ({
      id: v4(),
      currentRound: 1,
      name: `Pelotão ${index + 1}`,
      status: "running",
      registrations: registrations,
      rounds: Array.from({ length: category.rounds }, () => null).map(
        (_, round) => ({
          number: round + 1,
          results: registrations.map((registration) => ({
            registrationId: registration.id,
            competitors: registration.competitors.map((competitor) => ({
              competitorId: competitor.id,
              shot: null,
            })),
          })),
        }),
      ),
    })),
  };
}

function updateShot(
  group: CompetitionGroup,
  registrationId: string,
  competitorId: string,
  shot: Shot,
): CompetitionGroup {
  const rounds = group.rounds.map((round) => {
    if (round.number !== group.currentRound) {
      return round;
    }

    return {
      ...round,
      results: round.results.map((result) => {
        if (result.registrationId !== registrationId) {
          return result;
        }

        return {
          ...result,
          competitors: result.competitors.map((competitor) => {
            if (competitor.competitorId !== competitorId) {
              return competitor;
            }

            return {
              ...competitor,
              shot,
            };
          }),
        };
      }),
    };
  });

  return {
    ...group,
    rounds: rounds,
  };
}

function nextRound(
  competition: Competition,
  group: CompetitionGroup,
  category: Category,
): Competition {
  const results = group.rounds[group.currentRound - 1].results;
  const isCompetitionFinished = isFinished(results);

  return {
    ...competition,
    groups: competition.groups.map((g) => {
      if (g.id !== group.id) {
        return g;
      }

      if (competition.phase === "qualification") {
        if (group.currentRound === category.rounds) {
          return {
            ...group,
            currentRound: group.currentRound,
            status: "finished",
          };
        }

        return {
          ...group,
          currentRound: group.currentRound + 1,
        };
      }

      return {
        ...group,
        currentRound: group.currentRound + 1,
        status: isCompetitionFinished ? "finished" : "running",
        rounds: [
          ...group.rounds,
          {
            number: group.currentRound + 1,
            results: results.filter(everyPositive).map((result) => ({
              registrationId: result.registrationId,
              competitors: result.competitors.map((competitor) => ({
                ...competitor,
                shot: null,
              })),
            })),
          },
        ],
      };
    }),
  };
}

function isFinished(results: CompetitionResult[]) {
  return results.length <= 1;
}

function getCurrentRound(group: CompetitionGroup) {
  return group.rounds.at(-1);
}

function everyPositive(result: CompetitionResult) {
  return result.competitors.every((competitor) => competitor.shot);
}

function addRegistration(
  competition: Competition,
  category: Category,
  registration: Registration,
): Competition {
  if (competition.phase !== "qualification") return competition;

  const availableGroup = competition.groups.find(
    (group) => group.currentRound <= 1 && group.registrations.length < 5,
  );

  if (availableGroup) {
    return {
      ...competition,
      groups: competition.groups.map((group) => {
        if (group.id !== availableGroup.id) {
          return group;
        }

        return {
          ...group,
          registrations: [...group.registrations, registration],
          rounds: Array.from({ length: category.rounds }, () => null).map(
            (_, round) => ({
              number: round + 1,
              results: [...group.registrations, registration].map(
                (registration) => ({
                  registrationId: registration.id,
                  competitors: registration.competitors.map((competitor) => ({
                    competitorId: competitor.id,
                    shot: null,
                  })),
                }),
              ),
            }),
          ),
        };
      }),
    };
  }

  return {
    ...competition,
    groups: [
      ...competition.groups,
      {
        id: v4(),
        name: `Pelotão ${competition.groups.length + 1}`,
        currentRound: 1,
        registrations: [registration],
        status: "running",
        rounds: Array.from({ length: category.rounds }, () => null).map(
          (_, round) => ({
            number: round + 1,
            results: [
              {
                registrationId: registration.id,
                competitors: registration.competitors.map((competitor) => ({
                  competitorId: competitor.id,
                  shot: null,
                })),
              },
            ],
          }),
        ),
      },
    ],
  };
}

export const CompetitionService = {
  create,
  updateShot,
  nextRound,
  isFinished,
  addRegistration,
};
