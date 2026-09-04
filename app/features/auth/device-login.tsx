import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "./auth-context";

export default function DeviceLogin() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (auth.signedIn)
    return (
      <Navigate
        to={
          auth.user?.operationalRole === "DISPLAY_GATE"
            ? "/gate"
            : "/scoreboard"
        }
        replace
      />
    );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const role = await auth.loginDevice(
        String(data.get("activationCode") ?? ""),
      );
      navigate(role === "DISPLAY_GATE" ? "/gate" : "/scoreboard", {
        replace: true,
      });
    } catch {
      setError("Código de ativação inválido ou dispositivo revogado.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Ativar telão</CardTitle>
          <CardDescription>
            Informe o código gerado pela administração da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <Field>
              <FieldLabel htmlFor="activation-code">
                Código de ativação
              </FieldLabel>
              <Input
                id="activation-code"
                name="activationCode"
                autoComplete="off"
                minLength={32}
                required
                autoFocus
              />
            </Field>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={pending}>
              {pending ? "Ativando…" : "Ativar dispositivo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
