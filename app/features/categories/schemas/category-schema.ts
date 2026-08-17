import { z } from "zod";

const finalSchema = z.object({
  name: z
    .string()
    .min(1, "Informe o nome do grupo")
    .max(32, "O nome deve ter no máximo 32 caracteres"),

  qualificationScores: z
    .array(z.number().int().positive())
    .min(1, "Informe a quantidade de armadas"),
});

export const CategorySchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .max(32, "O nome deve ter pelo menos 32 caracteres"),
    competitorsPerRegistration: z
      .number("Informe o número de competidores")
      .positive()
      .min(1, "Informe pelo menos 1 competidor")
      .max(50, "Máximo de 50 competidores"),
    qualification: z.object({
      rounds: z
        .number("Informe o número de rodadas")
        .int()
        .min(1, "Informe pelo menos uma rodada"),
      pelotonSize: z
        .number("Informe o tamanho do pelotão")
        .int()
        .min(5, "O pelotão deve conter pelo menos 5 inscrições"),
      elimination: z.boolean(),
    }),
    duel: z.boolean(),
    finals: z.array(finalSchema),
  })
  .superRefine((data, ctx) => {
    const usedShots = new Map<number, number>();

    data.finals.forEach((group, groupIndex) => {
      if (group.qualificationScores.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: `O grupo ${group.name} deve possuir armadas de classificatória`,
          path: ["finals"],
        });
      }

      group.qualificationScores.forEach((shot) => {
        if (
          shot < 1 ||
          shot > data.qualification.rounds * data.competitorsPerRegistration
        ) {
          ctx.addIssue({
            code: "custom",
            message: `As armadas de classificatória do grupo ${group.name} devem estar entre 1 e ${data.qualification.rounds * data.competitorsPerRegistration}`,
            path: ["finals"],
          });
        }

        if (usedShots.has(shot)) {
          ctx.addIssue({
            code: "custom",
            message: `O quantidade de ${shot} armadas já está sendo usado`,
            path: ["finals"],
          });
        } else {
          usedShots.set(shot, groupIndex);
        }
      });
    });
  });

export type CreateCategoryInput = z.infer<typeof CategorySchema>;
