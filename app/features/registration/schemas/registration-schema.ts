import { z } from "zod";

export const RegistrationSchema = z.object({
  categoryId: z.string("Você precisa informar uma modalidade."),
  number: z.number(),
  name: z
    .string()
    .min(2, "O nome da inscrição deve ter pelo menos 2 caracteres.")
    .max(32, "O nome da inscrição é muito longo.")
    .or(z.literal(""))
    .optional(),
  competitors: z.array(
    z.object({
      id: z.string().nullable(),
      name: z
        .string("Você precisa informar o nome do competidor.")
        .min(2, "O nome do competidor precisa ter pelo menos 2 caracteres.")
        .max(32, "O nome do competidor é muito longo."),
      cpf: z.string().optional().nullable(),
    }),
  ),
});

export type CreateRegistrationInput = z.infer<typeof RegistrationSchema>;
