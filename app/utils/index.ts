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
