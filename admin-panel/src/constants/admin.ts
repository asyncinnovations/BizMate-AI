/** Base URL segment for all in-app admin routes (sidebar, breadcrumbs, deep links). */
export const ADMIN_BASE_PATH = "/admin" as const;

/** Build an absolute admin URL from a path segment (`/users` → `/admin/users`). Dashboard root is `/admin`. */
export function adminPath(relative: string): string {
  if (relative === "/" || relative === "") return ADMIN_BASE_PATH;
  const p = relative.startsWith("/") ? relative : `/${relative}`;
  return `${ADMIN_BASE_PATH}${p}`;
}
