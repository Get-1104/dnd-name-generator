"use client";

import type { ForwardedRef, MouseEvent } from "react";
import { forwardRef, memo, startTransition, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { ELF_NAME_ENTRIES, type NameEntry } from "@/lib/elfNameEntries";
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

  /** Optional entries override (defaults to ELF_NAME_ENTRIES) */
  entries?: NameEntry[];

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
  return (
    <button
      type="button"
      data-value={value}
      onClick={onClick}
      className={`inline-flex w-full items-center justify-center h-9 rounded-lg border px-3 text-sm text-center shadow-sm hover:shadow ${
        isSelected
          ? "border-zinc-500 bg-zinc-200 text-zinc-900"
          : "border-zinc-200 bg-white text-zinc-800"
      }`}
    >
      <span className="whitespace-normal leading-tight">{label}</span>
    </button>
  );
});

const isLongLabel = (s: string) => {
  const t = (s || "").trim();
  if (!t) return false;
  if (t.includes(" / ")) return true;
  if (t.length >= 14) return true;
  if (t.includes("-") && t.length >= 12) return true;
  return false;
};

type TagGroupProps = {
  label: string;
  options: TagOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  gridColsClass?: string;
};

function TagGroupBase({
  label,
  options,
  selectedValue,
  onSelect,
  gridColsClass = "grid grid-cols-3 gap-2 [grid-auto-flow:dense] items-stretch",
}: TagGroupProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const value = event.currentTarget.dataset.value ?? "";
      onSelect(value || null);
    },
    [onSelect]
  );

  return (
    <div className="grid grid-cols-[140px,1fr] gap-x-4 gap-y-2 items-start">
      <div className="w-[140px] shrink-0">
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="min-w-0">
        <div className={gridColsClass}>
          {options.map((opt) => (
            <div key={opt.value} className={isLongLabel(opt.label) ? "col-span-2" : ""}>
              <TagButton
                label={opt.label}
                value={opt.value}
                isSelected={selectedValue === opt.value}
                onClick={handleClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TagGroup = memo(TagGroupBase);

function AdvancedTagGroup({
  label,
  options,
  selectedValue,
  onSelect,
  gridColsClass,
}: TagGroupProps & { gridColsClass: string }) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const value = event.currentTarget.dataset.value ?? "";
      onSelect(value || null);
    },
    [onSelect]
  );

  void gridColsClass;

  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-3">
      <div className="pt-2 text-xs font-medium tracking-wide text-neutral-500">{label}</div>
      <div className="flex flex-wrap gap-2 max-h-[76px] overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            data-value={opt.value}
            data-active={selectedValue === opt.value}
            onClick={handleClick}
            className={optionPill}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FormatTagGroup({
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
    <div className="grid grid-cols-[140px,1fr] gap-x-4 gap-y-2 items-start">
      <div className="w-[140px] shrink-0">
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="min-w-0">
        <div className="grid grid-cols-3 gap-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              data-value={opt.value}
              onClick={handleClick}
              className={`flex w-full items-center justify-center h-9 rounded-lg border px-3 text-sm shadow-sm hover:shadow ${
                selectedValue === opt.value
                  ? "border-zinc-500 bg-zinc-200 text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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

function shuffleArray<T>(arr: T[]) {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

type EntryFilterOptions = {
  nation: string | null;
  culturalOrigin: ElfOptions["culturalOrigin"] | null;
  era: WeightSelections["era"] | null;
  gender: WeightSelections["gender"] | null;
  culturalContext: ElfOptions["culturalContext"] | null;
  nameForm: ElfOptions["nameForm"] | null;
  style: ElfOptions["style"] | null;
  length: ElfOptions["length"] | null;
};

type EntryGenerationResult = {
  names: string[];
  relaxed: boolean;
};

const formatPill =
  "inline-flex items-center justify-center h-9 min-h-0 px-3 text-sm rounded-xl border border-neutral-200 bg-white shadow-sm " +
  "hover:bg-neutral-50 active:scale-[0.99] transition " +
  "data-[active=true]:border-neutral-300 data-[active=true]:bg-neutral-300 data-[active=true]:text-neutral-900";

const optionPill =
  "h-9 px-3 text-sm leading-none rounded-xl border border-neutral-200 bg-white shadow-sm " +
  "hover:bg-neutral-50 active:scale-[0.99] transition " +
  "data-[active=true]:border-neutral-300 data-[active=true]:bg-neutral-300 data-[active=true]:text-neutral-900 " +
  "whitespace-nowrap";

function mapForm(value: ElfNameForm | null | undefined): NameEntry["form"] | null {
  if (!value) return null;
  if (value === "short") return "everyday";
  if (value === "full") return "formal";
  return "outsider";
}

function mapEra(value: WeightSelections["era"] | null | undefined): NameEntry["era"] | null {
  if (!value) return null;
  if (value === "ancient") return "ancient";
  if (value === "revival") return "revival";
  return "revival";
}

function hasSoftSelections(filters: EntryFilterOptions) {
  return Boolean(
    filters.culturalOrigin ||
      filters.era ||
      filters.gender ||
      filters.culturalContext ||
      filters.nameForm ||
      filters.style
  );
}

function getMatchCount(entry: NameEntry, filters: EntryFilterOptions) {
  let count = 0;
  if (filters.culturalOrigin && entry.culturalOrigin === filters.culturalOrigin) count += 1;
  if (filters.era) {
    const era = mapEra(filters.era);
    if (era && entry.era === era) count += 1;
  }
  if (filters.gender && entry.gender === filters.gender) count += 1;
  if (filters.culturalContext && entry.context === filters.culturalContext) count += 1;
  if (filters.nameForm) {
    const form = mapForm(filters.nameForm);
    if (form && entry.form === form) count += 1;
  }
  if (filters.style && entry.style === filters.style) count += 1;
  return count;
}

function getEntryRealm(entry: NameEntry) {
  return entry.realm ?? entry.nation;
}

function buildResultsFromEntriesFast(
  entries: NameEntry[],
  filters: EntryFilterOptions,
  count: number,
  makeName: (entry: NameEntry) => string,
  exclude?: Set<string>
) : EntryGenerationResult {
  const lengthFiltered = filters.length
    ? entries.filter((entry) => entry.length === undefined || entry.length === filters.length)
    : entries.slice();

  if (lengthFiltered.length === 0) return { names: [], relaxed: false };

  const matchCounts = new Map<NameEntry, number>();
  for (const entry of lengthFiltered) {
    matchCounts.set(entry, getMatchCount(entry, filters));
  }

  const softSelected = hasSoftSelections(filters);
  let relaxed = false;
  let candidates = lengthFiltered;
  if (softSelected) {
    const primaryCandidates = lengthFiltered.filter((entry) => (matchCounts.get(entry) ?? 0) >= 1);
    if (primaryCandidates.length > 0) {
      candidates = primaryCandidates;
    } else {
      relaxed = true;
    }
  }

  const maxRealmCount = Math.max(1, Math.floor(count * 0.7));
  const realmCounts = new Map<string | undefined, number>();
  const results: NameEntry[] = [];

  function pickWeighted(pool: NameEntry[]) {
    if (pool.length === 0) return null;
    const poolRealms = new Set(pool.map((entry) => getEntryRealm(entry)));
    const hasRealmAlternatives = poolRealms.size > 1;

    const weights = pool.map((entry) => {
      const matchCount = matchCounts.get(entry) ?? 0;
      let weight = 1 + matchCount * 3;
      if (hasRealmAlternatives) {
        const realm = getEntryRealm(entry);
        const current = realmCounts.get(realm) ?? 0;
        if (current >= maxRealmCount) {
          weight *= 0.2;
        }
      }
      return Math.max(0.05, weight);
    });

    const total = weights.reduce((sum, weight) => sum + weight, 0);
    if (total <= 0) return null;

    let roll = Math.random() * total;
    let pickedIndex = 0;
    for (let i = 0; i < pool.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) {
        pickedIndex = i;
        break;
      }
    }

    const [picked] = pool.splice(pickedIndex, 1);
    return picked ?? null;
  }

  const excludeSet = exclude ?? new Set<string>();
  const primaryPool = candidates.filter((entry) => !excludeSet.has(entry.name));
  const fallbackPool = candidates.filter((entry) => excludeSet.has(entry.name));

  while (results.length < count && primaryPool.length > 0) {
    const picked = pickWeighted(primaryPool);
    if (!picked) break;
    results.push(picked);
    const realm = getEntryRealm(picked);
    realmCounts.set(realm, (realmCounts.get(realm) ?? 0) + 1);
  }

  const remainingPool = [...fallbackPool, ...primaryPool];
  while (results.length < count && remainingPool.length > 0) {
    const picked = pickWeighted(remainingPool);
    if (!picked) break;
    results.push(picked);
    const realm = getEntryRealm(picked);
    realmCounts.set(realm, (realmCounts.get(realm) ?? 0) + 1);
  }

  return { names: results.map((entry) => makeName(entry)), relaxed };
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

export default function NameGenerator({
  title,
  description,
  backHref = "/", // 目前 UI 不显示 back，这里保留兼容
  entries,
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

  isAdvanced,
  onAdvancedToggle,
}: Props) {
  const entriesSource = useMemo(() => entries ?? ELF_NAME_ENTRIES, [entries]);
  const [internalAdvanced, setInternalAdvanced] = useState(false);
  const isAdvancedActive = typeof isAdvanced === "boolean" ? isAdvanced : internalAdvanced;
  const handleAdvancedToggle = onAdvancedToggle ?? (() => setInternalAdvanced((prev) => !prev));
  const hasCjk = cjkMode !== "off";
  const hasGeneration =
    Array.isArray(cjkGenerationChars) && cjkGenerationChars.length > 0;
  const hasTitles = Array.isArray(cjkTitles) && cjkTitles.length > 0;

  // URL-driven state (class/gender from query)
  const searchParams = useSearchParams();
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
  const batchCount = 10;
  const COOLDOWN_SIZE = 40;

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
  const [lengthWarning, setLengthWarning] = useState(false);
  const [tagRelaxedWarning, setTagRelaxedWarning] = useState(false);
  const [recentNames, setRecentNames] = useState<string[]>([]);
  const [surnameCustom, setSurnameCustom] = useState("");

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

  const resetElfAdvancedOptions = useCallback(() => {
    setNation(null);
    setGender(null);
    setEra(null);
    setSelectedOrigin(null);
    setSelectedContext(null);
    setSelectedForm(null);
    setSelectedStyle(null);
    setSelectedLength(null);
    setIncludeSurname(defaultElfOptions.surname);
    setSurnameCustom("");
    setLengthWarning(false);
    setTagRelaxedWarning(false);
    setRecentNames([]);
  }, []);


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
        if (!n) continue;

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
        if (!fallbackName) continue;
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

  async function generateUniqueBatchAsync(
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
  ): Promise<GenerateBatchResult> {
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
        if (!n) continue;

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
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      if (!added) {
        if (fallbackLevel < makers.length - 1) {
          fallbackLevel += 1;
          continue;
        }

        const fallbackName = makers[makers.length - 1]();
        if (fallbackName) {
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
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    }

    if (batch.length < count) {
      const maker = makers[makers.length - 1];
      while (batch.length < count) {
        const nextName = maker();
        if (nextName) {
          batch.push(nextName);
          totalAttempts += 1;
          await new Promise((resolve) => setTimeout(resolve, 0));
        } else {
          break;
        }
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
    const optionsForGeneration = { ...elfOptions, surname: includeSurname, surnameCustom };
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
        length: null,
      },
    });
    if (traceEnabled && result.trace) {
      // eslint-disable-next-line no-console
      console.log(result.trace);
    }
    return result.name;
  }

  function buildElfName(given: string) {
    if (includeSurname) {
      const custom = surnameCustom.trim();
      if (custom) {
        return `${given}${separator}${custom}`;
      }
      const surname = `${pick(parts.lastA)}${pick(parts.lastB)}`;
      return `${given}${separator}${surname}`;
    }
    return given;
  }

  async function regenerate(nextMode?: "two" | "three") {
    const mode = nextMode ?? effectiveCjkMode;
    void mode;
    const weightSelections = buildWeightSelections();
    const result = buildResultsFromEntriesFast(
      entriesSource,
      {
        nation: weightSelections.nation,
        culturalOrigin: weightSelections.culturalOrigin,
        era: weightSelections.era,
        gender: weightSelections.gender,
        culturalContext: weightSelections.culturalContext,
        nameForm: weightSelections.nameForm,
        style: weightSelections.style,
        length: weightSelections.length,
      },
      batchCount,
      (entry) => buildElfName(entry.name),
      new Set(recentNames)
    );
    setTagRelaxedWarning(result.relaxed);
    setLengthWarning(Boolean(selectedLength) && result.names.length < batchCount);
    startTransition(() => setNames(result.names));
    setRecentNames((prev) => {
      const merged = [...result.names, ...prev];
      return Array.from(new Set(merged)).slice(0, COOLDOWN_SIZE);
    });
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[NameGenerator] generate", {
        requestedCount: batchCount,
        generatedCount: result.names.length,
        totalAttempts: result.names.length,
      });
    }
  }

  const [names, setNames] = useState<string[]>(() => {
    const weightSelections = buildWeightSelections();
    return buildResultsFromEntriesFast(
      entriesSource,
      {
        nation: weightSelections.nation,
        culturalOrigin: weightSelections.culturalOrigin,
        era: weightSelections.era,
        gender: weightSelections.gender,
        culturalContext: weightSelections.culturalContext,
        nameForm: weightSelections.nameForm,
        style: weightSelections.style,
        length: weightSelections.length,
      },
      batchCount,
      (entry) => buildElfName(entry.name)
    ).names;
  });


  const copyText = useMemo(() => names.join("\n"), [names]);

  useEffect(() => {
    if (recentNames.length > 0) return;
    if (names.length === 0) return;
    setRecentNames(names.slice(0, COOLDOWN_SIZE));
  }, [COOLDOWN_SIZE, names, recentNames.length]);

  useEffect(() => {
    if (isAdvancedActive) return;
    setNation(null);
    setGender(null);
    setEra(null);
    setSelectedOrigin(null);
    setSelectedContext(null);
    setSelectedForm(null);
    setSelectedStyle(null);
    setSelectedLength(null);
    setIncludeSurname(defaultElfOptions.surname);
    setSurnameCustom("");
    setLengthWarning(false);
    setTagRelaxedWarning(false);
    setRecentNames([]);
  }, [isAdvancedActive]);

  async function onGenerate() {
    console.log("[GEN] click", Date.now());
    console.time("[GEN] total");
    setIsGenerating(true);
    try {
      await regenerate();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("[NameGenerator] generate failed", error);
      }
      const fallback = await generateUniqueBatchAsync(
        batchCount,
        () => makeNameDefault(parts, separator, includeSurname),
        {
          maxAttemptsPerName: 20,
          maxTotalAttempts: batchCount * 20,
          dedupe: false,
        }
      );
      startTransition(() => setNames(fallback.batch));
    } finally {
      console.timeEnd("[GEN] total");
      setIsGenerating(false);
    }
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

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
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

        {/* Advanced controls */}
        <>
            {/* Normal controls */}
            {!isAdvancedActive && (
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
                    onClick={handleAdvancedToggle}
                  >
                    Advanced options ›
                  </button>
                </div>

                <p className="mt-2 text-sm text-zinc-600">Using default settings optimized for lore-friendly names. For more customization, open Advanced.</p>
              </>
            )}

            {/* Advanced controls */}
            <div
              style={{
                maxHeight: isAdvancedActive ? "1200px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease-in-out",
              }}
            >
              <div className="mt-3 space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-zinc-900">Advanced options</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      onClick={resetElfAdvancedOptions}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      onClick={handleAdvancedToggle}
                    >
                      Back to Basic
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <div className="pt-2 text-sm text-neutral-700">Nation / Realm</div>
                    <div className="flex flex-wrap gap-2">
                      {nationOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectNation(opt.value)}
                          data-active={nation === opt.value}
                          className={optionPill}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <div className="pt-2 text-sm text-neutral-700">Cultural origin</div>
                    <div className="flex flex-wrap gap-2">
                      {originOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectOrigin(opt.value)}
                          data-active={selectedOrigin === opt.value}
                          className={optionPill}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <div className="pt-2 text-sm text-neutral-700">Era</div>
                    <div className="flex flex-wrap gap-2">
                      {eraOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectEra(opt.value)}
                          data-active={era === opt.value}
                          className={optionPill}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <div className="pt-2 text-sm text-neutral-700">Gender</div>
                    <div className="flex flex-wrap gap-2">
                      {genderOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectGender(opt.value)}
                          data-active={gender === opt.value}
                          className={optionPill}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <div className="pt-2 text-sm text-neutral-700">Cultural context</div>
                    <div className="flex flex-wrap gap-2">
                      {contextOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectContext(opt.value)}
                          data-active={selectedContext === opt.value}
                          className={optionPill}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <section className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <div className="text-sm text-neutral-700">Name form</div>
                      <div className="flex flex-wrap gap-3 ml-4">
                        <button
                          type="button"
                          data-active={selectedForm === "short"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectForm("short")}
                        >
                          Everyday
                        </button>
                        <button
                          type="button"
                          data-active={selectedForm === "full"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectForm("full")}
                        >
                          Formal
                        </button>
                        <button
                          type="button"
                          data-active={selectedForm === "external"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectForm("external")}
                        >
                          Outsider-friendly
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <div className="text-sm text-neutral-700">Style</div>
                      <div className="flex flex-wrap gap-3 ml-4">
                        <button
                          type="button"
                          data-active={selectedStyle === "elegant"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectStyle("elegant")}
                        >
                          Elegant
                        </button>
                        <button
                          type="button"
                          data-active={selectedStyle === "nature"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectStyle("nature")}
                        >
                          Nature
                        </button>
                        <button
                          type="button"
                          data-active={selectedStyle === "simple"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectStyle("simple")}
                        >
                          Simple
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <div className="text-sm text-neutral-700">Length</div>
                      <div className="flex flex-wrap gap-3 ml-4">
                        <button
                          type="button"
                          data-active={selectedLength === "short"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectLength("short")}
                        >
                          Short
                        </button>
                        <button
                          type="button"
                          data-active={selectedLength === "medium"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectLength("medium")}
                        >
                          Medium
                        </button>
                        <button
                          type="button"
                          data-active={selectedLength === "long"}
                          className={`${formatPill} inline-flex w-auto whitespace-nowrap`}
                          onClick={() => onSelectLength("long")}
                        >
                          Long / Formal
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                      <div className="text-sm text-neutral-700"> </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={includeSurname}
                            onChange={(e) => setIncludeSurname(e.target.checked)}
                          />
                          <span className="text-sm font-medium">Include surname</span>
                        </label>
                        <input
                          type="text"
                          value={surnameCustom}
                          onChange={(e) => setSurnameCustom(e.target.value)}
                          placeholder="Custom surname (optional)"
                          disabled={!includeSurname}
                          className={`h-9 w-full max-w-sm rounded-lg border px-3 text-sm placeholder:text-zinc-400 ${
                            includeSurname
                              ? "border-zinc-200 bg-white text-zinc-900"
                              : "border-zinc-200 bg-zinc-100 text-zinc-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

        {(isAdvancedActive) && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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
            {isAdvancedActive && (
              <div className="text-xs text-zinc-500">Tip: fewer tags = more variety</div>
            )}
          </div>
        )}
          </>

        {tagRelaxedWarning && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            标签过多/库标签不足，已放宽匹配
          </div>
        )}

        {lengthWarning && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            Not enough names match the selected length. Try another length or remove 1–2 tags.
          </div>
        )}

        {names.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            No names match the current tags. Try removing 1–2 tags.
          </div>
        ) : (
          <NameResults ref={nameResultsRef} names={names} />
        )}
      </div>

      {examples.length > 0 && <ExampleNamesCard items={examples} />}
    </section>
  );
}
