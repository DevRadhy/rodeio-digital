import type { Competitor } from "./competitor";

export interface Registration {
  id: string;
  categoryId: string;
  number: number;
  name?: string;
  competitors: Competitor[];
}
