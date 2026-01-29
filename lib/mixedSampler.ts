import type { ElfCulturalContext, ElfCulturalOrigin, ElfNameForm, ElfStyle } from "./elfOptions";
import type { NameEntry } from "./elfNameEntries";
import { matchLength, type LengthOpt } from "./lengthFilter";

type EraOpt = "ancient" | "contemporary" | "revival";

type MixedSelections = {
  nation?: string | null;
  culturalOrigin?: ElfCulturalOrigin | null;
  era?: EraOpt | null;
  gender?: "masculine" | "feminine" | "neutral" | null;
  culturalContext?: ElfCulturalContext | null;
  nameForm?: ElfNameForm | null;
  style?: ElfStyle | null;
};

type CategoryKey = "nation" | "origin" | "era" | "gender" | "context" | "form" | "style";

type MixedPlan = Array<{ key: CategoryKey; quota: number }>;

const MIX_PLAN: MixedPlan = [
  { key: "nation", quota: 3 },
  { key: "origin", quota: 2 },
  { key: "era", quota: 1 },
  { key: "gender", quota: 1 },
  { key: "context", quota: 1 },
  { key: "form", quota: 1 },
  { key: "style", quota: 1 },
];

const NATION_ENTRY_MAP: Record<string, { origins: NameEntry["origin"][]; eras: NameEntry["era"][] }> = {
  "ancient-high-kingdom": { origins: ["high"], eras: ["ancient"] },
  "forest-realm": { origins: ["wood"], eras: ["ancient", "revival"] },
  "coastal-elven-state": { origins: ["high"], eras: ["revival"] },
  "isolated-mountain-enclave": { origins: ["high"], eras: ["revival"] },
  "fallen-empire": { origins: ["drow"], eras: ["ancient", "revival"] },
};

function matchesNation(entry: NameEntry, nation: string | null | undefined) {
  if (!nation) return true;
  if (entry.nation) return entry.nation === nation;
  const mapping = NATION_ENTRY_MAP[nation];
  if (!mapping) return false;
  return mapping.origins.includes(entry.origin) && mapping.eras.includes(entry.era);
}

function mapOrigin(value: ElfCulturalOrigin | null | undefined): NameEntry["origin"] | null {
  if (!value) return null;
  if (value === "wood-elf") return "wood";
  if (value === "drow") return "drow";
  return "high";
}

function mapEra(value: EraOpt | null | undefined): NameEntry["era"] | null {
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

function buildPlan(target: number) {
  const plan: CategoryKey[] = [];
  let remaining = target;
  while (remaining > 0) {
    for (const entry of MIX_PLAN) {
      const take = Math.min(entry.quota, remaining);
      for (let i = 0; i < take; i += 1) {
        plan.push(entry.key);
      }
      remaining -= take;
      if (remaining <= 0) break;
    }
  }
  return plan;
}

function weightedPick(entries: NameEntry[]) {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return entries[entries.length - 1];
}

function hasSoftSelections(selections: MixedSelections) {
  return Boolean(
    selections.culturalOrigin ||
      selections.era ||
      selections.gender ||
      selections.culturalContext ||
      selections.nameForm ||
      selections.style
  );
}

function getMatchScore(entry: NameEntry, selections: MixedSelections) {
  let score = 0;
  if (selections.culturalOrigin) {
    const origin = mapOrigin(selections.culturalOrigin);
    if (origin && entry.origin === origin) score += 1;
  }
  if (selections.era) {
    const era = mapEra(selections.era);
    if (era && entry.era === era) score += 1;
  }
  if (selections.gender && entry.gender === selections.gender) score += 1;
  if (selections.culturalContext && entry.context === selections.culturalContext) score += 1;
  if (selections.nameForm) {
    const form = mapForm(selections.nameForm);
    if (form && entry.form === form) score += 1;
  }
  if (selections.style && entry.style === selections.style) score += 1;
  return score;
}

function weightedPickByScore(entries: NameEntry[], selections: MixedSelections) {
  const scores = entries.map((entry) => {
    const matchScore = getMatchScore(entry, selections);
    return entry.weight * (1 + matchScore);
  });
  const total = scores.reduce((sum, score) => sum + score, 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (let i = 0; i < entries.length; i += 1) {
    roll -= scores[i];
    if (roll <= 0) return entries[i];
  }
  return entries[entries.length - 1];
}

function pickUniqueFromPool(
  pool: NameEntry[],
  seen: Set<string>,
  localSeen: Set<string>,
  maxAttempts: number
) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    attempts += 1;
    const entry = weightedPick(pool);
    if (!entry) return null;
    if (seen.has(entry.name)) continue;
    if (localSeen.has(entry.name)) continue;
    return entry;
  }
  return null;
}

