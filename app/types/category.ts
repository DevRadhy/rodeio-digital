export interface Group {
  id: string;
  name: string;
  qualifyingShots: number[];
}

export interface Category {
  id: string;
  name: string;
  competitorsPerRegistration: number;
  qualification: Qualification;
  duel: boolean;
  groups: Group[];
}

export interface Qualification {
  qualifyingRounds: number;
  elimination: boolean;
}
