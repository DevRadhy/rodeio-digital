import type { Competitor } from "./competitor";

export interface Registration {
  id: string;
  name?: string;
  competitors: Competitor[];
}
