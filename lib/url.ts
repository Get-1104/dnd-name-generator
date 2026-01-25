export type QueryPatch = Record<string, string | null | undefined>;

export function buildUrl(
  pathname: string,
  current: URLSearchParams,
  patch: QueryPatch = {}
) {
  const next = new URLSearchParams(current.toString());

  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === undefined || v === "") next.delete(k);
    else next.set(k, v);
  }

  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function withPathKeepingQuery(path: string, current: URLSearchParams) {
  const qs = current.toString();
  return qs ? `${path}?${qs}` : path;
}
