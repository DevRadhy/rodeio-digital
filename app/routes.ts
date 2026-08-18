import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/pages/layout.tsx", [
    route("/categories", "features/categories/pages/index.tsx"),
    route("/registrations", "features/registration/pages/index.tsx"),
    ...prefix("/competition", [
      index("features/competition/pages/index.tsx"),
      route(":competitionId", "features/competition/pages/session.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
