import { Navigate, useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "./auth-context";
export default function Events() {
  const auth = useAuth(),
    navigate = useNavigate();
  if (auth.user?.globalRole === "PLATFORM_ADMIN")
    return <Navigate to="/system" replace />;
  return (
    <main className="container mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase">
            Selecione o evento
          </h1>
          <p className="text-muted-foreground">
            Cada evento mantém dados e permissões independentes.
          </p>
        </div>
        <Button variant="outline" onClick={() => void auth.logout()}>
          Sair
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {auth.events.map((event) => (
          <Card
            className="cursor-pointer transition hover:border-primary"
            key={event.id}
            onClick={() => {
              auth.selectEvent(event.id);
              navigate(
                auth.user?.globalRole === "PLATFORM_OPERATOR" ||
                  event.role === "ORGANIZATION_ADMIN"
                  ? "/categories"
                  : event.role === "REGISTRATION_MANAGER"
                    ? "/registrations"
                    : "/competition",
              );
            }}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{event.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      event.accessMode === "read_only" ? "outline" : "secondary"
                    }
                  >
                    {event.accessMode === "read_only"
                      ? "Somente leitura"
                      : "Leitura e escrita"}
                  </Badge>
                  <Badge variant="secondary">
                    {auth.user?.globalRole === "PLATFORM_OPERATOR"
                      ? "Administrador do evento"
                      : event.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Acessar evento
            </CardContent>
          </Card>
        ))}
      </div>
      {auth.events.length === 0 && (
        <p className="rounded-lg border p-6 text-center text-muted-foreground">
          Nenhum evento ativo está vinculado à sua conta.
        </p>
      )}
    </main>
  );
}
