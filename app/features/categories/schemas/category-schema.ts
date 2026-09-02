import { z } from "zod";

const finalSchema = z.object({
  name: z
    .string()
    .min(1, "Informe o nome do grupo")
    .max(32, "O nome deve ter no máximo 32 caracteres"),

  qualificationScores: z.array(z.number().int().positive()),
});

export const CategorySchema = z
  .object({
    finalBonusEnabled: z.boolean(),
    finalBonusLives: z.number().int().min(0).max(2147483647),
    categoryType: z.enum(["normal", "elimination", "summation", "duel"]),
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
    }),
    finals: z.array(finalSchema),
  })
  .superRefine((data, ctx) => {
    if (data.finalBonusEnabled && data.finalBonusLives < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Informe pelo menos uma vida de bônus",
        path: ["finalBonusLives"],
      });
    }
    const usesCuts =
      data.categoryType === "normal" || data.categoryType === "duel";
    if (
      data.finals.length === 0 ||
      (data.categoryType !== "duel" && data.finals.length !== 1)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Configure os grupos da final",
        path: ["finals"],
      });
    }
    if (
      usesCuts &&
      data.finals.some((group) => group.qualificationScores.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Informe o corte da final",
        path: ["finals"],
      });
    }
    const usedShots = new Map<number, number>();

    data.finals.forEach((group, groupIndex) => {
      if (usesCuts && group.qualificationScores.length === 0) {
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
