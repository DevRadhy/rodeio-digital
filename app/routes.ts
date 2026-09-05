import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("/sign-in/*", "features/auth/login.tsx"),
  route("/login/*", "features/auth/legacy-login.tsx"),
  route("/device", "features/auth/device-login.tsx"),
  layout("features/auth/require-auth.tsx", [
    route("/events", "features/auth/events.tsx"),
    route("/system", "features/auth/system.tsx"),
    route(
      "/scoreboard/:competitionId",
      "features/scoreboard/pages/scoreboard.tsx",
    ),
    route("/scoreboard", "features/scoreboard/pages/scoreboard-live.tsx"),
    route("/gate", "features/scoreboard/pages/gate-live.tsx"),
    route("/gate/:competitionId", "features/scoreboard/pages/gate.tsx"),
    layout("./layouts/pages/layout.tsx", [
      route("/categories", "features/categories/pages/index.tsx"),
      route("/event-access", "features/auth/event-access.tsx"),
      route("/displays", "features/displays/pages/index.tsx"),
      ...prefix("/registrations", [
        index("features/registration/pages/index.tsx"),
        route(":categoryId", "features/registration/pages/registrations.tsx"),
      ]),
      ...prefix("/competition", [
        index("features/competition/pages/index.tsx"),
        route(":competitionId", "features/competition/pages/session.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