function buildRequiredPool(entries: NameEntry[], selections: MixedSelections) {
  let pool = entries;
  const nation = selections.nation ?? null;
  if (nation) {
    pool = pool.filter((entry) => matchesNation(entry, nation));
    if (!pool.length) return [];
  }
  return pool;
}

function buildRelaxedSelections(selections: MixedSelections, tier: number): MixedSelections {
  if (tier <= 0) return selections;
  if (tier === 1) return { ...selections, style: null };
  if (tier === 2) return { ...selections, style: null, nameForm: null };
  if (tier === 3) return { ...selections, style: null, nameForm: null, culturalContext: null };
  return { ...selections, style: null, nameForm: null, culturalContext: null, gender: null, era: null };
}

function generateMixedBatch(
  entries: NameEntry[],
  selections: MixedSelections,
  target: number,
  seen: Set<string>
) {
  const requiredPool = buildRequiredPool(entries, selections);
  if (!requiredPool.length) return [];
  const softSelected = hasSoftSelections(selections);
  const pool = softSelected
    ? requiredPool.filter((entry) => getMatchScore(entry, selections) > 0)
    : requiredPool;
  if (!pool.length) return [];

  const batch: NameEntry[] = [];
  const localSeen = new Set<string>();
  const maxAttempts = Math.max(12, pool.length * 3);
  let attempts = 0;

  while (batch.length < target && attempts < maxAttempts) {
    attempts += 1;
    const pick = weightedPickByScore(pool, selections);
    if (!pick) break;
    if (seen.has(pick.name)) continue;
    if (localSeen.has(pick.name)) continue;
    batch.push(pick);
    localSeen.add(pick.name);
  }

  if (batch.length < target) {
    const fallbackPool = pool;
    while (batch.length < target) {
      const pick = pickUniqueFromPool(fallbackPool, seen, localSeen, Math.max(10, fallbackPool.length * 2));
      if (!pick) break;
      batch.push(pick);
      localSeen.add(pick.name);
    }
  }

  return batch;
}

export function generateMixedResultsWithLength(
  entries: NameEntry[],
  selections: MixedSelections,
  target: number,
  lengthOpt: LengthOpt | null,
  options?: {
    batchSize?: number;
    maxAttempts?: number;
    makeName?: (entry: NameEntry) => string;
  }
) {
  const results: string[] = [];
  const seen = new Set<string>();
  const batchSize = Math.max(4, options?.batchSize ?? target);
  const maxAttempts = Math.max(6, options?.maxAttempts ?? target * 6);
  let attempts = 0;
  let tier = 0;
  const maxTier = 4;

  while (results.length < target && attempts < maxAttempts) {
    attempts += 1;
    const relaxedSelections = buildRelaxedSelections(selections, tier);
    const batch = generateMixedBatch(entries, relaxedSelections, batchSize, seen);
    if (!batch.length) continue;
    for (const entry of batch) {
      if (results.length >= target) break;
      const name = options?.makeName ? options.makeName(entry) : entry.name;
      if (!name) continue;
      if (!matchLength(name, lengthOpt)) continue;
      if (seen.has(name)) continue;
      seen.add(name);
      results.push(name);
    }

    if (results.length < target && tier < maxTier) {
      tier += 1;
    }
  }

  return { results, isPartial: results.length < target };
}
