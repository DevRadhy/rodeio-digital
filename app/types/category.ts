export interface Group {
  id: string;
  name: string;
  qualifyingShots: number[];
}

export interface Category {
  id: string;
  name: string;
  competitorsPerRegistration: number;
  pricePerRegistration: number;
  qualification: Qualification;
  final: {
    duel: boolean;
    groups: Group[];
  };
}

interface Qualification {
  qualifyingRounds: number;
  elimination: boolean;
}
