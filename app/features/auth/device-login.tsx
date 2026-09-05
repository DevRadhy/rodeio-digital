import { REGEXP_ONLY_DIGITS } from "input-otp";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForceLightMode } from "@/features/scoreboard/hooks/use-force-light-mode";
import { useAuth } from "./auth-context";

export default function DeviceLogin() {
  useForceLightMode();
  const auth = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [activationCode, setActivationCode] = useState("");

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
    try {
      const role = await auth.loginDevice(activationCode);
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
    <main className="light grid min-h-svh place-items-center bg-background p-4 text-foreground">
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
              <InputOTP
                id="activation-code"
                name="activationCode"
                value={activationCode}
                onChange={setActivationCode}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                autoComplete="off"
                required
                autoFocus
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} aria-invalid={Boolean(error)} />
                  <InputOTPSlot index={1} aria-invalid={Boolean(error)} />
                  <InputOTPSlot index={2} aria-invalid={Boolean(error)} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} aria-invalid={Boolean(error)} />
                  <InputOTPSlot index={4} aria-invalid={Boolean(error)} />
                  <InputOTPSlot index={5} aria-invalid={Boolean(error)} />
                </InputOTPGroup>
              </InputOTP>
            </Field>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button
              className="w-full"
              type="submit"
              disabled={pending || activationCode.length !== 6}
            >
              {pending ? "Ativando…" : "Ativar dispositivo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
