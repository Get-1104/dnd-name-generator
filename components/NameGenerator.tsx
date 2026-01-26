"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ExampleNamesCard from "@/components/ExampleNamesCard";
import Toast from "@/components/Toast";
import {
  ElfOptions,
  defaultElfOptions,
  elfStyleOptions,
  elfLengthOptions,
  elfCulturalContextOptions,
  elfNameFormOptions,
  elfPronunciationOptions,
  elfMeaningFlavorOptions,
  elfCulturalOriginOptions,
} from "@/lib/elfOptions";

type ElfOption = { value: string; label: string };

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

  /** Advanced mode state */
  isAdvanced?: boolean;
  onAdvancedToggle?: () => void;

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

function makeElfName(parts: Parts, separator: string, options: ElfOptions) {
  let given = "";
  let surname = "";

  // Length affects given name length
  if (options.length === "short") {
    given = pick(parts.first);
  } else if (options.length === "medium") {
    given = `${pick(parts.first)}${pick(parts.second)}`;
  } else { // long
    given = `${pick(parts.first)}${pick(parts.second)}${pick(parts.lastA)}`;
  }

  // Surname
  if (options.surname) {
    surname = `${pick(parts.lastA)}${pick(parts.lastB)}`;
  }

  // For nameForm: short -> shorter given, external -> simpler (less lastA/lastB)
  if (options.nameForm === "short") {
    given = pick(parts.first); // override to short
  } else if (options.nameForm === "external") {
    // Simpler: avoid complex combinations
    given = pick(parts.first) + pick(parts.second);
  }

  // Pronunciation: simplified -> perhaps shorter or common letters, but for now, no change

  // Meaning flavor: could affect pool, but for now, no change

  // Cultural context: no change for now

  // Style: no change for now

  const fullName = surname ? `${given}${separator}${surname}` : given;
  return fullName;
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

  // 辈分字：如果用户选了，就用；否则随机挑一个
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
    base =
      titlePosition === "prefix"
        ? `${t}${titleJoiner}${base}`
        : `${base}${titleJoiner}${t}`;
  }

  return base;
}

function getRaceFromPathname(pathname: string) {
  const seg = pathname.split("?")[0].split("/").filter(Boolean)[0] || "";
  return seg;
}

