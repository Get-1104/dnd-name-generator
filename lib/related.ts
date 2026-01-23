// lib/related.ts
import { TOOLS } from "@/lib/tools";

/**
 * Compute related generator hrefs based on tag overlap.
 * This is used to keep internal linking consistent and scalable.
 */
export function getRelatedGeneratorHrefs(
  currentHref: string,
  opts?: { max?: number; minOverlap?: number; fallback?: string[] }
): string[] {
  const max = opts?.max ?? 4;
  const minOverlap = opts?.minOverlap ?? 1;
  const fallback = opts?.fallback ?? [
    "/elf",
    "/dwarf",
    "/human",
    "/orc",
    "/eastern",
  ];

  const current = TOOLS.find((t) => t.href === currentHref);
  const currentTags = new Set((current?.tags ?? []).map((t) => t.toLowerCase()));

  // If we can't find this tool in TOOLS, fall back to a stable list.
  if (!current || currentTags.size === 0) {
    return fallback.filter((h) => h !== currentHref).slice(0, max);
  }

  const scored = TOOLS.filter((t) => t.href !== currentHref)
    .map((t) => {
      const tags = (t.tags ?? []).map((x) => x.toLowerCase());
      let overlap = 0;
      for (const tag of tags) {
        if (currentTags.has(tag)) overlap += 1;
      }
      return { href: t.href, overlap, title: t.title };
    })
    .filter((x) => x.overlap >= minOverlap)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return a.title.localeCompare(b.title);
    });

  const picked = scored.map((x) => x.href).slice(0, max);

  // Ensure we always have something to link to.
  if (picked.length < max) {
    const extra = fallback.filter((h) => h !== currentHref && !picked.includes(h));
    return [...picked, ...extra].slice(0, max);
  }

  return picked;
}
