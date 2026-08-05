import type { CompetitionResult, Phase, Status } from "@/types/competition";
import type { Registration } from "@/types/registration";

const A_IN_CHARCODE = 65;

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

export const getGroupName = (index: number) => {
  return String.fromCharCode(A_IN_CHARCODE + index);
};

export const formatStatus = (status: Status) => {
  switch (status) {
    case "running":
      return {
        text: "Em Andamento",
        color: "bg-emerald-500",
      };
    case "paused":
      return {
        text: "Em Pausa",
        color: "bg-amber-500",
      };
    case "finished":
      return {
        text: "Encerrada",
        color: "bg-rose-500",
      };
    case "not_started": {
      return {
        text: "Não Iniciada",
        color: "bg-secondary",
      };
    }
    default:
      return {
        text: "Não Iniciada",
        color: "bg-secondary",
      };
  }
};

export const formatPhase = (value: Phase) => {
  switch (value) {
    case "qualification":
      return {
        text: "Classificatórias",
        color: "bg-amber-500",
      };
    case "final": {
      return {
        text: "Final",
        color: "bg-emerald-500",
      };
    }
    case "closed": {
      return {
        text: "Encerrada",
        color: "bg-rose-500",
      };
    }
    default: {
      return {
        text: "Não Iniciada",
        color: "bg-secondary",
      };
    }
  }
};
