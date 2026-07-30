import type { CompetitorShot } from "./competitor";

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
  registrations: QualificationRegistration[];
}
