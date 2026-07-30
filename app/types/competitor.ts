import type { Shot } from "./competition";

export interface CompetitorShot {
  competitorId: string;
  shot: Shot;
}

export interface Competitor {
  id: string;
  name: string;
}