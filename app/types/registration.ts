import type { RegistrationSchemaType } from "@/schemas/registration-schema";

export interface Competitor {
  id: string;
  name: string;
}

export interface Registration extends RegistrationSchemaType {
  id: string;
  competitors: Competitor[];
}
