import type { CompetitionResult } from "@/types/competition";
import type { Registration } from "@/types/registration";

export const formatNumber = (value: number, digits = 2) => {
  return Intl.NumberFormat("pt-BR", {
    style: "decimal",
    minimumIntegerDigits: digits,
  }).format(value);
};

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const getRegistrationChuncks = (
  registrations: Registration[],
  length: number,
) => {
  const chunks = [];

  for (let i = 0; i < registrations.length; i += length) {
    chunks.push(registrations.slice(i, i + length));
  }

  return chunks;
};

export const everyPositive = (result: CompetitionResult) => {
  return result.competitors.every((competitor) => competitor.shot);
};
