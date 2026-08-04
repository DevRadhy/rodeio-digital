import type { Registration } from "./registration";

export interface QualificationResult {
  registration: Registration;
  shots: number;
}

export interface ClassifiedGroup {
  groupId: string;
  registrations: Registration[];
}
