import { z } from "zod";

export const CategorySchema = z
  .object({
    name: z
      .string("Informe o nome da modalidade.")
      .min(3, "O nome da modalidade precisa conter pelo menos 3 caracteres.")
      .max(
        32,
        "O tamanho máximo para o nome da modalidade é de 32 caracteres.",
      ),
    competitorsPerRegistration: z
      .number("Informe o número de competidores por inscrição.")
      .positive(
        "O número de competidores por inscrição precisa ser maior que 0.",
      )
      .min(
        1,
        "O número mínimo de competidores por inscrição é de 1 competidor.",
      )
      .max(
        50,
        "O número máximo de competidores por inscrição é de 50 competidores.",
      ),
    qualification: z.object({
      qualifyingRounds: z
        .number("Informe o número de voltas de classificatória.")
        .positive(
          "O número de voltas de classificatória precisa ser maior que 0.",
        )
        .min(
          1,
          "O número mínimo de voltas de classificatória não pode ser menor que 1.",
        )
        .max(
          100,
          "O número máximo de voltas de classificatória não pode ser maior 100.",
        ),
      elimination: z.boolean(),
    }),
    duel: z.boolean(),
    groups: z.array(
      z.object({
        id: z.string(),
        name: z
          .string("Informe o nome do grupo.")
          .max(24, "O tamanho máximo para o nome do grupo é de 24 caracteres."),
        qualifyingShots: z.array(
          z
            .number(
              "Você precisa informar o número de armadas de classificatória do grupo.",
            )
            .positive(
              "O número de armadas de classificatória do grupo precisa ser maior que 0.",
            )
            .min(
              1,
              "O número mínimo de armadas de classificatória do grupo não pode ser menor que 1.",
            )
            .max(
              100,
              "O número máximo de armadas de classificatória não pode ser maior 100.",
            ),
        ),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const usedShots = new Map<number, number>();

    data.groups.forEach((group, groupIndex) => {
      if (group.qualifyingShots.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: `O grupo ${group.name} deve possuir pelo menos uma armada de classificatória.`,
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
            message: `As armadas de classificatória do grupo ${group.name} devem estar entre 1 e ${data.qualification.qualifyingRounds * data.competitorsPerRegistration}.`,
          });
        }

        if (usedShots.has(shot)) {
          ctx.addIssue({
            code: "custom",
            message: `o número de ${shot} armadas já pertence a outra força.`,
          });
        } else {
          usedShots.set(shot, groupIndex);
        }
      });
    });
  });

export type CategorySchemaType = z.infer<typeof CategorySchema>;
