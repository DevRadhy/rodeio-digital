import { Navigate, Outlet, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "./auth-context";

export default function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading)
    return (
      <main className="grid min-h-svh place-items-center text-muted-foreground">
        Carregando acesso...
      </main>
    );
  if (!auth.signedIn)
    return (
      <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
    );

  if (auth.error || !auth.user) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Não foi possível carregar seu acesso</CardTitle>
            <CardDescription>
              {auth.error ??
                "A sessão está ativa, mas o perfil não foi encontrado."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={auth.reload}>Tentar novamente</Button>
            <Button variant="outline" onClick={() => void auth.logout()}>
              Sair
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (
    auth.user.globalRole === "USER" &&
    !auth.event &&
    location.pathname !== "/events"
  )
    return <Navigate to="/events" replace />;
  if (
    auth.user.globalRole === "PLATFORM_ADMIN" &&
    !auth.event &&
    !location.pathname.startsWith("/system") &&
    location.pathname !== "/events"
  )
    return <Navigate to="/system" replace />;
  if (
    auth.user.globalRole === "PLATFORM_OPERATOR" &&
    !auth.event &&
    location.pathname !== "/events" &&
    !location.pathname.startsWith("/system")
  )
    return <Navigate to="/events" replace />;
  return <Outlet />;
}
