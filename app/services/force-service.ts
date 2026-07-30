import type { Category, Force, ForceClassification } from "@/types/category";
import type {
  Qualification,
  QualificationRegistration,
} from "@/types/qualification";
import { qualificationRanking, registrationHits } from "./score-service";
import type { FinalGroup } from "@/types/final";
import { v4 } from "uuid";

export function assingForce(
  category: Category,
  registration: QualificationRegistration,
): Force | undefined {
  const hits = registrationHits(registration);

  return category.forces.find((force) => force.qualifyingScores.includes(hits));
}

export function classifyRegistrations(
  category: Category,
  qualification: Qualification,
): ForceClassification[] {
  return qualification.registrations.flatMap((registration) => {
    const force = assingForce(category, registration);

    if (!force) {
      return [];
    }

    return {
      registrationId: registration.registrationId,
      forceId: force.id,
    };
  });
}

export function createFinalGroups(
  category: Category,
  qualification: Qualification,
): FinalGroup[] {
  if (!category.isDuel) {
    return [
      {
        id: v4(),
        name: "Final",
        competitors: qualificationRanking(qualification).map((r) => ({
          registrationId: r.registrationId,
          eliminated: false,
        })),
        rounds: [],
      },
    ];
  }

  const classifications = classifyRegistrations(category, qualification);

  return category.forces
    .map<FinalGroup>((force) => ({
      id: force.id,
      name: force.name,
      competitors: classifications
        .filter((c) => c.forceId === force.id)
        .map((c) => ({
          registrationId: c.registrationId,
          eliminated: false,
        })),
      rounds: [],
      championId: undefined,
    }))
    .filter((group) => group.competitors.length > 0);
}
