import type { CompetitorShot } from "./competitor";

export interface FinalResult {
  registrationId: string;
  shots: CompetitorShot[];
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
  championId?: string;
}

export interface Final {
  groups: FinalGroup[];
}
