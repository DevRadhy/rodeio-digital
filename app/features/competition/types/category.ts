interface Qualification {
  rounds: number;
  pelotonSize: number;
  elimination: boolean;
}

interface FinalGroups {
  id: string;
  name: string;
  qualificationScores: number[];
}

export interface CategoryDetail {
  id: string;
  name: string;
  duel: boolean;
  competitorsPerRegistration: number;
  qualification: Qualification;
  finals: FinalGroups[];
}
