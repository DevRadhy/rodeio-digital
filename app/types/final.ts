import type { Shot } from "./qualification";

export interface FinalResult {
  registrationId: string;
  shots: Shot[];
}

export interface FinalRound {
  number: number;
  results: FinalResult[];
}

export interface FinalCompetitor {
  registrationId: string;
  eliminated: boolean;
}

export interface FinalGroup {
  id: string;
  name: string;
  competitors: FinalCompetitor[];
  rounds: FinalRound[];
  campionId?: string;
}

export interface Final {
  groups: FinalGroup[];
}
