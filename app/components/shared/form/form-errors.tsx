import { formErrorMessages } from "@/lib/form-errors";

export function FormErrors({ errors }: { errors: unknown }) {
  const messages = formErrorMessages(errors);
  if (!messages.length) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
    >
      <p className="font-medium">Confira os dados do formulário</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
