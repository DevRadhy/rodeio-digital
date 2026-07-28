export type Shot = boolean | null;

export interface CompetitorShot {
  competitorId: string;
  shot: Shot;
}

export interface QualificationRound {
  number: number;
  competitors: CompetitorShot[];
}

export interface QualificationRegistration {
  registrationId: string;
  rounds: QualificationRound[];
}

export interface Qualification {
  currentRound: number;
  registratinos: QualificationRegistration[];
}
