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

  // ✅ 新增：可选的英文/多语言文案（不传则使用默认）
  headline?: string;
  subhead?: string;
  searchPlaceholder?: string;
};

export default function HomeSearch({
  tools,
  headline = "D&D Name Generators",
  subhead = "Pick a generator, generate names, and copy your favorites.",
  searchPlaceholder = "Search: elf, dwarf, 东方, xianxia...",
}: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return tools;

    return tools.filter((t) => {
      const haystack = [
        t.title,
        t.description,
        t.href,
        ...(t.tags || []),
      ]
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

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full max-w-xl rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-200"
        />
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
    </main>
  );
}
