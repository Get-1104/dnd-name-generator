import { matchLength, type LengthOpt } from "./lengthFilter";

type Candidate = string | { name: string };

type BuildResultsOptions = {
  candidates: Candidate[];
  targetCount: number;
  selectedLength: LengthOpt | null;
  prefixK?: number;
  maxRounds?: number;
  maxAttempts?: number;
  familyHardLimitRatio?: number;
  familySoftLimitRatio?: number;
  similarityRelaxation?: number[];
  families?: string[];
};

type NameMeta = {
  name: string;
  normalized: string;
  prefixKey: string;
  family?: string;
  prefix2: string;
};

const DEFAULT_FAMILIES = ["elin", "eli", "ael", "aer", "ae", "el"] as const;

export function normalizeName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s-]/g, "")
    .replace(/[’']/g, "");
}

export function getPrefixKey(name: string, k = 4) {
  const normalized = normalizeName(name);
  return normalized.slice(0, Math.max(1, k));
}

export function lengthBucket(name: string): LengthOpt {
  if (matchLength(name, "short")) return "short";
  if (matchLength(name, "medium")) return "medium";
  return "long";
}

function getCandidateName(candidate: Candidate) {
  return typeof candidate === "string" ? candidate : candidate.name;
}

export function buildResultsWithQualityGate(options: BuildResultsOptions) {
  const {
    candidates,
    targetCount,
    selectedLength,
    prefixK = 4,
    maxRounds = 120,
    maxAttempts = 500,
    familyHardLimitRatio = 0.12,
    familySoftLimitRatio = 0.09,
    similarityRelaxation = [0, 1, 2],
    families = [...DEFAULT_FAMILIES],
  } = options;

  const results: string[] = [];
  const metas: NameMeta[] = [];
  const seen = new Set<string>();
  const prefixSeen = new Set<string>();
  const familyCounts = new Map<string, number>();
  const familyMax = Math.max(1, Math.floor(targetCount * familyHardLimitRatio));
  const familySoft = Math.max(1, Math.floor(targetCount * familySoftLimitRatio));

  let pass = 0;
  let relaxIndex = 0;
  const maxRelaxIndex = similarityRelaxation.length - 1;
  let attempts = 0;

  while (results.length < targetCount && pass < maxRounds) {
    if (attempts >= maxAttempts) break;
    const relax = similarityRelaxation[Math.min(relaxIndex, maxRelaxIndex)];
    let addedThisPass = 0;

    for (const candidate of candidates) {
      if (attempts >= maxAttempts) break;
      attempts += 1;
      if (results.length >= targetCount) break;
      const name = getCandidateName(candidate);
      if (!name) continue;
      const normalized = normalizeName(name);
      if (!normalized) continue;
      if (seen.has(normalized)) continue;

      if (selectedLength && lengthBucket(name) !== selectedLength) continue;

      const family = getFamily(normalized, families);
      if (family) {
        const current = familyCounts.get(family) ?? 0;
        if (current >= familyMax) continue;
        if (!shouldAllowFamily(normalized, current, familySoft, familyMax)) continue;
      }

      const prefix2 = normalized.slice(0, 2);
      if (isNearDuplicate(metas, prefix2, normalized, relax)) continue;

      const prefixKey = normalized.slice(0, Math.max(1, prefixK));
      if (prefixSeen.has(prefixKey)) continue;

      seen.add(normalized);
      prefixSeen.add(prefixKey);
      if (family) {
        familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
      }
      metas.push({ name, normalized, prefixKey, family, prefix2 });
      results.push(name);
      addedThisPass += 1;
    }

    if (results.length >= targetCount) break;
    if (!selectedLength) break;
    if (addedThisPass === 0 && relaxIndex >= maxRelaxIndex) break;
    if (relaxIndex < maxRelaxIndex) {
      relaxIndex += 1;
    } else {
      break;
    }
    pass += 1;
  }

  return results;
}

function getFamily(normalized: string, families: string[]) {
  const ordered = [...families].sort((a, b) => b.length - a.length);
  for (const family of ordered) {
    if (normalized.startsWith(family)) return family;
  }
  return undefined;
}

function isNearDuplicate(metas: NameMeta[], prefix2: string, normalized: string, relax: number) {
  for (const meta of metas) {
    if (meta.prefix2 !== prefix2) continue;
    const maxDistance = getMaxDistance(normalized.length, relax);
    if (maxDistance <= 0) continue;
    if (levenshteinWithin(normalized, meta.normalized, maxDistance)) return true;
  }
  return false;
}

function getMaxDistance(length: number, relax: number) {
  if (length <= 4) return 0;
  if (length <= 6) return 1 + relax;
  if (length <= 8) return 2 + relax;
  return 3 + relax;
}

function levenshteinWithin(a: string, b: string, maxDistance: number) {
  const lenA = a.length;
  const lenB = b.length;
  if (Math.abs(lenA - lenB) > maxDistance) return false;
  if (a === b) return true;

  const prev = new Array(lenB + 1);
  const curr = new Array(lenB + 1);
  for (let j = 0; j <= lenB; j += 1) prev[j] = j;

  for (let i = 1; i <= lenA; i += 1) {
    curr[0] = i;
    let minInRow = curr[0];
    const aChar = a.charAt(i - 1);
    for (let j = 1; j <= lenB; j += 1) {
      const cost = aChar === b.charAt(j - 1) ? 0 : 1;
      const next = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr[j] = next;
      if (next < minInRow) minInRow = next;
    }
    if (minInRow > maxDistance) return false;
    for (let j = 0; j <= lenB; j += 1) prev[j] = curr[j];
  }
  return prev[lenB] <= maxDistance;
}

function shouldAllowFamily(normalized: string, current: number, softLimit: number, hardLimit: number) {
  if (current < softLimit) return true;
  if (current >= hardLimit) return false;

  const span = Math.max(1, hardLimit - softLimit + 1);
  const pressure = (current - softLimit + 1) / span;
  const rejectionChance = Math.min(0.85, 0.35 + pressure * 0.6);
  const hash = normalized.split("").reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 997, 0);
  const roll = hash / 997;
  return roll >= rejectionChance;
}
