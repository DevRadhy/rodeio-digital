import type { Shot } from "./competition";

export interface CompetitorResult {
  competitorId: string;
  shot: Shot;
}

export interface Competitor {
  id: string;
  name: string;
}
