"use client";

import type { ForwardedRef, MouseEvent } from "react";
import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ExampleNamesCard from "@/components/ExampleNamesCard";
import Toast from "@/components/Toast";
import {
  ElfOptions,
  type ElfCulturalContext,
  type ElfCulturalOrigin,
  type ElfLength,
  type ElfNameForm,
  type ElfStyle,
  defaultElfOptions,
  elfStyleOptions,
  elfLengthOptions,
  elfCulturalContextOptions,
  elfNameFormOptions,
  elfCulturalOriginOptions,
} from "@/lib/elfOptions";
import { generateWeightedElfName, NATION_OPTIONS } from "@/lib/weightedNameGenerator";

type WeightSelections = {
  nation: string | null;
  culturalOrigin: ElfOptions["culturalOrigin"] | null;
  era: "ancient" | "contemporary" | "revival" | null;
  gender: "masculine" | "feminine" | "neutral" | null;
  culturalContext: ElfOptions["culturalContext"] | null;
  nameForm: ElfOptions["nameForm"] | null;
  style: ElfOptions["style"] | null;
  length: ElfOptions["length"] | null;
};

type GenerateBatchOptions = {
  maxAttemptsPerName?: number;
  maxTotalAttempts?: number;
  dedupe?: boolean;
  prefixGuard?: { prefixLen: number; maxShare: number };
  givenGuard?: { prefixLen: number; suffixLen: number; maxShare: number };
  fallbackMakers?: Array<() => string>;
};

type GenerateBatchResult = {
  batch: string[];
  totalAttempts: number;
  fallbackLevel: number;
};


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

type TagOption = { value: string; label: string };

const TagButton = memo(function TagButton({
  label,
  value,
  isSelected,
  onClick,
}: {
  label: string;
  value: string;
  isSelected: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[TagButton]", label, "render", renderCount.current);
  }

  return (
    <button
      type="button"
      data-value={value}
      onClick={onClick}
      className={`inline-flex items-center justify-center h-8 min-w-28 whitespace-nowrap rounded-lg border px-3 py-2 text-sm shadow-sm hover:shadow ${
        isSelected ? "border-zinc-400 bg-zinc-100 text-zinc-900" : "border-zinc-200 bg-white text-zinc-800"
      }`}
    >
      {label}
    </button>
  );
});

type TagGroupProps = {
  label: string;
  options: TagOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
};

