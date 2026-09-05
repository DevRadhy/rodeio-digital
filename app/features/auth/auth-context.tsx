import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  api,
  refreshAccessToken,
  setAccessToken,
  setActiveEventId,
} from "@/providers/api";

export type EventRole =
  | "ORGANIZATION_ADMIN"
  | "REGISTRATION_MANAGER"
  | "JUDGE"
  | "ANNOUNCER"
  | "DISPLAY_GATE"
  | "DISPLAY_SCOREBOARD";
type EventAccess = {
  id: string;
  name: string;
  slug: string;
  accessMode: "read_write" | "read_only";
  role: EventRole;
};
type User = {
  id: string;
  name: string;
  email: string;
  globalRole: "PLATFORM_ADMIN" | "PLATFORM_OPERATOR" | "USER";
  ownerUserId: string | null;
  operationalRole: EventRole | null;
};
type Auth = {
  user: User | null;
  events: EventAccess[];
  event: EventAccess | null;
  signedIn: boolean;
  loading: boolean;
  error: string | null;
  login(email: string, password: string): Promise<void>;
  loginDevice(activationCode: string): Promise<EventRole>;
  logout(): Promise<void>;
  reload(): void;
  selectEvent(id: string): void;
};
const Context = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const activateEvent = useCallback(
    (id: string | null) => {
      // The interceptor must point to the new tenant before mounted queries can
      // refetch. Clearing the cache also discards responses from the old event.
      setActiveEventId(id);
      void queryClient.cancelQueries();
      queryClient.clear();
      setEventId(id);

      if (id) {
        localStorage.setItem("rodeo.event", id);
      } else {
        localStorage.removeItem("rodeo.event");
      }
    },
    [queryClient],
  );
  const clear = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setEvents([]);
    activateEvent(null);
  }, [activateEvent]);
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await refreshAccessToken();
      if (!token) {
        clear();
        return;
      }
      const { data } = await api.get<{ user: User; events: EventAccess[] }>(
        "/auth/me",
      );
      setUser(data.user);
      setEvents(data.events);
      const saved = localStorage.getItem("rodeo.event");
      if (saved && data.events.some((event) => event.id === saved)) {
        activateEvent(saved);
      } else {
        activateEvent(null);
      }
    } catch (cause) {
      clear();
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível carregar seu acesso.",
      );
    } finally {
      setLoading(false);
    }
  }, [activateEvent, clear]);
  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);
  const value = useMemo<Auth>(
    () => ({
      user,
      events,
      event: events.find((item) => item.id === eventId) ?? null,
      signedIn: Boolean(user),
      loading,
      error,
      async login(email, password) {
        const { data } = await api.post<{ accessToken: string }>(
          "/auth/login",
          { email, password },
        );
        setAccessToken(data.accessToken);
        const profile = await api.get<{ user: User; events: EventAccess[] }>(
          "/auth/me",
        );
        setUser(profile.data.user);
        setEvents(profile.data.events);
        setError(null);
      },
      async loginDevice(activationCode) {
        const { data } = await api.post<{ accessToken: string }>(
          "/auth/device",
          { activationCode },
        );
        setAccessToken(data.accessToken, true);
        const profile = await api.get<{ user: User; events: EventAccess[] }>(
          "/auth/me",
        );
        setUser(profile.data.user);
        setEvents(profile.data.events);
        const first = profile.data.events[0];
        if (first) {
          activateEvent(first.id);
        }
        setError(null);
        return profile.data.user.operationalRole ?? "DISPLAY_SCOREBOARD";
      },
      async logout() {
        try {
          await api.post("/auth/logout");
        } finally {
          clear();
        }
      },
      reload() {
        void loadProfile();
      },
      selectEvent(id) {
        if (id !== eventId) activateEvent(id);
      },
    }),
    [activateEvent, clear, error, eventId, events, loadProfile, loading, user],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error("AuthProvider ausente");
  return value;
}
