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
  session: unknown;
}

export interface Qualification {
  qualifyingRounds: number;
  elimination: boolean;
}
