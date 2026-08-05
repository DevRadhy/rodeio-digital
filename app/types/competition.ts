import type { CompetitorResult } from "./competitor";
import type { Registration } from "./registration";

export type Shot = boolean | null;

export type Phase = "qualification" | "final" | "closed";
export type Status = "not_started" | "running" | "paused" | "finished";

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
  registrations: Registration[];
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
