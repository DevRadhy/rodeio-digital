import type { Competitor } from "@/types/competitor";

export interface Registration {
  id: string;
  categoryId: string;
  number: number;
  name?: string;
  competitors: Competitor[];
}
