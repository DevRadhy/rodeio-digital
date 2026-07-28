import type { CategorySchemaType } from "@/schemas/category-schema";

export interface Force {
  name: string;
  qualifyingScores: number[];
}

export interface Category extends CategorySchemaType {
  id: string;
  forces: Force[];
}