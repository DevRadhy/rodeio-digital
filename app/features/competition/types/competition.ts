import type { CategoryDetail } from "./category";

export type Status = "not_started" | "running" | "finished";
export type Phase = "qualification" | "final";
export type Shot = "positive" | "negative";

export interface Competition {
  id: string;
  categoryId: string;
  status: Status;
  phase: Phase;
  category: CategoryDetail;
}

export interface Group {
  activeRegistrationCount?: number;
  totalRegistrationCount?: number;
  id: string;
  competitionId: string;
  name: string;
  status: Status;
  currentRound: {
    id: string;
    status: Status;
    number: number;
  };
}

export interface GroupRegistration {
  positiveShots: number;
  totalShots: number;
  bonus?: number;
  id: string;
  number: number;
  name: string | null;
  competitors: JudgedCompetitor[];
}

export interface JudgedCompetitor extends Competitor {
  positiveShots: number;
  totalShots: number;
  recentResults: { id: string; roundNumber: number; shot: Shot }[];
}

export interface Competitor {
  id: string;
  name: string;
}

export interface RoundResults {
  competitionId: string;
  roundId: string;
  group: {
    id: string;
    name: string;
    status: Status;
  };
  round: {
    id: string;
    number: number;
  };
  results: {
    id: string;
    registrationId: string;
    competitorId: string;
    competitorName: string;
    shot: Shot;
  }[];
}

export interface Result {
  id: string;
  registrationId: string;
  competitorId: string;
  competitorName: string;
  shot: Shot;
}
