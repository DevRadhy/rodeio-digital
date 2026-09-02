import { isAxiosError } from "axios";

export function formErrorMessages(errors: unknown): string[] {
  if (!errors || typeof errors !== "object") return [];
  const node = errors as Record<string, unknown>;
  const messages = typeof node.message === "string" ? [node.message] : [];
  for (const [key, value] of Object.entries(node)) {
    if (!["message", "ref", "type", "types"].includes(key))
      messages.push(...formErrorMessages(value));
  }
  return [...new Set(messages)];
}

export function requestErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback;
  if (!error.response)
    return "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.";
  const message = error.response.data?.message;
  const translations: Record<string, string> = {
    "There are not enough registrations to start the competition":
      "Cadastre pelo menos uma inscrição antes de iniciar a competição.",
    "Competition already exists":
      "Esta competição já foi iniciada. Atualize a página para entrar.",
    "CPF does not match competitor id":
      "O CPF informado não corresponde ao competidor selecionado.",
    "Invalid final qualification cuts.":
      "Confira os cortes das forças e a quantidade de voltas.",
    "Qualification cuts must be unique across final groups.":
      "Cada corte só pode ser usado em uma força.",
    "Final bonus requires a positive integer number of lives.":
      "Informe um número inteiro de vidas de bônus maior que zero.",
  };
  if (typeof message === "string" && translations[message])
    return translations[message];
  if (
    typeof message === "string" &&
    message.length < 250 &&
    /^(Novas inscrições|Informe a quantidade)/.test(message)
  )
    return message;
  return fallback;
}
