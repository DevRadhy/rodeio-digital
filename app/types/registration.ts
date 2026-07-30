import type { RegistrationSchemaType } from "@/schemas/registration-schema";
import type { Competitor } from "./competitor";

export interface Registration extends RegistrationSchemaType {
  id: string;
  competitors: Competitor[];
}
