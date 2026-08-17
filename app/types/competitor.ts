type Shot = "positive" | "negative";

export interface CompetitorResult {
  competitorId: string;
  shot: Shot;
}

export interface Competitor {
  id: string;
  name: string;
}
