import type { ElfCulturalContext, ElfCulturalOrigin, ElfLength, ElfNameForm, ElfOptions, ElfStyle } from "./elfOptions";
import { ELF_NAME_ENTRIES } from "./elfNameEntries";
import type { NameEntry } from "./elfNameEntries";
import { hasSoftBigrams, isPronounceableEN } from "./phonotactics";
import { ELF_SURNAME_FAMILIES } from "./namePools/elfPools";

export type Parts = {
  first: string[];
  second: string[];
  lastA: string[];
  lastB: string[];
};

export type NationOption = {
  value: string;
  label: string;
};

export const NATION_OPTIONS: NationOption[] = [
  { value: "ancient-high-kingdom", label: "Ancient High Kingdom" },
  { value: "forest-realm", label: "Forest Realm" },
  { value: "coastal-elven-state", label: "Coastal Elven State" },
  { value: "isolated-mountain-enclave", label: "Isolated Mountain Enclave" },
  { value: "fallen-empire", label: "Fallen Empire" },
];

export type GenerationTrace = {
  seed?: string | number;
  applied: string[];
  decisions: string[];
  fallback?: string[];
  filteredCount?: number;
  totalCount?: number;
  entry?: NameEntry;
  entryTags?: Pick<NameEntry, "gender" | "origin" | "era" | "context" | "form" | "style">;
};

export type ElfWeightedInputs = {
  race: "elf";
  nation?: string | null;
  culturalOrigin?: ElfCulturalOrigin | null;
  era?: "ancient" | "contemporary" | "revival" | null;
  gender?: "masculine" | "feminine" | "neutral" | null;
  culturalContext?: ElfCulturalContext | null;
  nameForm?: ElfNameForm | null;
  style?: ElfStyle | null;
  length?: ElfLength | null;
};

export type WeightedElfNameParams = {
  parts: Parts;
  options: ElfOptions;
  weights: ElfWeightedInputs;
  separator: string;
  seed?: string | number;
  trace?: boolean;
};

export type WeightedElfNameResult = {
  name: string;
  trace?: GenerationTrace;
};

type RNG = () => number;
type LengthKey = "short" | "medium" | "long";
type BatchState = {
  names: Set<string>;
  givenNames: Set<string>;
  suffixCounts: Map<string, number>;
  total: number;
  lastUsed: number;
};

