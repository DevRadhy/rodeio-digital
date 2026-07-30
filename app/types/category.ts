import type { CategorySchemaType } from "@/schemas/category-schema";

export interface ForceClassification {
  registrationId: string;
  forceId: string;
}

export interface Force {
  id: string;
  name: string;
  qualifyingScores: number[];
}

export interface Category extends CategorySchemaType {
  id: string;
  forces: Force[];
}
