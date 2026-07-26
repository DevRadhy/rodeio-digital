import { z } from "zod";

export const RegistrationSchema = z.object({
  categoryId: z.string("Você precisa informar uma modalidade."),
  competitors: z.array(
    z.object({
      name: z
        .string("Você precisa informar o nome do competidor.")
        .min(2, "O nome do competidor preciasa ter pelo menos 2 caracteres.")
        .max(32, "O nome do compeitodor é muito longo."),
    }),
  ),
});

export type RegistrationType = z.infer<typeof RegistrationSchema>;
