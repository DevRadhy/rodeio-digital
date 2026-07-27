import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/categories", "pages/categories/index.tsx"),
  route("/registrations", "pages/registration/index.tsx"),
  route("/dashboard", "pages/dashboard/index.tsx"),
] satisfies RouteConfig;
