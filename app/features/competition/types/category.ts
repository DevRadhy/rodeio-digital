import type { CategoryType } from "@/features/categories/types/category";
interface Qualification {
  rounds: number;
  pelotonSize: number;
}

interface FinalGroups {
  id: string;
  name: string;
  qualificationScores: number[];
}

export interface CategoryDetail {
  categoryType: CategoryType;
  finalBonusEnabled: boolean;
  finalBonusLives: number;
  id: string;
  name: string;
  competitorsPerRegistration: number;
  qualification: Qualification;
  finals: FinalGroups[];
}