function mulberry32(seed: number): RNG {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed: string | number) {
  const str = String(seed);
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function createRng(seed?: string | number): RNG {
  if (seed === undefined || seed === null || seed === "") return Math.random;
  return mulberry32(hashSeed(seed));
}

function mapOrigin(value: ElfCulturalOrigin | null | undefined): NameEntry["origin"] | null {
  if (!value) return null;
  if (value === "wood-elf") return "wood";
  if (value === "drow") return "drow";
  return "high";
}

function mapEra(value: ElfWeightedInputs["era"] | null | undefined): NameEntry["era"] | null {
  if (!value) return null;
  if (value === "ancient") return "ancient";
  if (value === "revival") return "revival";
  return "revival";
}

function mapForm(value: ElfNameForm | null | undefined): NameEntry["form"] | null {
  if (!value) return null;
  if (value === "short") return "everyday";
  if (value === "full") return "formal";
  return "outsider";
}

const NATION_ENTRY_MAP: Record<string, { origins: NameEntry["origin"][]; eras: NameEntry["era"][] }> = {
  "ancient-high-kingdom": { origins: ["high"], eras: ["ancient"] },
  "forest-realm": { origins: ["wood"], eras: ["revival"] },
  "coastal-elven-state": { origins: ["high"], eras: ["revival"] },
  "isolated-mountain-enclave": { origins: ["high"], eras: ["revival"] },
  "fallen-empire": { origins: ["drow"], eras: ["ancient"] },
};

function matchesLength(name: string, length: LengthKey) {
  const n = name.length;
  if (length === "short") return n >= 4 && n <= 6;
  if (length === "medium") return n >= 6 && n <= 8;
  return n >= 8 && n <= 11;
}

const GIVEN_BANNED = new Set([
  "watcher",
  "runner",
  "weaver",
  "dancer",
  "singer",
  "moon",
  "leaf",
  "wind",
  "dawn",
  "mist",
  "silver",
  "star",
  "sun",
  "shadow",
  "river",
  "brook",
  "glade",
  "bloom",
  "crest",
  "vale",
  "song",
  "shade",
  "spire",
]);

const SURNAME_LENGTH = { min: 5, max: 12 };
const BATCH_CACHE = new Map<string, BatchState>();

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getBatchKey(seed?: string | number) {
  if (typeof seed === "string" && seed.length) {
    const idx = seed.lastIndexOf("-");
    return idx > 0 ? seed.slice(0, idx) : seed;
  }
  if (seed !== undefined && seed !== null) return String(seed);
  return "default";
}

function getBatchState(seed?: string | number) {
  const key = getBatchKey(seed);
  const now = Date.now();
  const existing = BATCH_CACHE.get(key);
  if (existing) {
    existing.lastUsed = now;
    return existing;
  }

  const state: BatchState = {
    names: new Set(),
    givenNames: new Set(),
    suffixCounts: new Map(),
    total: 0,
    lastUsed: now,
  };
  BATCH_CACHE.set(key, state);
  if (BATCH_CACHE.size > 8) {
    const oldest = Array.from(BATCH_CACHE.entries())
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed)
      .slice(0, BATCH_CACHE.size - 8);
    for (const [oldKey] of oldest) {
      BATCH_CACHE.delete(oldKey);
    }
  }
  return state;
}

function extractSuffix(name: string) {
  const lower = name.toLowerCase();
  return lower.length <= 3 ? lower : lower.slice(-3);
}

function wouldExceedSuffixShare(state: BatchState, suffix: string, maxShare = 0.35) {
  if (!suffix) return false;
  const current = state.suffixCounts.get(suffix) ?? 0;
  const nextShare = (current + 1) / (state.total + 1);
  return nextShare > maxShare;
}

function registerGivenName(state: BatchState, given: string, suffix: string) {
  state.total += 1;
  state.givenNames.add(given);
  if (suffix) {
    state.suffixCounts.set(suffix, (state.suffixCounts.get(suffix) ?? 0) + 1);
  }
}

function scoreEntry(entry: NameEntry, weights: ElfWeightedInputs) {
  let w = entry.weight;
  if (weights.gender && entry.gender === weights.gender) w *= 2.0;
  if (weights.culturalOrigin) {
    const origin = mapOrigin(weights.culturalOrigin);
    if (origin && entry.origin === origin) w *= 2.0;
  }
  if (weights.era) {
    const era = mapEra(weights.era);
    if (era && entry.era === era) w *= 1.8;
  }
  if (weights.culturalContext && entry.context === weights.culturalContext) w *= 1.5;
  if (weights.nameForm) {
    const form = mapForm(weights.nameForm);
    if (form && entry.form === form) w *= 1.4;
  }
  if (weights.style && entry.style === weights.style) w *= 1.3;
  if (weights.length && matchesLength(entry.name, weights.length)) w *= 1.15;
  if (weights.nation) {
    const mapping = NATION_ENTRY_MAP[weights.nation];
    if (mapping) {
      if (mapping.origins.includes(entry.origin)) w *= 1.25;
      if (mapping.eras.includes(entry.era)) w *= 1.25;
    }
  }
  return clamp(0.05, w, 9999);
}

