"use client";

import { useMemo, useState } from "react";

type Parts = {
  first: string[];
  second: string[];
  lastA: string[];
  lastB: string[];
};

type Props = {
  title: string;
  description: string;
  backHref?: string;

  parts: Parts;
  initialCount?: number;

  examples?: string[];

  generateLabel?: string;
  copyLabel?: string;

  /** 名字中间的连接符：
   * 英文用 " "
   * 中文用 ""
   */
  separator?: string;
};

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeName(parts: Parts, separator: string) {
  return (
    `${pick(parts.first)}${pick(parts.second)}` +
    `${separator}` +
    `${pick(parts.lastA)}${pick(parts.lastB)}`
  );
}

export default function NameGenerator({
  title,
  description,
  backHref = "/",
  parts,
  initialCount = 10,
  examples = [],
  generateLabel = "Generate",
  copyLabel = "Copy",
  separator = " ", // ✅ 默认英文有空格
}: Props) {
  const [names, setNames] = useState<string[]>(
    () => Array.from({ length: initialCount }, () => makeName(parts, separator))
  );

  const copyText = useMemo(() => names.join("\n"), [names]);

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <a className="text-sm text-blue-600 underline" href={backHref}>
          ← Back
        </a>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-zinc-700 max-w-3xl">{description}</p>
      </header>

      <div className="rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div className="flex gap-2">
          <button
            className="rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
            onClick={() =>
              setNames(
                Array.from({ length: initialCount }, () =>
                  makeName(parts, separator)
                )
              )
            }
          >
            {generateLabel}
          </button>
          <button
            className="rounded-xl border border-zinc-200 px-4 py-2 hover:bg-zinc-50"
            onClick={() => navigator.clipboard.writeText(copyText)}
          >
            {copyLabel}
          </button>
        </div>

        <div className="grid gap-2">
          {names.map((n, idx) => (
            <div
              key={`${n}-${idx}`}
              className="rounded-xl bg-zinc-50 px-3 py-2 font-medium"
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {examples.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Example Names</h2>
          <ul className="list-disc pl-6 text-zinc-800">
            {examples.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
