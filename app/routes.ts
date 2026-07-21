import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/categories", "pages/categories/index.tsx"),
  route("/subscribes", "pages/subscribes/index.tsx"),
] satisfies RouteConfig;
