import { z } from "zod";

const groupSchema = z.object({
  name: z
    .string()
    .min(1, "Informe o nome do grupo")
    .max(32, "O nome deve ter no máximo 32 caracteres"),

  qualifyingShots: z
    .array(z.number().int().positive())
    .min(1, "Informe pelo menos uma quantidade de armadas"),
});

export const CategorySchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .max(32, "O nome deve ter pelo menos 32 caracteres"),
    competitorsPerRegistration: z
      .number()
      .positive()
      .min(1, "Informe pelo menos 1 competidor")
      .max(50, "Máximo de 50 competidores"),
    qualification: z.object({
      qualifyingRounds: z
        .number()
        .int()
        .min(1, "Informe pelo menos uma rodada"),
      elimination: z.boolean(),
    }),
    duel: z.boolean(),
    groups: z.array(groupSchema),
  })
  .superRefine((data, ctx) => {
    const usedShots = new Map<number, number>();

    data.groups.forEach((group, groupIndex) => {
      if (group.qualifyingShots.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: `O grupo ${group.name} deve possuir armadas de classificatória`,
          path: ["groups"],
        });
      }

      group.qualifyingShots.forEach((shot) => {
        if (
          shot < 1 ||
          shot >
            data.qualification.qualifyingRounds *
              data.competitorsPerRegistration
        ) {
          ctx.addIssue({
            code: "custom",
            message: `As armadas de classificatória do grupo ${group.name} devem estar entre 1 e ${data.qualification.qualifyingRounds * data.competitorsPerRegistration}`,
            path: ["groups"],
          });
        }

        if (usedShots.has(shot)) {
          ctx.addIssue({
            code: "custom",
            message: `O quantidade de ${shot} armadas já está sendo usado`,
            path: ["groups"],
          });
        } else {
          usedShots.set(shot, groupIndex);
        }
      });
    });
  });

export type CreateCategoryInput = z.infer<typeof CategorySchema>;
