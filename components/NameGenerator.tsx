"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ExampleNamesCard from "@/components/ExampleNamesCard";

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

  /** 名字中间的连接符：英文用 " "，中文用 "" */
  separator?: string;

  /** 是否隐藏顶部标题区（Back + H1 + description） */
  hideHeader?: boolean;

  /**
   * CJK（中文）名字模式
   * - off: 默认逻辑（保持你现有所有英文页面不变）
   * - toggle_2_3: 组件内提供“两字名/三字名”切换
   * - two: 只生成两字名
   * - three: 只生成三字名
   */
  cjkMode?: "off" | "toggle_2_3" | "two" | "three";
  cjkTwoLabel?: string;
  cjkThreeLabel?: string;

  /**
   * ✅ 辈分字（generation character）
   * - 不传：不显示
   * - 传数组：显示选择器（随机/固定某个）
   */
  cjkGenerationChars?: string[];
  cjkGenerationLabel?: string;

  /**
   * ✅ 称号/封号
   * - 不传：不显示
   */
  cjkTitles?: string[];
  cjkTitleLabel?: string;
  cjkTitleJoiner?: string; // 默认 "·"

  /**
   * ✅ 新增：称号位置（更像仙侠/武侠）
   * - suffix: 名字·称号（默认，兼容你现有逻辑）
   * - prefix: 称号·名字
   */
  cjkTitlePosition?: "suffix" | "prefix";
  cjkTitlePositionLabel?: string;
  cjkTitlePrefixLabel?: string;
  cjkTitleSuffixLabel?: string;
};

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeNameDefault(parts: Parts, separator: string) {
  return (
    `${pick(parts.first)}${pick(parts.second)}` +
    `${separator}` +
    `${pick(parts.lastA)}${pick(parts.lastB)}`
  );
}

/**
 * CJK 生成规则（更贴近国风命名习惯）
 * - two:   [辈分字可选] + [名]
 * - three: [姓] + [辈分字可选] + [名]
 *
 * parts.lastA 作为姓（单字姓）
 * parts.first 作为辈分字池（或第二字池）
 * parts.second 作为名的末字池
 */
