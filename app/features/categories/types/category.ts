import type { Phase, Status } from "@/features/competition/types/competition";

export interface Final {
  id: string;
  name: string;
  qualificationScores: number[];
}

export interface Category {
  id: string;
  name: string;
  competitorsPerRegistration: number;
  qualifyingRounds: number;
  duel: boolean;
  session: CompetitionSession | null;
}

export interface Qualification {
  qualifyingRounds: number;
  elimination: boolean;
}

export interface CompetitionSession {
  id: string;
  status: Status;
  phase: Phase;
}
