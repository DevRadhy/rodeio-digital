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
    route("/registrations", "pages/registration/index.tsx"),
    ...prefix("/competition", [
      index("pages/competition/index.tsx"),
      route(":competitionId", "pages/competition/session.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