function makeNameCjk(
  parts: Parts,
  mode: "two" | "three",
  generationChar: string | null, // 固定辈分字（为空则随机/不固定）
  title: string | null,
  titleJoiner: string,
  titlePosition: "suffix" | "prefix"
) {
  // 姓（仅三字名需要）
  const surname = pick(parts.lastA);

  // 辈分字：如果用户选了，就用；否则随机挑一个（但也允许“随机但不固定”的体验）
  const gen =
    generationChar && generationChar.trim()
      ? generationChar.trim()
      : pick(parts.first);

  // 名字末字
  const givenTail = pick(parts.second);

  // 组装 base
  let base = "";
  if (mode === "two") {
    base = `${gen}${givenTail}`;
  } else {
    base = `${surname}${gen}${givenTail}`;
  }

  // 称号：前缀/后缀
  if (title && title.trim()) {
    const t = title.trim();
    base = titlePosition === "prefix" ? `${t}${titleJoiner}${base}` : `${base}${titleJoiner}${t}`;
  }

  return base;
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
  separator = " ",
  hideHeader = false,

  cjkMode = "off",
  cjkTwoLabel = "Two-character",
  cjkThreeLabel = "Three-character",

  cjkGenerationChars,
  cjkGenerationLabel = "Generation character",

  cjkTitles,
  cjkTitleLabel = "Title / epithet",
  cjkTitleJoiner = "·",

  cjkTitlePosition = "suffix",
  cjkTitlePositionLabel = "Title position",
  cjkTitlePrefixLabel = "Title·Name",
  cjkTitleSuffixLabel = "Name·Title",
}: Props) {
  const hasCjk = cjkMode !== "off";
  const hasGeneration = Array.isArray(cjkGenerationChars) && cjkGenerationChars.length > 0;
  const hasTitles = Array.isArray(cjkTitles) && cjkTitles.length > 0;

  // 内部 2/3 模式（仅 toggle_2_3 需要）
  const [cjkInternalMode, setCjkInternalMode] = useState<"two" | "three">(
    cjkMode === "three" ? "three" : "two"
  );

  // 辈分字："" 表示随机（不固定某一个）
  const [generationChar, setGenerationChar] = useState<string>("");

  // 称号："" 表示无
  const [titlePick, setTitlePick] = useState<string>("");

  // 称号位置：prefix/suffix
  const [titlePos, setTitlePos] = useState<"suffix" | "prefix">(cjkTitlePosition);

  const effectiveCjkMode: "two" | "three" | null = useMemo(() => {
    if (cjkMode === "two") return "two";
    if (cjkMode === "three") return "three";
    if (cjkMode === "toggle_2_3") return cjkInternalMode;
    return null;
  }, [cjkMode, cjkInternalMode]);


// -----------------------------
// ✅ Name quality: de-duplication
// -----------------------------
// Avoid repeating names within a single generation batch, and also avoid
// short-term repeats across consecutive generations (per page session).
const RECENT_MAX = 200;
const recentListRef = useRef<string[]>([]);
const recentSetRef = useRef<Set<string>>(new Set());

function remember(namesToRemember: string[]) {
  for (const n of namesToRemember) {
    if (recentSetRef.current.has(n)) continue;
    recentSetRef.current.add(n);
    recentListRef.current.push(n);
    // prune oldest
    while (recentListRef.current.length > RECENT_MAX) {
      const old = recentListRef.current.shift();
      if (old) recentSetRef.current.delete(old);
    }
  }
}

function generateUniqueBatch(
  count: number,
  makeOne: () => string,
  maxAttempts = count * 30
) {
  const batch: string[] = [];
  const seen = new Set<string>();

  let attempts = 0;
  while (batch.length < count && attempts < maxAttempts) {
    attempts += 1;
    const n = makeOne();
    if (seen.has(n)) continue;
    if (recentSetRef.current.has(n)) continue;
    seen.add(n);
    batch.push(n);
  }

  // Fallback: if the pool is too small, allow repeats (but still unique within batch)
  while (batch.length < count) {
    const n = makeOne();
    if (seen.has(n)) continue;
    seen.add(n);
    batch.push(n);
  }

  remember(batch);
  return batch;
}

  function generateOne(mode: "two" | "three" | null) {
    if (mode) {
      return makeNameCjk(
        parts,
        mode,
        generationChar || null,
        titlePick || null,
        cjkTitleJoiner,
        titlePos
      );
    }
    return makeNameDefault(parts, separator);
  }

  function regenerate(nextMode?: "two" | "three") {
    const mode = nextMode ?? effectiveCjkMode;
    setNames(generateUniqueBatch(initialCount, () => generateOne(mode)));
  }

  const [names, setNames] = useState<string[]>(() =>
    generateUniqueBatch(initialCount, () => generateOne(effectiveCjkMode))
  );

  // ✅ 当关键控制项变化时，自动刷新一次（用户体验更一致）
  useEffect(() => {
    if (!hasCjk) return;
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCjkMode, generationChar, titlePick, titlePos]);

  const copyText = useMemo(() => names.join("\n"), [names]);

  return (
    <section className="space-y-8">
      {!hideHeader && (
        <header className="space-y-2">
          <a className="text-sm text-blue-600 underline" href={backHref}>
            ← Back
          </a>
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-zinc-700 max-w-3xl">{description}</p>
        </header>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
        {/* ✅ CJK toggles */}
        {hasCjk && cjkMode === "toggle_2_3" && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                cjkInternalMode === "two"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-900"
              }`}
              onClick={() => setCjkInternalMode("two")}
            >
              {cjkTwoLabel}
            </button>
            <button
              type="button"
              className={`rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                cjkInternalMode === "three"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-900"
              }`}
              onClick={() => setCjkInternalMode("three")}
            >
              {cjkThreeLabel}
            </button>
          </div>
        )}

        {/* ✅ CJK controls */}
        {(hasGeneration || hasTitles) && (
          <div className="flex flex-wrap gap-3">
            {hasGeneration && (
              <label className="text-sm text-zinc-700">
                <div className="mb-1 font-medium text-zinc-900">
                  {cjkGenerationLabel}
                </div>
                <select
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
                  value={generationChar}
                  onChange={(e) => setGenerationChar(e.target.value)}
                >
                  <option value="">随机（不固定）</option>
                  {cjkGenerationChars!.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {hasTitles && (
              <label className="text-sm text-zinc-700">
                <div className="mb-1 font-medium text-zinc-900">
                  {cjkTitleLabel}
                </div>
                <select
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
                  value={titlePick}
                  onChange={(e) => setTitlePick(e.target.value)}
                >
                  <option value="">无称号</option>
                  {cjkTitles!.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {hasTitles && (
              <label className="text-sm text-zinc-700">
                <div className="mb-1 font-medium text-zinc-900">
                  {cjkTitlePositionLabel}
                </div>
                <select
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
                  value={titlePos}
                  onChange={(e) => setTitlePos(e.target.value as "suffix" | "prefix")}
                >
                  <option value="suffix">{cjkTitleSuffixLabel}</option>
                  <option value="prefix">{cjkTitlePrefixLabel}</option>
                </select>
              </label>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
            onClick={() => regenerate()}
          >
            {generateLabel}
          </button>
          <button
            type="button"
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
        <ExampleNamesCard items={examples} />
      )}
    </section>
  );
}