function TagGroupBase({
  label,
  options,
  selectedValue,
  onSelect,
}: TagGroupProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const value = event.currentTarget.dataset.value ?? "";
      onSelect(value || null);
    },
    [onSelect]
  );

  return (
    <div className="flex items-start gap-3">
      <div className="flex items-start w-44 pt-1">
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <TagButton
            key={opt.value}
            label={opt.label}
            value={opt.value}
            isSelected={selectedValue === opt.value}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

const TagGroup = memo(TagGroupBase);

type NameResultsHandle = {
  notifyCopied: () => void;
};

const NameResults = memo(
  forwardRef(function NameResults(
    { names }: { names: string[] },
    ref: ForwardedRef<NameResultsHandle>
  ) {
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    const notifyCopied = useCallback(() => {
      setToastMsg("Copied to clipboard");
      setToastOpen(true);
    }, []);

    const onToastClose = useCallback(() => setToastOpen(false), []);

    useImperativeHandle(ref, () => ({ notifyCopied }), [notifyCopied]);

    return (
      <>
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

        <Toast message={toastMsg} open={toastOpen} onClose={onToastClose} />
      </>
    );
  })
);

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeNameDefault(parts: Parts, separator: string, includeSurname: boolean) {
  const given = `${pick(parts.first)}${pick(parts.second)}`;
  if (!includeSurname) return given;
  return `${given}${separator}${pick(parts.lastA)}${pick(parts.lastB)}`;
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
  initialCount = 20,
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
  const hasCjk = cjkMode !== "off";
  const hasGeneration =
    Array.isArray(cjkGenerationChars) && cjkGenerationChars.length > 0;
  const hasTitles = Array.isArray(cjkTitles) && cjkTitles.length > 0;

  // URL-driven state (race from pathname, class/gender from query)
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raceFromUrl = useMemo(() => getRaceFromPathname(pathname), [pathname]);
  const seed = searchParams.get("seed") ?? undefined;
  const traceEnabled = searchParams.get("trace") === "1";

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

  const nameResultsRef = useRef<NameResultsHandle>(null);

  // ✅ Toolbar controls (layout-first)
  const [batchCount, setBatchCount] = useState<number>(initialCount);

  // Elf options
  const [elfOptions] = useState<ElfOptions>(defaultElfOptions);

  const [nation, setNation] = useState<string | null>(null);
  const [gender, setGender] = useState<"masculine" | "feminine" | "neutral" | null>(null);
  const [era, setEra] = useState<"ancient" | "contemporary" | "revival" | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<ElfCulturalOrigin | null>(null);
  const [selectedContext, setSelectedContext] = useState<ElfCulturalContext | null>(null);
  const [selectedForm, setSelectedForm] = useState<ElfNameForm | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ElfStyle | null>(null);
  const [selectedLength, setSelectedLength] = useState<ElfLength | null>(null);
  const [includeSurname, setIncludeSurname] = useState<boolean>(defaultElfOptions.surname);

  const nationOptions = useMemo(() => NATION_OPTIONS, []);
  const originOptions = useMemo(() => [...elfCulturalOriginOptions], []);
  const eraOptions = useMemo(
    () => [
      { value: "ancient", label: "Ancient" },
      { value: "contemporary", label: "Contemporary" },
      { value: "revival", label: "Revival" },
    ],
    []
  );
  const genderOptions = useMemo(
    () => [
      { value: "masculine", label: "Masculine" },
      { value: "feminine", label: "Feminine" },
      { value: "neutral", label: "Neutral" },
    ],
    []
  );
  const contextOptions = useMemo(() => [...elfCulturalContextOptions], []);
  const formOptions = useMemo(() => [...elfNameFormOptions], []);
  const styleOptions = useMemo(() => [...elfStyleOptions], []);
  const lengthOptions = useMemo(() => [...elfLengthOptions], []);

  const onSelectNation = useCallback(
    (value: string | null) => setNation((prev) => (prev === value ? null : value)),
    []
  );
  const onSelectOrigin = useCallback(
    (value: string | null) =>
      setSelectedOrigin((prev) => (prev === value ? null : (value as ElfCulturalOrigin | null))),
    []
  );
  const onSelectEra = useCallback(
    (value: string | null) =>
      setEra((prev) => (prev === value ? null : (value as "ancient" | "contemporary" | "revival" | null))),
    []
  );
  const onSelectGender = useCallback(
    (value: string | null) =>
      setGender((prev) => (prev === value ? null : (value as "masculine" | "feminine" | "neutral" | null))),
    []
  );
  const onSelectContext = useCallback(
    (value: string | null) =>
      setSelectedContext((prev) => (prev === value ? null : (value as ElfCulturalContext | null))),
    []
  );
  const onSelectForm = useCallback(
    (value: string | null) =>
      setSelectedForm((prev) => (prev === value ? null : (value as ElfNameForm | null))),
    []
  );
  const onSelectStyle = useCallback(
    (value: string | null) =>
      setSelectedStyle((prev) => (prev === value ? null : (value as ElfStyle | null))),
    []
  );
  const onSelectLength = useCallback(
    (value: string | null) =>
      setSelectedLength((prev) => (prev === value ? null : (value as ElfLength | null))),
    []
  );


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
    {
      maxAttemptsPerName = 60,
      maxTotalAttempts = count * 80,
      dedupe = true,
      prefixGuard,
      givenGuard,
      fallbackMakers = [],
    }: GenerateBatchOptions = {}
  ): GenerateBatchResult {
    const batch: string[] = [];
    const seen = new Set<string>();
    const prefixCounts = new Map<string, number>();
    const givenPrefixCounts = new Map<string, number>();
    const givenSuffixCounts = new Map<string, number>();
    const makers = [makeOne, ...fallbackMakers];

    let fallbackLevel = 0;
    let totalAttempts = 0;

    while (batch.length < count && totalAttempts < maxTotalAttempts) {
      let attemptsForName = 0;
      let added = false;
      const maker = makers[Math.min(fallbackLevel, makers.length - 1)];

      while (!added && attemptsForName < maxAttemptsPerName && totalAttempts < maxTotalAttempts) {
        totalAttempts += 1;
        attemptsForName += 1;
        const n = maker();

        if (givenGuard) {
          const given = n.split(" ")[0] ?? n;
          const prefix = given.slice(0, givenGuard.prefixLen).toLowerCase();
          const suffix = given.slice(-givenGuard.suffixLen).toLowerCase();
          if (prefix.length) {
            const nextCount = (givenPrefixCounts.get(prefix) ?? 0) + 1;
            const nextShare = nextCount / (batch.length + 1);
            if (nextShare > givenGuard.maxShare) {
              continue;
            }
          }
          if (suffix.length) {
            const nextCount = (givenSuffixCounts.get(suffix) ?? 0) + 1;
            const nextShare = nextCount / (batch.length + 1);
            if (nextShare > givenGuard.maxShare) {
              continue;
            }
          }
        }

        if (prefixGuard) {
          const prefix = n.slice(0, prefixGuard.prefixLen).toLowerCase();
          const nextCount = (prefixCounts.get(prefix) ?? 0) + 1;
          const nextShare = nextCount / (batch.length + 1);
          if (nextShare > prefixGuard.maxShare) {
            continue;
          }
        }

        if (dedupe) {
          if (seen.has(n)) continue;
          if (recentSetRef.current.has(n)) continue;
        }

        seen.add(n);
        if (prefixGuard) {
          const prefix = n.slice(0, prefixGuard.prefixLen).toLowerCase();
          prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);
        }
        if (givenGuard) {
          const given = n.split(" ")[0] ?? n;
          const prefix = given.slice(0, givenGuard.prefixLen).toLowerCase();
          const suffix = given.slice(-givenGuard.suffixLen).toLowerCase();
          if (prefix.length) {
            givenPrefixCounts.set(prefix, (givenPrefixCounts.get(prefix) ?? 0) + 1);
          }
          if (suffix.length) {
            givenSuffixCounts.set(suffix, (givenSuffixCounts.get(suffix) ?? 0) + 1);
          }
        }
        batch.push(n);
        added = true;
      }

      if (!added) {
        if (fallbackLevel < makers.length - 1) {
          fallbackLevel += 1;
          continue;
        }

        const fallbackName = makers[makers.length - 1]();
        totalAttempts += 1;
        batch.push(fallbackName);
        seen.add(fallbackName);
        if (prefixGuard) {
          const prefix = fallbackName.slice(0, prefixGuard.prefixLen).toLowerCase();
          prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);
        }
        if (givenGuard) {
          const given = fallbackName.split(" ")[0] ?? fallbackName;
          const prefix = given.slice(0, givenGuard.prefixLen).toLowerCase();
          const suffix = given.slice(-givenGuard.suffixLen).toLowerCase();
          if (prefix.length) {
            givenPrefixCounts.set(prefix, (givenPrefixCounts.get(prefix) ?? 0) + 1);
          }
          if (suffix.length) {
            givenSuffixCounts.set(suffix, (givenSuffixCounts.get(suffix) ?? 0) + 1);
          }
        }
      }
    }

    if (batch.length < count) {
      const maker = makers[makers.length - 1];
      while (batch.length < count) {
        batch.push(maker());
        totalAttempts += 1;
      }
    }

    if (dedupe) remember(batch);
    return { batch, totalAttempts, fallbackLevel };
  }

  function buildWeightSelections(): WeightSelections {
    const base: WeightSelections = {
      nation: nation ?? null,
      culturalOrigin: selectedOrigin,
      era: era ?? null,
      gender: gender ?? null,
      culturalContext: selectedContext,
      nameForm: selectedForm,
      style: selectedStyle,
      length: selectedLength,
    };
    return base;
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
      const optionsForGeneration = { ...elfOptions, surname: includeSurname };
      const weightSelections = buildWeightSelections();
      // Always use the structured Elf generator (even with no explicit selections),
      // so output stays name-like instead of reverting to legacy chunk splicing.
      const result = generateWeightedElfName({
        parts,
        options: optionsForGeneration,
        separator,
        seed,
        trace: traceEnabled,
        weights: {
          race: "elf",
          nation: weightSelections.nation,
          culturalOrigin: weightSelections.culturalOrigin,
          era: weightSelections.era,
          gender: weightSelections.gender,
          culturalContext: weightSelections.culturalContext,
          nameForm: weightSelections.nameForm,
          style: weightSelections.style,
          length: weightSelections.length,
        },
      });
      if (traceEnabled && result.trace) {
        // eslint-disable-next-line no-console
        console.log(result.trace);
      }
      return result.name;
    }
    return makeNameDefault(parts, separator, includeSurname);
  }

  function regenerate(nextMode?: "two" | "three") {
    const mode = nextMode ?? effectiveCjkMode;
    const result = generateUniqueBatch(batchCount, () => generateOne(mode), {
      maxAttemptsPerName: 60,
      maxTotalAttempts: batchCount * 80,
      dedupe: true,
      prefixGuard:
        raceFromUrl === "elf"
          ? { prefixLen: 2, maxShare: 0.4 }
          : undefined,
      givenGuard:
        raceFromUrl === "elf"
          ? { prefixLen: 3, suffixLen: 3, maxShare: 0.3 }
          : undefined,
      fallbackMakers: [],
    });
    setNames(result.batch);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[NameGenerator] generate", {
        requestedCount: batchCount,
        generatedCount: result.batch.length,
        totalAttempts: result.totalAttempts,
        fallbackLevel: result.fallbackLevel,
      });
    }
  }

  const [names, setNames] = useState<string[]>(() => {
    const result = generateUniqueBatch(batchCount, () => generateOne(effectiveCjkMode), {
      maxAttemptsPerName: 60,
      maxTotalAttempts: batchCount * 80,
      dedupe: true,
      prefixGuard:
        raceFromUrl === "elf"
          ? { prefixLen: 2, maxShare: 0.4 }
          : undefined,
      givenGuard:
        raceFromUrl === "elf"
          ? { prefixLen: 3, suffixLen: 3, maxShare: 0.3 }
          : undefined,
      fallbackMakers: [],
    });
    return result.batch;
  });


  const copyText = useMemo(() => names.join("\n"), [names]);

  function onGenerate() {
    setIsGenerating(true);
    window.setTimeout(() => {
      try {
        regenerate();
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("[NameGenerator] generate failed", error);
        }
        const fallback = generateUniqueBatch(
          batchCount,
          () => makeNameDefault(parts, separator, includeSurname),
          {
          maxAttemptsPerName: 20,
          maxTotalAttempts: batchCount * 20,
          dedupe: false,
          }
        );
        setNames(fallback.batch);
      } finally {
        setIsGenerating(false);
      }
    }, 220);
  }

  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(copyText);
    nameResultsRef.current?.notifyCopied();
  }, [copyText]);

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
            {!isAdvanced && (
              <>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
                    onClick={onGenerate}
                  >
                    {isGenerating ? "Generating…" : generateLabel}
                  </button>

                  <button
                    type="button"
                    className="text-base font-medium text-zinc-600 hover:text-zinc-800"
                    onClick={() => onAdvancedToggle?.()}
                  >
                    Advanced options ›
                  </button>
                </div>

                <p className="mt-2 text-sm text-zinc-600">Using default settings optimized for typical elf names. For more customization, open Advanced.</p>
              </>
            )}

            {/* Advanced controls */}
            <div
              style={{
                maxHeight: isAdvanced ? '1000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              <div className="mt-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-base font-medium text-zinc-600 hover:text-zinc-900"
                    onClick={() => onAdvancedToggle?.()}
                  >
                    ← Basic options
                  </button>
                </div>

                <div className="space-y-4">
                  <TagGroup
                    label="Nation / Realm"
                    options={nationOptions}
                    selectedValue={nation}
                    onSelect={onSelectNation}
                  />
                  <TagGroup
                    label="Cultural origin"
                    options={originOptions}
                    selectedValue={selectedOrigin}
                    onSelect={onSelectOrigin}
                  />
                  <TagGroup
                    label="Era"
                    options={eraOptions}
                    selectedValue={era}
                    onSelect={onSelectEra}
                  />
                  <TagGroup
                    label="Gender"
                    options={genderOptions}
                    selectedValue={gender}
                    onSelect={onSelectGender}
                  />
                  <TagGroup
                    label="Cultural context"
                    options={contextOptions}
                    selectedValue={selectedContext}
                    onSelect={onSelectContext}
                  />
                  <TagGroup
                    label="Name form"
                    options={formOptions}
                    selectedValue={selectedForm}
                    onSelect={onSelectForm}
                  />
                  <TagGroup
                    label="Style"
                    options={styleOptions}
                    selectedValue={selectedStyle}
                    onSelect={onSelectStyle}
                  />
                  <TagGroup
                    label="Length"
                    options={lengthOptions}
                    selectedValue={selectedLength}
                    onSelect={onSelectLength}
                  />
                </div>
              </div>
            </div>

            {isAdvanced && raceFromUrl === "elf" && (
              <div className="mt-3 space-y-4">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 w-44">
                    <span className="text-sm font-medium">Include surname</span>
                  </label>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={includeSurname}
                    onChange={(e) => setIncludeSurname(e.target.checked)}
                  />
                  <span className="text-sm font-medium ml-6">Results</span>
                  <select
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

        {(raceFromUrl !== "elf" || isAdvanced) && (
          <div className="mt-3 flex items-center gap-2">
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
        )}
          </>
        )}

        {isAdvanced && raceFromUrl !== "elf" && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            More controls coming soon.
          </div>
        )}

        <NameResults ref={nameResultsRef} names={names} />
      </div>

      {examples.length > 0 && <ExampleNamesCard items={examples} />}
    </section>
  );
}
