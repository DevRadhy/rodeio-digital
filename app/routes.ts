import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/categories", "pages/categories/index.tsx"),
  route("/registration", "pages/registration/index.tsx"),
] satisfies RouteConfig;
