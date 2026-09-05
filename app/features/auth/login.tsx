import { type FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./auth-context";
export default function Login() {
  const auth = useAuth(),
    navigate = useNavigate(),
    location = useLocation();
  const [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  if (!auth.loading && auth.signedIn)
    return (
      <Navigate
        to={auth.user?.globalRole === "PLATFORM_ADMIN" ? "/system" : "/events"}
        replace
      />
    );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await auth.login(String(data.get("email")), String(data.get("password")));
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? "/events", { replace: true });
    } catch (cause: unknown) {
      const message =
        typeof cause === "object" &&
        cause !== null &&
        "response" in cause &&
        typeof cause.response === "object" &&
        cause.response !== null &&
        "data" in cause.response &&
        typeof cause.response.data === "object" &&
        cause.response.data !== null &&
        "message" in cause.response.data &&
        typeof cause.response.data.message === "string"
          ? cause.response.data.message
          : null;
      setError(message ?? "Não foi possível entrar.");
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-3xl uppercase">
            Rodeo Digital
          </CardTitle>
          <CardDescription>
            Entre com a conta fornecida pelo operador da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
