import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  Monitor,
  Plus,
  Search,
  Trash2,
  UnlockKeyhole,
  UserPlus,
  Users,
} from "lucide-react";
import { type FormEvent, useDeferredValue, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/providers/api";
import { useAuth } from "./auth-context";

type AccessMode = "read_write" | "read_only";
type SystemEvent = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "archived";
  accessMode: AccessMode;
  createdAt: string;
  counts: { categories: number; registrations: number; competitions: number };
};
type SystemUser = {
  id: string;
  name: string;
  email: string;
  globalRole: "PLATFORM_ADMIN" | "PLATFORM_OPERATOR" | "USER";
  ownerUserId: string | null;
  ownerName: string | null;
  operationalRole:
    | "ORGANIZATION_ADMIN"
    | "REGISTRATION_MANAGER"
    | "JUDGE"
    | "ANNOUNCER"
    | null;
  active: boolean;
  createdAt: string;
};
type Page<T> = { items: T[]; total: number; page: number; pageSize: number };
type EventDevice = {
  id: string;
  name: string;
  type: "starting_screen" | "audience_screen";
  revokedAt: string | null;
};
const PAGE_SIZE = 20;
const date = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeZone: "America/Sao_Paulo",
});

function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-col gap-3 border-t pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground" aria-live="polite">
        Mostrando {start}–{end} de {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Anterior
        </Button>
        <span className="min-w-20 text-center">
          Página {page} de {lastPage}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default function System() {
  const auth = useAuth();
  const navigate = useNavigate();
  const client = useQueryClient();
  const [tab, setTab] = useState("events");
  const [eventPage, setEventPage] = useState(1);
  const [eventSearch, setEventSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [eventDialog, setEventDialog] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [newUserRole, setNewUserRole] =
    useState<SystemUser["globalRole"]>("USER");
  const [ownerUserId, setOwnerUserId] = useState("");
  const [operationalRole, setOperationalRole] = useState<
    NonNullable<SystemUser["operationalRole"]>
  >("REGISTRATION_MANAGER");
  const [operatorTarget, setOperatorTarget] = useState<SystemEvent | null>(
    null,
  );
  const [assignedOperatorId, setAssignedOperatorId] = useState("");
  const [deviceTarget, setDeviceTarget] = useState<SystemEvent | null>(null);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] =
    useState<EventDevice["type"]>("starting_screen");
  const [activationCode, setActivationCode] = useState("");
  const [deleteEventTarget, setDeleteEventTarget] =
    useState<SystemEvent | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<SystemUser | null>(
    null,
  );
  const [accessTarget, setAccessTarget] = useState<SystemEvent | null>(null);
  const eventQuery = useDeferredValue(eventSearch.trim());
  const userQuery = useDeferredValue(userSearch.trim());

  const events = useQuery({
    queryKey: ["system", "events", eventPage, status, eventQuery],
    queryFn: async () =>
      (
        await api.get<Page<SystemEvent>>("/system/events", {
          params: {
            page: eventPage,
            pageSize: PAGE_SIZE,
            status,
            q: eventQuery,
          },
        })
      ).data,
    placeholderData: keepPreviousData,
  });
  const users = useQuery({
    queryKey: ["system", "users", userPage, userQuery],
    queryFn: async () =>
      (
        await api.get<Page<SystemUser>>("/system/users", {
          params: { page: userPage, pageSize: PAGE_SIZE, q: userQuery },
        })
      ).data,
    placeholderData: keepPreviousData,
    enabled: auth.user?.globalRole === "PLATFORM_ADMIN",
  });
  const operators = useQuery({
    queryKey: ["system", "operators"],
    enabled: auth.user?.globalRole === "PLATFORM_ADMIN",
    queryFn: async () =>
      (
        await api.get<{ id: string; name: string; email: string }[]>(
          "/system/operators",
        )
      ).data,
  });
  const assignedOperators = useQuery({
    queryKey: ["system", "event-operators", operatorTarget?.id],
    enabled: Boolean(operatorTarget),
    queryFn: async () =>
      (
        await api.get<
          { id: string; name: string; email: string; active: boolean }[]
        >(`/system/events/${operatorTarget?.id}/operators`)
      ).data,
  });
  const devices = useQuery({
    queryKey: ["system", "devices", deviceTarget?.id],
    enabled: Boolean(deviceTarget),
    queryFn: async () =>
      (
        await api.get<EventDevice[]>(
          `/system/events/${deviceTarget?.id}/devices`,
        )
      ).data,
  });
  const refreshEvents = () =>
    client.invalidateQueries({ queryKey: ["system", "events"] });
  const refreshUsers = () =>
    client.invalidateQueries({ queryKey: ["system", "users"] });

  const createEvent = useMutation({
    mutationFn: async (body: object) => api.post("/system/events", body),
    onSuccess: async () => {
      await refreshEvents();
      setEventDialog(false);
      toast.success("Evento criado com sucesso.");
    },
    onError: () =>
      toast.error("Não foi possível criar o evento. Confira os dados."),
  });
  const createUser = useMutation({
    mutationFn: async (body: object) => api.post("/system/users", body),
    onSuccess: async () => {
      await refreshUsers();
      setUserDialog(false);
      toast.success("Usuário criado.");
    },
    onError: () => toast.error("Não foi possível criar o usuário."),
  });
  const updateUser = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: object }) =>
      api.patch(`/system/users/${id}`, body),
    onSuccess: async () => {
      await refreshUsers();
      toast.success("Usuário atualizado.");
    },
    onError: () => toast.error("Não foi possível atualizar o usuário."),
  });
  const changeAccess = useMutation({
    mutationFn: async ({
      eventId,
      mode,
    }: {
      eventId: string;
      mode: AccessMode;
    }) => api.patch(`/system/events/${eventId}/access`, { mode }),
    onSuccess: async (_, variables) => {
      await refreshEvents();
      setAccessTarget(null);
      toast.success(
        variables.mode === "read_only"
          ? "Evento alterado para somente leitura."
          : "Edição do evento liberada.",
      );
    },
  });
  const grantOperator = useMutation({
    mutationFn: () =>
      api.post(`/system/events/${operatorTarget?.id}/operators`, {
        operatorId: assignedOperatorId,
      }),
    onSuccess: () => {
      setOperatorTarget(null);
      setAssignedOperatorId("");
      toast.success("Operador liberado para o evento.");
      client.invalidateQueries({ queryKey: ["system", "event-operators"] });
    },
    onError: () => toast.error("Não foi possível liberar o operador."),
  });
  const revokeOperator = useMutation({
    mutationFn: (operatorId: string) =>
      api.delete(
        `/system/events/${operatorTarget?.id}/operators/${operatorId}`,
      ),
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["system", "event-operators", operatorTarget?.id],
      });
      toast.success("Acesso do operador revogado.");
    },
  });
  const createDevice = useMutation({
    mutationFn: async () =>
      (
        await api.post<EventDevice & { activationCode: string }>(
          `/system/events/${deviceTarget?.id}/devices`,
          { name: deviceName, type: deviceType },
        )
      ).data,
    onSuccess: async (device) => {
      setActivationCode(device.activationCode);
      setDeviceName("");
      await client.invalidateQueries({
        queryKey: ["system", "devices", deviceTarget?.id],
      });
    },
    onError: () => toast.error("Não foi possível criar o dispositivo."),
  });
  const revokeDevice = useMutation({
    mutationFn: (deviceId: string) =>
      api.delete(`/system/events/${deviceTarget?.id}/devices/${deviceId}`),
    onSuccess: async () =>
      client.invalidateQueries({
        queryKey: ["system", "devices", deviceTarget?.id],
      }),
  });
  const deleteEvent = useMutation({
    mutationFn: (eventId: string) => api.delete(`/system/events/${eventId}`),
    onSuccess: async () => {
      setDeleteEventTarget(null);
      await refreshEvents();
      toast.success("Evento excluído da operação.");
    },
    onError: () => toast.error("Não foi possível excluir o evento."),
  });
  const deleteUser = useMutation({
    mutationFn: (userId: string) => api.delete(`/system/users/${userId}`),
    onSuccess: async () => {
      setDeleteUserTarget(null);
      await Promise.all([refreshUsers(), operators.refetch()]);
      toast.success("Usuário excluído e sessões revogadas.");
    },
    onError: () => toast.error("Não foi possível excluir o usuário."),
  });

  function eventSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createEvent.mutate({ name: data.get("name"), slug: data.get("slug") });
  }
  function userSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createUser.mutate({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      globalRole: newUserRole,
      ownerUserId:
        newUserRole === "USER" && operationalRole !== "ORGANIZATION_ADMIN"
          ? ownerUserId
          : null,
      operationalRole: newUserRole === "USER" ? operationalRole : null,
    });
  }

  return (
    <main className="container mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Operação da plataforma
          </p>
          <h1 className="font-display text-4xl font-extrabold uppercase">
            Administração
          </h1>
          <p className="text-muted-foreground">
            Gerencie eventos e contas da plataforma.
          </p>
        </div>
        <Button variant="outline" onClick={() => void auth.logout()}>
          Sair
        </Button>
      </header>

      <Tabs value={tab} onValueChange={(value) => value && setTab(value)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="events">
              <CalendarDays />
              Eventos
            </TabsTrigger>
            {auth.user?.globalRole === "PLATFORM_ADMIN" && (
              <TabsTrigger value="users">
                <Users />
                Usuários
              </TabsTrigger>
            )}
          </TabsList>
          {auth.user?.globalRole === "PLATFORM_ADMIN" && (
            <Button
              onClick={() =>
                tab === "events" ? setEventDialog(true) : setUserDialog(true)
              }
            >
              {tab === "events" ? (
                <>
                  <Plus />
                  Novo evento
                </>
              ) : (
                <>
                  <UserPlus />
                  Convidar usuário
                </>
              )}
            </Button>
          )}
        </div>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="gap-4">
              <div>
                <CardTitle>Eventos</CardTitle>
                <CardDescription>
                  Os eventos mais recentes aparecem primeiro.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    value={eventSearch}
                    onChange={(event) => {
                      setEventSearch(event.target.value);
                      setEventPage(1);
                    }}
                    className="pl-9"
                    placeholder="Buscar por nome ou identificador"
                    aria-label="Buscar eventos"
                  />
                </div>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    if (value) setStatus(value);
                    setEventPage(1);
                  }}
                >
                  <SelectTrigger
                    className="w-full sm:w-44"
                    aria-label="Filtrar eventos por status"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="archived">Arquivados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.isLoading && (
                <p className="py-10 text-center text-muted-foreground">
                  Carregando eventos…
                </p>
              )}
              {events.isError && (
                <p
                  className="rounded-xl bg-destructive/10 p-4 text-destructive"
                  role="alert"
                >
                  Não foi possível carregar os eventos.
                </p>
              )}
              {events.data?.items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-2xl border p-4 transition-colors hover:bg-muted/20 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{item.name}</h3>
                      <Badge
                        variant={
                          item.status === "active" ? "secondary" : "outline"
                        }
                      >
                        {item.status === "active" ? "Ativo" : "Arquivado"}
                      </Badge>
                      <Badge
                        variant={
                          item.accessMode === "read_write"
                            ? "default"
                            : "outline"
                        }
                      >
                        {item.accessMode === "read_write"
                          ? "Edição liberada"
                          : "Somente leitura"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-mono">{item.slug}</span> · criado em{" "}
                      {date.format(new Date(item.createdAt))}
                    </p>
                  </div>
                  <dl className="grid grid-cols-3 gap-5 text-center">
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Modalidades
                      </dt>
                      <dd className="font-semibold">
                        {item.counts.categories}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Inscrições
                      </dt>
                      <dd className="font-semibold">
                        {item.counts.registrations}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Competições
                      </dt>
                      <dd className="font-semibold">
                        {item.counts.competitions}
                      </dd>
                    </div>
                  </dl>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={item.status !== "active"}
                      onClick={() => {
                        auth.selectEvent(item.id);
                        navigate("/categories");
                      }}
                    >
                      Gerenciar
                    </Button>
                    {auth.user?.globalRole === "PLATFORM_ADMIN" && (
                      <Button
                        variant="outline"
                        disabled={item.status !== "active"}
                        onClick={() => setOperatorTarget(item)}
                      >
                        Liberar operador
                      </Button>
                    )}
                    {auth.user?.globalRole === "PLATFORM_ADMIN" &&
                      item.status === "active" && (
                        <Button
                          variant="destructive"
                          onClick={() => setDeleteEventTarget(item)}
                        >
                          <Trash2 /> Excluir
                        </Button>
                      )}
                    {auth.user?.globalRole === "PLATFORM_ADMIN" && (
                      <Button
                        variant="outline"
                        disabled={item.status !== "active"}
                        onClick={() => setDeviceTarget(item)}
                      >
                        <Monitor /> Telões
                      </Button>
                    )}
                    {auth.user?.globalRole === "PLATFORM_ADMIN" && (
                      <Button
                        variant="outline"
                        disabled={item.status !== "active"}
                        onClick={() => setAccessTarget(item)}
                      >
                        {item.accessMode === "read_write" ? (
                          <LockKeyhole />
                        ) : (
                          <UnlockKeyhole />
                        )}
                        {item.accessMode === "read_write"
                          ? "Restringir"
                          : "Liberar"}
                      </Button>
                    )}
                  </div>
                </article>
              ))}
              {!events.isLoading && events.data?.items.length === 0 && (
                <p className="py-10 text-center text-muted-foreground">
                  Nenhum evento corresponde aos filtros.
                </p>
              )}
              {events.data && (
                <Pagination
                  page={events.data.page}
                  pageSize={events.data.pageSize}
                  total={events.data.total}
                  onPageChange={setEventPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="gap-4">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>
                  Contas nativas, com as mais recentes primeiro.
                </CardDescription>
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={userSearch}
                  onChange={(event) => {
                    setUserSearch(event.target.value);
                    setUserPage(1);
                  }}
                  className="pl-9"
                  placeholder="Buscar por nome ou e-mail"
                  aria-label="Buscar usuários"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.isLoading && (
                <p className="py-10 text-center text-muted-foreground">
                  Carregando usuários…
                </p>
              )}
              {users.isError && (
                <p
                  className="rounded-xl bg-destructive/10 p-4 text-destructive"
                  role="alert"
                >
                  Não foi possível carregar os usuários.
                </p>
              )}
              {users.data?.items.map((user) => (
                <article
                  key={user.id}
                  className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{user.name}</h3>
                      <Badge variant={user.active ? "secondary" : "outline"}>
                        {user.active ? "Ativo" : "Bloqueado"}
                      </Badge>
                      <Badge
                        variant={
                          user.globalRole !== "USER" ? "default" : "outline"
                        }
                      >
                        {user.globalRole === "PLATFORM_ADMIN"
                          ? "Administrador"
                          : user.globalRole === "PLATFORM_OPERATOR"
                            ? "Operador"
                            : {
                                ORGANIZATION_ADMIN:
                                  "Administrador da organização",
                                REGISTRATION_MANAGER: "Secretaria",
                                JUDGE: "Juiz",
                                ANNOUNCER: "Narrador",
                              }[user.operationalRole ?? "REGISTRATION_MANAGER"]}
                      </Badge>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    {user.ownerName && (
                      <p className="text-xs text-muted-foreground">
                        Operador responsável: {user.ownerName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={user.active ? "outline" : "default"}
                      disabled={
                        updateUser.isPending || user.id === auth.user?.id
                      }
                      onClick={() =>
                        updateUser.mutate({
                          id: user.id,
                          body: { active: !user.active },
                        })
                      }
                    >
                      {user.active ? "Bloquear" : "Reativar"}
                    </Button>
                    {user.id !== auth.user?.id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteUserTarget(user)}
                      >
                        <Trash2 /> Excluir
                      </Button>
                    )}
                  </div>
                </article>
              ))}
              {!users.isLoading && users.data?.items.length === 0 && (
                <p className="py-10 text-center text-muted-foreground">
                  Nenhum usuário encontrado.
                </p>
              )}
              {users.data && (
                <Pagination
                  page={users.data.page}
                  pageSize={users.data.pageSize}
                  total={users.data.total}
                  onPageChange={setUserPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={eventDialog} onOpenChange={setEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo evento</DialogTitle>
            <DialogDescription>
              Crie o espaço isolado onde modalidades, inscrições e competições
              serão organizadas.
            </DialogDescription>
          </DialogHeader>
          <form
            id="create-event-form"
            className="space-y-5"
            onSubmit={eventSubmit}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="system-event-name">
                  Nome do evento
                </FieldLabel>
                <Input
                  id="system-event-name"
                  name="name"
                  placeholder="Rodeio Nacional 2026"
                  minLength={2}
                  maxLength={120}
                  required
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="system-event-slug">
                  Identificador
                </FieldLabel>
                <Input
                  id="system-event-slug"
                  name="slug"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  placeholder="rodeio-nacional-2026"
                  required
                />
                <FieldDescription>
                  Use letras minúsculas, números e hífens.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setEventDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="create-event-form"
              disabled={createEvent.isPending}
            >
              {createEvent.isPending ? "Criando…" : "Criar evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deviceTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeviceTarget(null);
            setActivationCode("");
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Telões de {deviceTarget?.name}</DialogTitle>
            <DialogDescription>
              Cada telão recebe uma credencial própria e limitada à leitura.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              value={deviceName}
              onChange={(event) => setDeviceName(event.target.value)}
              placeholder="Ex.: TV arquibancada"
              aria-label="Nome do dispositivo"
            />
            <Select
              value={deviceType}
              onValueChange={(value) =>
                value && setDeviceType(value as EventDevice["type"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starting_screen">Telão da saída</SelectItem>
                <SelectItem value="audience_screen">
                  Telão da arquibancada
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              disabled={deviceName.trim().length < 2 || createDevice.isPending}
              onClick={() => createDevice.mutate()}
            >
              Criar
            </Button>
          </div>
          {activationCode && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="font-medium">Código de ativação</p>
              <p className="mt-1 break-all font-mono text-sm">
                {activationCode}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Este código é exibido uma única vez. Abra /device no telão para
                ativá-lo.
              </p>
            </div>
          )}
          <div className="space-y-2">
            {devices.data?.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {device.type === "starting_screen"
                      ? "Telão da saída"
                      : "Telão da arquibancada"}
                    {device.revokedAt ? " · Revogado" : " · Ativo"}
                  </p>
                </div>
                {!device.revokedAt && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={revokeDevice.isPending}
                    onClick={() => revokeDevice.mutate(device.id)}
                  >
                    Revogar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={userDialog} onOpenChange={setUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar usuário</DialogTitle>
            <DialogDescription>
              Contas operacionais pertencem a um operador e herdam os eventos
              liberados para ele.
            </DialogDescription>
          </DialogHeader>
          <form
            id="create-user-form"
            className="space-y-4"
            onSubmit={userSubmit}
          >
            <Field>
              <FieldLabel htmlFor="user-name">Nome</FieldLabel>
              <Input
                id="user-name"
                name="name"
                required
                minLength={2}
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="invite-email">E-mail</FieldLabel>
              <Input
                id="invite-email"
                name="email"
                type="email"
                placeholder="usuario@exemplo.com"
                required
              />
              <FieldDescription>
                Use um endereço exclusivo para esta conta.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="user-password">Senha inicial</FieldLabel>
              <Input
                id="user-password"
                name="password"
                type="password"
                minLength={10}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Perfil</FieldLabel>
              <Select
                value={newUserRole}
                onValueChange={(value) =>
                  value && setNewUserRole(value as SystemUser["globalRole"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuário operacional</SelectItem>
                  {auth.user?.globalRole === "PLATFORM_ADMIN" && (
                    <>
                      <SelectItem value="PLATFORM_OPERATOR">
                        Operador da plataforma
                      </SelectItem>
                      <SelectItem value="PLATFORM_ADMIN">
                        Administrador da plataforma
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </Field>
            {newUserRole === "USER" && (
              <>
                {operationalRole !== "ORGANIZATION_ADMIN" && (
                  <Field>
                    <FieldLabel>Operador responsável</FieldLabel>
                    <Select
                      value={ownerUserId}
                      onValueChange={(value) => value && setOwnerUserId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o operador" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.data?.map((operator) => (
                          <SelectItem key={operator.id} value={operator.id}>
                            {operator.name} · {operator.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                <Field>
                  <FieldLabel>Função operacional</FieldLabel>
                  <Select
                    value={operationalRole}
                    onValueChange={(value) =>
                      value &&
                      setOperationalRole(
                        value as NonNullable<SystemUser["operationalRole"]>,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORGANIZATION_ADMIN">
                        Administrador da organização
                      </SelectItem>
                      <SelectItem value="REGISTRATION_MANAGER">
                        Secretaria
                      </SelectItem>
                      <SelectItem value="JUDGE">Juiz</SelectItem>
                      <SelectItem value="ANNOUNCER">Narrador</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </>
            )}
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setUserDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="create-user-form"
              disabled={
                createUser.isPending ||
                (newUserRole === "USER" &&
                  operationalRole !== "ORGANIZATION_ADMIN" &&
                  !ownerUserId)
              }
            >
              {createUser.isPending ? "Criando…" : "Criar usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(operatorTarget)}
        onOpenChange={(open) => !open && setOperatorTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liberar operador</DialogTitle>
            <DialogDescription>
              As contas de juiz, narrador e secretaria desse operador herdarão o
              acesso a {operatorTarget?.name}.
            </DialogDescription>
          </DialogHeader>
          <Select
            value={assignedOperatorId}
            onValueChange={(value) => value && setAssignedOperatorId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o operador" />
            </SelectTrigger>
            <SelectContent>
              {operators.data?.map((operator) => (
                <SelectItem key={operator.id} value={operator.id}>
                  {operator.name} · {operator.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-2">
            {assignedOperators.data?.map((operator) => (
              <div
                key={operator.id}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium">{operator.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {operator.email}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={revokeOperator.isPending}
                  onClick={() => revokeOperator.mutate(operator.id)}
                >
                  Revogar
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOperatorTarget(null)}>
              Cancelar
            </Button>
            <Button
              disabled={!assignedOperatorId || grantOperator.isPending}
              onClick={() => grantOperator.mutate()}
            >
              Liberar acesso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(accessTarget)}
        onOpenChange={(open) => !open && setAccessTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              {accessTarget?.accessMode === "read_write" ? (
                <LockKeyhole />
              ) : (
                <UnlockKeyhole />
              )}
            </AlertDialogMedia>
            <AlertDialogTitle>
              {accessTarget?.accessMode === "read_write"
                ? "Tornar somente leitura?"
                : "Liberar edição?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {accessTarget?.accessMode === "read_write"
                ? `${accessTarget.name} continuará disponível para consulta, mas seus dados não poderão ser alterados.`
                : `Os usuários autorizados poderão voltar a alterar os dados de ${accessTarget?.name}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={changeAccess.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!accessTarget || changeAccess.isPending}
              onClick={() =>
                accessTarget &&
                changeAccess.mutate({
                  eventId: accessTarget.id,
                  mode:
                    accessTarget.accessMode === "read_write"
                      ? "read_only"
                      : "read_write",
                })
              }
            >
              {accessTarget?.accessMode === "read_write"
                ? "Tornar somente leitura"
                : "Liberar edição"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(deleteEventTarget)}
        onOpenChange={(open) => !open && setDeleteEventTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir evento?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteEventTarget?.name} e todos os seus dados operacionais serão
              excluídos permanentemente. Os competidores continuarão disponíveis
              no cadastro global.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEvent.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!deleteEventTarget || deleteEvent.isPending}
              onClick={() =>
                deleteEventTarget && deleteEvent.mutate(deleteEventTarget.id)
              }
            >
              Excluir evento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(deleteUserTarget)}
        onOpenChange={(open) => !open && setDeleteUserTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              A conta de {deleteUserTarget?.name} será removida das listagens e
              todas as suas sessões serão encerradas. Se for um operador, as
              contas operacionais vinculadas perderão o acesso imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUser.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!deleteUserTarget || deleteUser.isPending}
              onClick={() =>
                deleteUserTarget && deleteUser.mutate(deleteUserTarget.id)
              }
            >
              Excluir usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
