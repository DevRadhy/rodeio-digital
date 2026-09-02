import type { Phase, Status } from "@/features/competition/types/competition";

export interface Final {
  id: string;
  name: string;
  qualificationScores: number[];
}

export type CategoryType = "normal" | "elimination" | "summation" | "duel";

export interface Category {
  categoryType: CategoryType;
  id: string;
  name: string;
  competitorsPerRegistration: number;
  qualifyingRounds: number;
  session: CompetitionSession | null;
}

export interface Qualification {
  qualifyingRounds: number;
}

export interface CompetitionSession {
  id: string;
  status: Status;
  phase: Phase;
}
