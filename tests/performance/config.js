export const BASE_URL = __ENV.K6_BASE_URL || "http://localhost:3000";

export const PAGES = [
  { name: "home", path: "/" },
  { name: "login", path: "/login" },
  { name: "register", path: "/register" },
  { name: "dashboard", path: "/dashboard" },
  { name: "appointments", path: "/appointments" },
  { name: "medications", path: "/medications" },
  { name: "notifications", path: "/notifications" },
  { name: "users", path: "/users" }
];

export function buildUrl(path) {
  return `${BASE_URL}${path}`;
}
