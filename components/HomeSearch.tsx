"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ToolLink = {
  href: string;
  title: string;
  description: string;
  tags?: string[];
};

type Props = {
  tools: ToolLink[];

  headline?: string;
  subhead?: string;
  searchPlaceholder?: string;
};

export default function HomeSearch({
  tools,
  headline = "D&D Name Generators",
  subhead = "Pick a generator, generate names, and copy your favorites.",
  // ✅ 更中性：不刻意 push xianxia/wuxia
  searchPlaceholder = "Search: elf, dwarf, tiefling, dragonborn, 东方…",
}: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return tools;

    return tools.filter((t) => {
      const haystack = [t.title, t.description, t.href, ...(t.tags || [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [q, tools]);

  return (
    <main className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{headline}</h1>
        <p className="text-zinc-700 max-w-2xl">{subhead}</p>

        <div className="flex w-full max-w-xl items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-200"
          />
          {q.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700 hover:bg-zinc-50"
              aria-label="Clear search"
              title="Clear"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-2xl border border-zinc-200 p-5 shadow-sm hover:bg-zinc-50 transition"
          >
            <div className="text-xl font-semibold">{t.title}</div>
            <div className="mt-2 text-zinc-700">{t.description}</div>

            {!!t.tags?.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </section>

      {filtered.length === 0 && (
        <p className="text-sm text-zinc-600">
          No results. Try a race (elf, dwarf, orc) or browse the full list above.
        </p>
      )}
    </main>
  );
}
