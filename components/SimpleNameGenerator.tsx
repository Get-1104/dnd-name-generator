"use client";

import { useCallback, useMemo, useState } from "react";
import Toast from "@/components/Toast";

export type SyllableParts = {
  first: string[];
  second?: string[];
  third?: string[];
  surnameA?: string[];
  surnameB?: string[];
};

export type CjkParts = {
  surnames: string[];
  givenChars: string[];
  twoCharRate?: number; // 0-1, default 0.55
};

export type SimpleGeneratorConfig =
  | {
      kind: "syllable";
      parts: SyllableParts;
      includeSurnameDefault?: boolean;
      separator?: string; // between given and surname, default " "
    }
  | {
      kind: "cjk";
      parts: CjkParts;
    }
  | {
      kind: "epithet";
      // e.g., "Krag" + "of the Ashen Peak"
      parts: SyllableParts & { epithets: string[] };
      separator?: string;
      includeEpithetDefault?: boolean;
    };

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capFirst(s: string) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}

function makeSyllableName(parts: SyllableParts) {
  const a = pick(parts.first);
  const b = parts.second && parts.second.length ? pick(parts.second) : "";
  const c = parts.third && parts.third.length ? pick(parts.third) : "";
  // keep natural casing: if user supplies capitals (e.g. "Th"), preserve.
  const raw = `${a}${b}${c}`.replace(/\s+/g, "");
  // If raw starts with lowercase and has no internal capitals, capitalize.
  const shouldCap = raw && raw[0] === raw[0].toLowerCase() && !/[A-Z]/.test(raw.slice(1));
  return shouldCap ? capFirst(raw) : raw;
}

function makeSurname(parts: SyllableParts) {
  const A = parts.surnameA && parts.surnameA.length ? pick(parts.surnameA) : "";
  const B = parts.surnameB && parts.surnameB.length ? pick(parts.surnameB) : "";
  const raw = `${A}${B}`.replace(/\s+/g, "");
  if (!raw) return "";
  // Most surname fragments are capitalized already; still normalize first char.
  return capFirst(raw);
}

function makeCjkName(parts: CjkParts) {
  const surname = pick(parts.surnames);
  const twoRate = typeof parts.twoCharRate === "number" ? parts.twoCharRate : 0.55;
  const isTwo = Math.random() < twoRate;
  const g1 = pick(parts.givenChars);
  const g2 = pick(parts.givenChars);
  const g3 = pick(parts.givenChars);
  const given = isTwo ? `${g1}${g2}` : `${g1}${g2}${g3}`;
  return `${surname}${given}`;
}

function dedupePush(list: string[], value: string) {
  if (!value) return;
  if (list.includes(value)) return;
  list.push(value);
}

export default function SimpleNameGenerator({
  config,
  initialCount = 10,
  generateLabel = "Generate",
  copyLabel = "Copy",
}: {
  config: SimpleGeneratorConfig;
  initialCount?: number;
  generateLabel?: string;
  copyLabel?: string;
}) {
  const [toast, setToast] = useState<string | null>(null);

  const defaultIncludeSurname =
    config.kind === "syllable" ? (config.includeSurnameDefault ?? true) : false;
  const defaultIncludeEpithet =
    config.kind === "epithet" ? (config.includeEpithetDefault ?? true) : false;

  const [includeSurname, setIncludeSurname] = useState(defaultIncludeSurname);
  const [includeEpithet, setIncludeEpithet] = useState(defaultIncludeEpithet);

  const separator = (config.kind === "syllable" || config.kind === "epithet") ? (config.separator ?? " ") : "";

  const generateOne = useCallback(() => {
    if (config.kind === "cjk") return makeCjkName(config.parts);

    if (config.kind === "epithet") {
      const given = makeSyllableName(config.parts);
      const epithet = includeEpithet ? pick(config.parts.epithets) : "";
      return epithet ? `${given}${separator}${epithet}` : given;
    }

    const given = makeSyllableName(config.parts);
    const surname = includeSurname ? makeSurname(config.parts) : "";
    return surname ? `${given}${separator}${surname}` : given;
  }, [config, includeSurname, includeEpithet, separator]);

  const generateBatch = useCallback(() => {
    const out: string[] = [];
    const maxTries = initialCount * 25;
    let tries = 0;
    while (out.length < initialCount && tries < maxTries) {
      tries++;
      dedupePush(out, generateOne());
    }
    if (out.length < initialCount) {
      // fill (allow duplicates) if pools are small
      while (out.length < initialCount) out.push(generateOne());
    }
    return out;
  }, [generateOne, initialCount]);

  const [names, setNames] = useState<string[]>(() => generateBatch());

  const copyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(names.join("\n"));
      setToast("Copied!");
      setTimeout(() => setToast(null), 1400);
    } catch {
      setToast("Copy failed");
      setTimeout(() => setToast(null), 1400);
    }
  }, [names]);

  const regenerate = useCallback(() => {
    setNames(generateBatch());
  }, [generateBatch]);

  const controls = useMemo(() => {
    if (config.kind === "syllable") {
      return (
        <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-300"
            checked={includeSurname}
            onChange={(e) => setIncludeSurname(e.target.checked)}
          />
          Include surname
        </label>
      );
    }
    if (config.kind === "epithet") {
      return (
        <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-300"
            checked={includeEpithet}
            onChange={(e) => setIncludeEpithet(e.target.checked)}
          />
          Include epithet
        </label>
      );
    }
    return null;
  }, [config.kind, includeSurname, includeEpithet]);

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">{controls}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={regenerate}
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm shadow-sm hover:shadow"
          >
            {generateLabel}
          </button>
          <button
            type="button"
            onClick={copyAll}
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm shadow-sm hover:shadow"
          >
            {copyLabel}
          </button>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2">
        {names.map((n, idx) => (
          <li key={`${n}-${idx}`} className="rounded-xl border border-zinc-100 px-4 py-3 text-lg">
            {n}
          </li>
        ))}
      </ul>

      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
