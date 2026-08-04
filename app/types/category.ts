export interface Group {
  id: string;
  name: string;
  qualifyingScores: number[];
}

export interface Category {
  id: string;
  name: string;
  competitorsPerRegistration: number;
  pricePerRegistration: number;
  duel: boolean;
  qualification: Qualification;
}

interface Qualification {
  rounds: number;
  groups: Group[];
}
