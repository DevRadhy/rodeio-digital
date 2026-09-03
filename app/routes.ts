import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route(
    "/scoreboard/:competitionId",
    "features/scoreboard/pages/scoreboard.tsx",
  ),
  layout("./layouts/pages/layout.tsx", [
    route("/categories", "features/categories/pages/index.tsx"),
    ...prefix("/registrations", [
      index("features/registration/pages/index.tsx"),
      route(":categoryId", "features/registration/pages/registrations.tsx"),
    ]),
    ...prefix("/competition", [
      index("features/competition/pages/index.tsx"),
      route(":competitionId", "features/competition/pages/session.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
