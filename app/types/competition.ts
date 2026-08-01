import type { CompetitorResult } from "./competitor";

export type Shot = boolean | null;

export type Phase = "qualification" | "Competition" | "closed";
export type Status = "running" | "paused" | "finished";

export interface Competition {
  categoryId: string;
  status: Status;
  phase: Phase;
  groups: CompetitionGroup[];
}

export interface CompetitionGroup {
  id: string;
  name: string;
  currentRound: number;
  registrations: [];
  status: Status;
  rounds: CompetitionRound[];
}

export interface CompetitionRound {
  number: number;
  results: CompetitionResult[];
}

export interface CompetitionResult {
  registrationId: string;
  competitors: CompetitorResult[];
}
