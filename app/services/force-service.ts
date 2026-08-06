import type { Category } from "@/types/category";
import type {
  ClassifiedGroup,
  QualificationResult,
} from "@/types/qualification";
import type { Registration } from "@/types/registration";
import { v4 } from "uuid";

export class ForceService {
  static classify(
    category: Category,
    results: QualificationResult[],
  ): ClassifiedGroup[] {
    const groups = new Map<string, Registration[]>();

    for (const result of results) {
      const classification = category.final.groups.find((group) =>
        group.qualifyingShots.includes(result.shots),
      );

      if (!classification) {
        continue;
      }

      const groupId = classification.id;

      const registrations = groups.get(groupId) ?? [];

      registrations.push(result.registration);

      groups.set(groupId, registrations);
    }

    return [...groups.entries()].map(([groupId, registrations]) => ({
      groupId,
      registrations,
    }));
  }
}
