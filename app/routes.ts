import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("/categories", "pages/categories/index.tsx"),
  route("/registrations", "pages/registration/index.tsx"),
  route("/dashboard", "pages/dashboard/index.tsx"),
  ...prefix("/competition", [
    index("pages/competition/index.tsx"),
    route(":categoryId", "pages/competition/session.tsx"),
  ]),
] satisfies RouteConfig;
