import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/pages/layout.tsx", [
    route("/categories", "pages/categories/index.tsx"),
    route("/registrations", "pages/registration/index.tsx"),
    ...prefix("/competition", [
      index("pages/competition/index.tsx"),
      route(":categoryId", "pages/competition/session.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
