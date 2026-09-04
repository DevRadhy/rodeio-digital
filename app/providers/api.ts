import axios, { create } from "axios";

const baseURL = import.meta.env.VITE_API_URL;
export const api = create({ baseURL, withCredentials: true });
let activeEventId: string | null = null;
let accessToken: string | null = null;
let refreshRequest: Promise<string | null> | null = null;
export function setActiveEventId(value: string | null) {
  activeEventId = value;
}
export function getActiveEventId() {
  return activeEventId;
}
const deviceTokenKey = "rodeo.device_token";
export function setAccessToken(value: string | null, persistDevice = false) {
  accessToken = value;
  if (typeof localStorage === "undefined") return;
  if (value && persistDevice) localStorage.setItem(deviceTokenKey, value);
  else localStorage.removeItem(deviceTokenKey);
}
export function getAccessToken() {
  return accessToken;
}
async function refresh() {
  if (!refreshRequest)
    refreshRequest = axios
      .post<{ accessToken: string }>(
        `${baseURL}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then(({ data }) => {
        accessToken = data.accessToken;
        return accessToken;
      })
      .catch(() => {
        const deviceToken =
          typeof localStorage === "undefined"
            ? null
            : localStorage.getItem(deviceTokenKey);
        accessToken = deviceToken;
        return deviceToken;
      })
      .finally(() => {
        refreshRequest = null;
      });
  return refreshRequest;
}
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  const url = config.url ?? "";
  if (
    /^\/(categories|registrations|competition|competitors|devices)(?:\/|$)/.test(
      url,
    )
  ) {
    if (!activeEventId)
      throw new Error("Selecione um evento antes de continuar.");
    config.url = `/events/${encodeURIComponent(activeEventId)}${url}`;
  }
  return config;
});
api.interceptors.response.use(undefined, async (error) => {
  const config = error.config as
    | (typeof error.config & { _retried?: boolean })
    | undefined;
  if (
    error.response?.status !== 401 ||
    !config ||
    config._retried ||
    config.url?.includes("/auth/")
  )
    throw error;
  config._retried = true;
  const token = await refresh();
  if (!token) throw error;
  config.headers.Authorization = `Bearer ${token}`;
  return api(config);
});

export { refresh as refreshAccessToken };
