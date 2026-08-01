
export interface ForceClassification {
  registrationId: string;
  forceId: string;
}

export interface Force {
  id: string;
  name: string;
  qualifyingScores: number[];
}

export interface Category {
  id: string;
  name: string;
  competitors: number;
  rounds: number;
  price: number;
  isDuel: boolean;
  forces: Force[];
}