function weightedPickByScore(
  entries: NameEntry[],
  weights: ElfWeightedInputs,
  rng: RNG,
  state: BatchState
) {
  const available = entries.filter((entry) => !state.givenNames.has(entry.name));
  const pool = available.length ? available : entries;
  const scores = pool.map((entry) => scoreEntry(entry, weights));
  const total = scores.reduce((sum, score) => sum + score, 0);
  let roll = rng() * total;
  for (let i = 0; i < pool.length; i += 1) {
    roll -= scores[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function pick<T>(arr: readonly T[], rng: RNG) {
  return arr[Math.floor(rng() * arr.length)];
}

function weightedPickFamily(rng: RNG) {
  const total = ELF_SURNAME_FAMILIES.reduce((sum, family) => sum + family.weight, 0);
  let roll = rng() * total;
  for (const family of ELF_SURNAME_FAMILIES) {
    roll -= family.weight;
    if (roll <= 0) return family;
  }
  return ELF_SURNAME_FAMILIES[ELF_SURNAME_FAMILIES.length - 1];
}

function buildSurnameCandidate(rng: RNG) {
  const family = weightedPickFamily(rng);
  const prefix = pick(family.prefixes, rng) ?? "";
  const root = pick(family.roots, rng) ?? "";
  let suffix = pick(family.suffixes, rng) ?? "";
  if (family.compounds?.length && rng() < 0.2) {
    suffix = pick(family.compounds, rng) ?? suffix;
  }
  return `${prefix}${root}${suffix}`;
}

export function generateWeightedElfName(params: WeightedElfNameParams): WeightedElfNameResult {
  void params.parts;
  const rng = createRng(params.seed);
  const state = getBatchState(params.seed);
  const trace: GenerationTrace | undefined = params.trace
    ? { seed: params.seed, applied: [], decisions: [], fallback: [] }
    : undefined;

  const banned = (name: string) => {
    const lower = name.toLowerCase();
    for (const token of GIVEN_BANNED) {
      if (lower.includes(token)) return true;
    }
    return false;
  };

  const maxAttempts = 140;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts += 1;
    const entry = weightedPickByScore(ELF_NAME_ENTRIES, params.weights, rng, state);
    if (!entry) break;
    const given = entry.name;
    if (state.givenNames.has(given)) continue;
    if (banned(given)) continue;

    const pronounce = isPronounceableEN(given);
    if (!pronounce.ok) continue;
    if (hasSoftBigrams(given) && rng() > 0.35) continue;

    const suffixKey = extractSuffix(given);
    if (wouldExceedSuffixShare(state, suffixKey, 0.35)) continue;

    let surname = "";
    if (params.options.surname) {
      let surnameAttempts = 0;
      let valid = false;
      while (surnameAttempts < 40) {
        surnameAttempts += 1;
        const candidate = buildSurnameCandidate(rng);
        if (candidate.length < SURNAME_LENGTH.min || candidate.length > SURNAME_LENGTH.max) continue;
        const pronounceSurname = isPronounceableEN(candidate);
        if (!pronounceSurname.ok) continue;
        if (hasSoftBigrams(candidate) && rng() > 0.35) continue;
        surname = candidate;
        valid = true;
        break;
      }
      if (!valid) continue;
    }

    const fullName = surname ? `${given}${params.separator}${surname}` : given;
    if (state.names.has(fullName)) continue;

    registerGivenName(state, given, suffixKey);
    state.names.add(fullName);

    if (trace) {
      trace.entry = entry;
      trace.entryTags = {
        gender: entry.gender,
        origin: entry.origin,
        era: entry.era,
        context: entry.context,
        form: entry.form,
        style: entry.style,
      };
    }

    return { name: fullName, trace };
  }

  const fallbackEntry = weightedPickByScore(ELF_NAME_ENTRIES, params.weights, rng, state);
  const fallbackName = fallbackEntry?.name ?? "Elin";
  if (trace && fallbackEntry) {
    trace.entry = fallbackEntry;
    trace.entryTags = {
      gender: fallbackEntry.gender,
      origin: fallbackEntry.origin,
      era: fallbackEntry.era,
      context: fallbackEntry.context,
      form: fallbackEntry.form,
      style: fallbackEntry.style,
    };
  }
  return { name: fallbackName, trace };
}
