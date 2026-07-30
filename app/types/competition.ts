import type { Final } from "./final";
import type { Qualification } from "./qualification";

export type Shot = boolean | null;

export type Phase = "qualification" | "final" | "closed";
export type Status = "running" | "paused" | "finished";

export interface CompetitionSession {
  categoryId: string;
  status: Status;
  run: Competition;
  activeGroupId: string | null;
}

export interface Competition {
  categoryId: string;
  phase: Phase;
  qualification: Qualification;
  final?: Final;
}
