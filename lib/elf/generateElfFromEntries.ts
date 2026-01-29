import type { ElfCulturalOrigin, ElfNameForm } from "../elfOptions";
import type { ElfWeightedInputs, GenerationTrace } from "../weightedNameGenerator";
import type { NameEntry } from "../elfNameEntries";

type RNG = () => number;
type LengthKey = "short" | "medium" | "long";

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

function mapForm(value: ElfNameForm | null | undefined): NameEntry["form"] | null {
  if (!value) return null;
  if (value === "short") return "everyday";
  if (value === "full") return "formal";
  return "outsider";
}

function mapEra(value: ElfWeightedInputs["era"] | null | undefined): NameEntry["era"] | null {
  if (!value) return null;
  if (value === "ancient") return "ancient";
  if (value === "revival") return "revival";
  return "revival";
}

const NATION_ENTRY_MAP: Record<string, { origins: NameEntry["origin"][]; eras: NameEntry["era"][] }> = {
  "ancient-high-kingdom": { origins: ["high"], eras: ["ancient"] },
  "forest-realm": { origins: ["wood"], eras: ["ancient", "revival"] },
  "coastal-elven-state": { origins: ["high"], eras: ["revival"] },
  "isolated-mountain-enclave": { origins: ["high"], eras: ["revival"] },
  "fallen-empire": { origins: ["drow"], eras: ["ancient", "revival"] },
};

function matchesLength(name: string, length: LengthKey) {
  const n = name.length;
  if (length === "short") return n >= 4 && n <= 6;
  if (length === "medium") return n >= 6 && n <= 8;
  return n >= 8 && n <= 11;
}

function matchesNation(entry: NameEntry, nation: string | null | undefined) {
  if (!nation) return true;
  if (entry.nation) return entry.nation === nation;
  const mapping = NATION_ENTRY_MAP[nation];
  if (!mapping) return false;
  return mapping.origins.includes(entry.origin) && mapping.eras.includes(entry.era);
}

function hasSoftSelections(weights: ElfWeightedInputs) {
  return Boolean(
    weights.culturalOrigin ||
      weights.era ||
      weights.gender ||
      weights.culturalContext ||
      weights.nameForm ||
      weights.style
  );
}

function getMatchScore(entry: NameEntry, weights: ElfWeightedInputs) {
  let score = 0;
  if (weights.culturalOrigin) {
    const origin = mapOrigin(weights.culturalOrigin);
    if (origin && entry.origin === origin) score += 1;
  }
  if (weights.era) {
    const era = mapEra(weights.era);
    if (era && entry.era === era) score += 1;
  }
  if (weights.gender && entry.gender === weights.gender) score += 1;
  if (weights.culturalContext && entry.context === weights.culturalContext) score += 1;
  if (weights.nameForm) {
    const form = mapForm(weights.nameForm);
    if (form && entry.form === form) score += 1;
  }
  if (weights.style && entry.style === weights.style) score += 1;
  return score;
}

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scoreEntry(entry: NameEntry, weights: ElfWeightedInputs) {
  let w = entry.weight;
  if (weights.nation && !matchesNation(entry, weights.nation)) return 0;
  const matchScore = getMatchScore(entry, weights);
  if (hasSoftSelections(weights) && matchScore === 0) return 0;
  w *= 1 + matchScore;
  return clamp(0.05, w, 9999);
}

function weightedPickByScore(entries: NameEntry[], weights: ElfWeightedInputs, rng: RNG) {
  const scores = entries.map((entry) => scoreEntry(entry, weights));
  const total = scores.reduce((sum, score) => sum + score, 0);
  if (total <= 0) return null;
  let roll = rng() * total;
  for (let i = 0; i < entries.length; i += 1) {
    roll -= scores[i];
    if (roll <= 0) return entries[i];
  }
  return entries[entries.length - 1];
}

export function generateElfFromEntries(params: {
  entries: NameEntry[];
  weights: ElfWeightedInputs;
  count: number;
  seed?: string | number;
  includeSurname: boolean;
}): { name: string[]; trace?: GenerationTrace } {
  const rng = createRng(params.seed);
  void params.includeSurname;
  const trace: GenerationTrace | undefined = {
    seed: params.seed,
    applied: [],
    decisions: [],
    fallback: [],
  };

  const results: string[] = [];
  const used = new Set<string>();
  const maxAttempts = Math.max(10, params.count * 10);
  let attempts = 0;

  while (results.length < params.count && attempts < maxAttempts) {
    attempts += 1;
    const entry = weightedPickByScore(params.entries, params.weights, rng);
    if (!entry) break;
    if (params.weights.length && !matchesLength(entry.name, params.weights.length)) continue;
    if (used.has(entry.name)) continue;
    used.add(entry.name);
    results.push(entry.name);
    trace!.entry = entry;
  }

  return { name: results, trace: trace ?? undefined };
}
