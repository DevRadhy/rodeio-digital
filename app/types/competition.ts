import type { Final } from "./final";
import type { Qualification } from "./qualification";

export type Shot = boolean | null;

export type Phase = "qualification" | "final" | "closed";

export interface Competition {
  categoryId: string;
  phase: Phase;
  qualification: Qualification;
  final?: Final;
}
