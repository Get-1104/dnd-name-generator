export type LengthOpt = "short" | "medium" | "long";

export function matchLength(name: string, opt: LengthOpt | null): boolean {
  if (!opt) return true;
  const normalized = name.replace(/[\s-]/g, "");
  const len = normalized.length;
  if (opt === "short") return len >= 3 && len <= 5;
  if (opt === "medium") return len >= 6 && len <= 7;
  return len >= 8;
}
