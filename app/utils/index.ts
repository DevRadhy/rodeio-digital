import type { Phase, Status } from "@/features/competition/types/competition";

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
        bg: "bg-amber-500",
        color: "text-muted",
      };
    case "final": {
      return {
        text: "Final",
        bg: "bg-emerald-500",
        color: "text-muted",
      };
    }
    default: {
      return {
        text: "Não Iniciada",
        bg: "bg-secondary",
        color: "text-primary",
      };
    }
  }
};
