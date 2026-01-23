import React from "react";

type Props = {
  title?: string;
  items: string[];
  className?: string;
};

/**
 * A lightweight, reusable card for showing example outputs.
 * Keeps visual style consistent across pages (Generator / Eastern / Hub).
 */
export default function ExampleNamesCard({
  title = "Example Names",
  items,
  className = "",
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section
      className={
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm " + className
      }
    >
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((e) => (
          <li
            key={e}
            className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-900"
          >
            {e}
          </li>
        ))}
      </ul>
    </section>
  );
}