export default function NameGenerator({
  title,
  description,
  backHref = "/", // 目前 UI 不显示 back，这里保留兼容
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

  isAdvanced = false,
  onAdvancedToggle,
}: Props) {
  const advancedAnchorRef = useRef<HTMLDivElement>(null);

  const hasCjk = cjkMode !== "off";
  const hasGeneration =
    Array.isArray(cjkGenerationChars) && cjkGenerationChars.length > 0;
  const hasTitles = Array.isArray(cjkTitles) && cjkTitles.length > 0;

  // URL-driven state (race from pathname, class/gender from query)
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raceFromUrl = useMemo(() => getRaceFromPathname(pathname), [pathname]);
  const clazz = searchParams.get("class") ?? "";
  const gender = searchParams.get("gender") ?? "";

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

  // ✅ Generate loading state（修复：isGenerating 未定义）
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ Toast state（避免 toastMsg/toastOpen 未定义）
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // ✅ Toolbar controls (layout-first)
  const [batchCount, setBatchCount] = useState<number>(initialCount);
  const [noDuplicates, setNoDuplicates] = useState<boolean>(true);

  // Elf options
  const [elfOptions, setElfOptions] = useState<ElfOptions>(defaultElfOptions);

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
    maxAttempts = count * 30,
    dedupe = true
  ) {
    const batch: string[] = [];
    const seen = new Set<string>();

    let attempts = 0;
    while (batch.length < count && attempts < maxAttempts) {
      attempts += 1;
      const n = makeOne();
      if (dedupe) {
        if (seen.has(n)) continue;
        if (recentSetRef.current.has(n)) continue;
      }
      seen.add(n);
      batch.push(n);
    }

    // Fallback: if the pool is too small, allow repeats (when dedupe is off, allow freely)
    while (batch.length < count) {
      const n = makeOne();
      if (dedupe) {
        if (seen.has(n)) continue;
        seen.add(n);
        batch.push(n);
      } else {
        batch.push(n);
      }
    }

    if (dedupe) remember(batch);
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
    if (raceFromUrl === "elf") {
      return makeElfName(parts, separator, elfOptions);
    }
    return makeNameDefault(parts, separator);
  }

  function regenerate(nextMode?: "two" | "three") {
    const mode = nextMode ?? effectiveCjkMode;
    setNames(
      generateUniqueBatch(
        batchCount,
        () => generateOne(mode),
        undefined,
        noDuplicates
      )
    );
  }

  const [names, setNames] = useState<string[]>(() =>
    generateUniqueBatch(
      batchCount,
      () => generateOne(effectiveCjkMode),
      undefined,
      noDuplicates
    )
  );

  // ✅ 当关键控制项变化时，自动刷新一次（用户体验更一致）
  useEffect(() => {
    if (!hasCjk) return;
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCjkMode, generationChar, titlePick, titlePos]);

  // ✅ URL-driven: when race/class/gender changes, refresh names without reload.
  useEffect(() => {
    // Reset short-term de-dup memory so switching filters feels responsive.
    recentListRef.current = [];
    recentSetRef.current = new Set();
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clazz, gender, raceFromUrl]);

  // Auto regenerate when toolbar controls change
  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchCount, noDuplicates]);

  // Auto regenerate when elf options change
  useEffect(() => {
    if (raceFromUrl === "elf") {
      regenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elfOptions]);

  const copyText = useMemo(() => names.join("\n"), [names]);

  function onGenerate() {
    setIsGenerating(true);
    window.setTimeout(() => {
      regenerate();
      setIsGenerating(false);
    }, 220);
  }

  async function onCopy() {
    await navigator.clipboard.writeText(copyText);
    setToastMsg("Copied to clipboard");
    setToastOpen(true);
  }

  return (
    <section className="space-y-8">
      {!hideHeader && (
        <header className="space-y-2">
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
                  onChange={(e) =>
                    setTitlePos(e.target.value as "suffix" | "prefix")
                  }
                >
                  <option value="suffix">{cjkTitleSuffixLabel}</option>
                  <option value="prefix">{cjkTitlePrefixLabel}</option>
                </select>
              </label>
            )}
          </div>
        )}

        {/* Elf controls */}
        {raceFromUrl === "elf" && (
          <>
            {/* Normal controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <div className="mb-2 text-xs font-medium text-zinc-600">Style</div>
                <div className="flex flex-wrap gap-2">
                  {elfStyleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`h-9 rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                        elfOptions.style === opt.value
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-900"
                      }`}
                      onClick={() =>
                        setElfOptions((prev) => ({ ...prev, style: opt.value }))
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium text-zinc-600">Length</div>
                <div className="flex flex-wrap gap-2">
                  {elfLengthOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`h-9 rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                        elfOptions.length === opt.value
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-900"
                      }`}
                      onClick={() =>
                        setElfOptions((prev) => ({ ...prev, length: opt.value }))
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm h-9">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={elfOptions.surname}
                  onChange={(e) =>
                    setElfOptions((prev) => ({ ...prev, surname: e.target.checked }))
                  }
                />
                <span className="text-zinc-700">Include surname</span>
              </label>

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm h-9"
                onClick={() => onAdvancedToggle?.()}
              >
                Advanced {isAdvanced ? "▴" : "▾"}
              </button>
            </div>

            {/* Advanced controls */}
            <div
              style={{
                maxHeight: isAdvanced ? '1000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              <div className="mt-3 border-t pt-3">
                <details className="mb-3">
                  <summary className="cursor-pointer text-sm font-medium text-zinc-900 mb-2">What affects elven names?</summary>
                  <div className="text-sm text-zinc-700 space-y-1">
                    <p>Elven names may change across regions and cultures</p>
                    <p>The same elf can be known by different names in formal records and daily speech</p>
                    <p>Honorifics and name length often reflect social standing or historical context</p>
                    <p>This generator focuses on lore-consistent variations rather than fixed identities</p>
                  </div>
                </details>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <label className="text-sm text-zinc-700">
                    <div className="mb-2 text-xs font-medium text-zinc-600">Cultural context</div>
                    <div className="flex flex-wrap gap-2">
                      {elfCulturalContextOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`h-9 rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                            elfOptions.culturalContext === opt.value
                              ? "border-zinc-900 bg-zinc-900 text-white"
                              : "border-zinc-200 bg-white text-zinc-900"
                          }`}
                          onClick={() =>
                            setElfOptions((prev) => ({ ...prev, culturalContext: opt.value }))
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="text-sm text-zinc-700">
                    <div className="mb-2 text-xs font-medium text-zinc-600">Name form</div>
                    <div className="flex flex-wrap gap-2">
                      {elfNameFormOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`h-9 rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                            elfOptions.nameForm === opt.value
                              ? "border-zinc-900 bg-zinc-900 text-white"
                              : "border-zinc-200 bg-white text-zinc-900"
                          }`}
                          onClick={() =>
                            setElfOptions((prev) => ({ ...prev, nameForm: opt.value }))
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label className="text-sm text-zinc-700">
                    <div className="mb-2 text-xs font-medium text-zinc-600">Cultural origin</div>
                    <div className="flex flex-wrap gap-2">
                      {elfCulturalOriginOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`h-9 rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow ${
                            elfOptions.culturalOrigin === opt.value
                              ? "border-zinc-900 bg-zinc-900 text-white"
                              : "border-zinc-200 bg-white text-zinc-900"
                          }`}
                          onClick={() =>
                            setElfOptions((prev) => ({ ...prev, culturalOrigin: opt.value }))
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
              onClick={onGenerate}
            >
              {isGenerating ? "Generating…" : generateLabel}
            </button>

            <button
              type="button"
              className="btn-secondary px-4 py-2"
              onClick={onCopy}
            >
              {copyLabel}
            </button>
          </div>

          {/* Right: controls */}
          <div ref={advancedAnchorRef} className="flex flex-wrap items-center gap-2 sm:justify-end">
            {/* Batch */}
            <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm">
              <span className="text-zinc-700">Batch</span>
              <select
                className="bg-transparent outline-none"
                value={batchCount}
                onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            {/* No duplicates */}
            <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={noDuplicates}
                onChange={(e) => setNoDuplicates(e.target.checked)}
              />
              <span className="text-zinc-700">No duplicates</span>
            </label>
          </div>
        </div>

        {isAdvanced && raceFromUrl !== "elf" && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            More controls coming soon.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          {names.map((n, idx) => (
            <div
              key={`${n}-${idx}`}
              className="w-full rounded-xl bg-zinc-50 px-3 py-2 font-medium"
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {examples.length > 0 && <ExampleNamesCard items={examples} />}

      <Toast
        message={toastMsg}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </section>
  );
}
