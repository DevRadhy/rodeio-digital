import { z } from "zod";

export const CategorySchema = z
  .object({
    name: z
      .string("Você precisa informar o nome da modalidade.")
      .min(3, "O nome da modalidade precisa conter pelo menos 3 caracteres.")
      .max(32, "O tamanho máximo para o nome é de 32 caracteres."),
    competitors: z
      .number("Você precisa informar o número de competidores por inscrição.")
      .positive("O número precisa ser maior que 0.")
      .min(
        1,
        "O número mínimo de competidores por inscrição é de 1 competidor.",
      )
      .max(
        50,
        "O número máximo de competidores por inscrição é de 50 competidores.",
      ),
    rounds: z
      .number("Você precisa informar o número de voltas de classificatória.")
      .positive("O número precisar ser maior que 0.")
      .min(1, "O número mínimo de voltas não pode ser menor que 1.")
      .max(100, "O número máximo de voltas não pode ser maior 100."),
    price: z
      .float32("Você precisa informar o valor da inscriçao.")
      .min(0, "O valor minimo de incrição não pode ser menor que R$0,00.")
      .max(99999, "Valor de inscrição inválido."),
    isDuel: z.boolean(),
    forces: z.array(
      z.object({
        name: z
          .string("Você precisa informar o nome da força.")
          .max(24, "O tamanho máximo para o nome é de 24 caracteres."),
        qualifyingScores: z.array(
          z
            .number(
              "Você precisa informar o número de voltas de classificatória da força.",
            )
            .positive("O número precisar ser maior que 0.")
            .min(1, "O número mínimo de voltas não pode ser menor que 1.")
            .max(100, "O número máximo de voltas não pode ser maior 100."),
        ),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.isDuel) return;

    const usedRounds = new Map<number, number>();

    data.forces.forEach((force, forceIndex) => {
      if (force.qualifyingScores.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: `A força ${force.name} deve possuir pelo menos uma volta de classificatória.`,
        });
      }

      force.qualifyingScores.forEach((round, roundIndex) => {
        if (round < 1 || round > data.rounds) {
          ctx.addIssue({
            code: "custom",
            message: `As voltas de classificatória da força ${force.name} devem estar entre 1 e ${data.rounds}.`,
          });
        }

        if (usedRounds.has(round)) {
          ctx.addIssue({
            code: "custom",
            message: `A volta ${round} já pertence a outra força.`,
          });
        } else {
          usedRounds.set(round, forceIndex);
        }
      });
    });
  });

export type CategorySchemaType = z.infer<typeof CategorySchema>;
