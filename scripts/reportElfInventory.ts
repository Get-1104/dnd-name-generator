/**
 * 结论（report:elf 数据源）:
 * - report:elf 读取的 entries 来自本文件默认 input: lib/nameEntries/elf.generated.json（可用 --in 覆盖），并直接 JSON.parse。
 * - 本文件未导入 ELF_NAME_ENTRIES；仅从 lib/weightedNameGenerator 读取 NATION_OPTIONS 用于输出顺序。
 * - elf.generated.json 的来源：scripts/dumpElfEntries.ts 将 lib/elfNameEntries.ts 的 ELF_NAME_ENTRIES 写入该 JSON。
 * - report:elf 运行链路中未发现 entries 的 merge/concat 或从 pools 动态合并。
 */
import fs from "node:fs";
import path from "node:path";
import { elfCulturalOriginOptions } from "../lib/elfOptions";
import { matchLength } from "../lib/lengthFilter";
import { NATION_OPTIONS } from "../lib/weightedNameGenerator";

type ReportEntry = {
  name: string;
  tags?: {
    nation?: string;
    culturalOrigin?: string;
    origin?: string;
  };
  nation?: string;
  culturalOrigin?: string;
  origin?: string;
  era?: "ancient" | "revival";
};

type LengthBucket = "short" | "medium" | "long";
type FamilyKey = "elin" | "eli" | "ael" | "aer" | "ae" | "el";

function parseArgs(argv: string[]) {
  const map = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) continue;
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) continue;
    map.set(key, value);
    i += 1;
  }
  return {
    input: map.get("--in") ?? "lib/nameEntries/elf.generated.json",
  };
}

function bucketLength(name: string): LengthBucket {
  if (matchLength(name, "short")) return "short";
  if (matchLength(name, "medium")) return "medium";
  return "long";
}

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s-]/g, "")
    .replace(/[’']/g, "");
}

const FAMILY_LIST: FamilyKey[] = ["elin", "eli", "ael", "aer", "ae", "el"];

const NATION_ENTRY_MAP: Record<string, { origins: Array<"high" | "wood" | "drow">; eras: Array<"ancient" | "revival"> }> = {
  "ancient-high-kingdom": { origins: ["high"], eras: ["ancient"] },
  "forest-realm": { origins: ["wood"], eras: ["ancient", "revival"] },
  "coastal-elven-state": { origins: ["high"], eras: ["revival"] },
  "isolated-mountain-enclave": { origins: ["high"], eras: ["revival"] },
  "fallen-empire": { origins: ["drow"], eras: ["ancient", "revival"] },
};

const NATION_ORDER = [
  "ancient-high-kingdom",
  "forest-realm",
  "coastal-elven-state",
  "isolated-mountain-enclave",
  "fallen-empire",
];

function inferNation(origin: string | undefined, era: string | undefined, name: string) {
  if (!origin || !era) return undefined;
  if (origin === "high" && era === "revival") {
    const normalized = normalizeName(name);
    if (/mar|lio|na|sea|tis/.test(normalized)) return "coastal-elven-state";
    if (/kor|dr|bar|gr|br/.test(normalized)) return "isolated-mountain-enclave";
    return "coastal-elven-state";
  }
  for (const key of NATION_ORDER) {
    const mapping = NATION_ENTRY_MAP[key];
    if (mapping.origins.includes(origin as "high" | "wood" | "drow") && mapping.eras.includes(era as "ancient" | "revival")) {
      return key;
    }
  }
  return undefined;
}

function inferCulturalOrigin(origin: string | undefined, era?: string | undefined) {
  if (!origin) return undefined;
  if (origin === "wood") return "wood-elf";
  if (origin === "drow") return "drow";
  if (era === "ancient") return "ancient-highborn";
  return "high-elf";
}

function getFamily(normalized: string): FamilyKey | null {
  const ordered = [...FAMILY_LIST].sort((a, b) => b.length - a.length);
  for (const family of ordered) {
    if (normalized.startsWith(family)) return family;
  }
  return null;
}

function bump(map: Map<string, number>, key: string | undefined) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}

function bumpToken(map: Map<string, number>, token: string) {
  if (!token) return;
  map.set(token, (map.get(token) ?? 0) + 1);
}

function getTopTokens(map: Map<string, number>, total: number, top = 20) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([token, count]) => ({ token, count, pct: total > 0 ? (count / total) * 100 : 0 }));
}

const args = parseArgs(process.argv.slice(2));
const inputPath = path.resolve(args.input);

if (!fs.existsSync(inputPath)) {
  throw new Error(`Input file not found: ${inputPath}`);
}

const raw = fs.readFileSync(inputPath, "utf-8");
const entries = JSON.parse(raw) as ReportEntry[];

const nationCounts = new Map<string, number>();
const originCounts = new Map<string, number>();
const lengthCounts = new Map<LengthBucket, number>([
  ["short", 0],
  ["medium", 0],
  ["long", 0],
]);

const prefix2Counts = new Map<string, number>();
const prefix3Counts = new Map<string, number>();
const prefix4Counts = new Map<string, number>();
const bigramCounts = new Map<string, number>();
const trigramCounts = new Map<string, number>();
const familyCounts = new Map<FamilyKey, number>();

for (const entry of entries) {
  const nationTag =
    entry.tags?.nation ?? entry.nation ?? inferNation(entry.tags?.origin ?? entry.origin, entry.era, entry.name);
  const originTag =
    entry.tags?.culturalOrigin ??
    entry.culturalOrigin ??
    inferCulturalOrigin(entry.tags?.origin ?? entry.origin, entry.era) ??
    entry.tags?.origin ??
    entry.origin;
  bump(nationCounts, nationTag);
  bump(originCounts, originTag);
  const bucket = bucketLength(entry.name);
  lengthCounts.set(bucket, (lengthCounts.get(bucket) ?? 0) + 1);

  const normalized = normalizeName(entry.name);
  if (normalized.length >= 2) bumpToken(prefix2Counts, normalized.slice(0, 2));
  if (normalized.length >= 3) bumpToken(prefix3Counts, normalized.slice(0, 3));
  if (normalized.length >= 4) bumpToken(prefix4Counts, normalized.slice(0, 4));

  const family = getFamily(normalized);
  if (family) {
    familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
  }

  for (let i = 0; i < normalized.length - 1; i += 1) {
    bumpToken(bigramCounts, normalized.slice(i, i + 2));
  }
  for (let i = 0; i < normalized.length - 2; i += 1) {
    bumpToken(trigramCounts, normalized.slice(i, i + 3));
  }
}

console.log("\nElf inventory report");
console.log(`Total entries: ${entries.length}`);
console.log("\nBy nation/realm:");
for (const nation of NATION_OPTIONS.map((opt) => opt.value)) {
  const value = nationCounts.get(nation) ?? 0;
  console.log(`  ${nation}: ${value}`);
}
console.log("\nBy cultural origin:");
for (const origin of elfCulturalOriginOptions.map((opt) => opt.value)) {
  const value = originCounts.get(origin) ?? 0;
  console.log(`  ${origin}: ${value}`);
}
console.log("\nLength distribution:");
console.log(`  short: ${lengthCounts.get("short") ?? 0}`);
console.log(`  medium: ${lengthCounts.get("medium") ?? 0}`);
console.log(`  long: ${lengthCounts.get("long") ?? 0}`);

console.log("\nPrefix family distribution:");
for (const family of FAMILY_LIST) {
  const count = familyCounts.get(family) ?? 0;
  const pct = entries.length > 0 ? (count / entries.length) * 100 : 0;
  console.log(`  ${family}: ${count}  ${pct.toFixed(2)}%`);
}
const aeGroup = (familyCounts.get("ael") ?? 0) + (familyCounts.get("aer") ?? 0) + (familyCounts.get("ae") ?? 0);
const aeGroupPct = entries.length > 0 ? (aeGroup / entries.length) * 100 : 0;
console.log(`  ae-group(ael+aer+ae): ${aeGroup}  ${aeGroupPct.toFixed(2)}%`);

const topPrefix2 = getTopTokens(prefix2Counts, entries.length);
const topPrefix3 = getTopTokens(prefix3Counts, entries.length);
const topPrefix4 = getTopTokens(prefix4Counts, entries.length);
const totalBigrams = [...bigramCounts.values()].reduce((sum, count) => sum + count, 0);
const totalTrigrams = [...trigramCounts.values()].reduce((sum, count) => sum + count, 0);
const topBigrams = getTopTokens(bigramCounts, totalBigrams);
const topTrigrams = getTopTokens(trigramCounts, totalTrigrams);

console.log("\nPrefix top20 (2):");
for (const item of topPrefix2) {
  console.log(`  ${item.token}  ${item.count}  ${item.pct.toFixed(2)}%`);
}

console.log("\nPrefix top20 (3):");
for (const item of topPrefix3) {
  console.log(`  ${item.token}  ${item.count}  ${item.pct.toFixed(2)}%`);
}

console.log("\nPrefix top20 (4):");
for (const item of topPrefix4) {
  console.log(`  ${item.token}  ${item.count}  ${item.pct.toFixed(2)}%`);
}

console.log("\nBigram top20:");
for (const item of topBigrams) {
  console.log(`  ${item.token}  ${item.count}  ${item.pct.toFixed(2)}%`);
}

console.log("\nTrigram top20:");
for (const item of topTrigrams) {
  console.log(`  ${item.token}  ${item.count}  ${item.pct.toFixed(2)}%`);
}

const SIM_RUNS = 1000;
const SIM_TARGET = 50;
const SIM_FAMILY_HARD_RATIO = 0.12;
const SIM_FAMILY_SOFT_RATIO = 0.09;
const SIM_PREFIX_K = 4;
const SIM_RELAX = 0;

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

function sampleCandidates(names: string[], size: number) {
  const pool = names.slice();
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size);
}

function buildSimulatedResults(candidates: string[]) {
  const results: string[] = [];
  const seen = new Set<string>();
  const prefixSeen = new Set<string>();
  const familyCounts = new Map<FamilyKey, number>();
  const familyMax = Math.max(1, Math.floor(SIM_TARGET * SIM_FAMILY_HARD_RATIO));
  const familySoft = Math.max(1, Math.floor(SIM_TARGET * SIM_FAMILY_SOFT_RATIO));
  const metas: Array<{ prefix2: string; normalized: string }> = [];

  for (const candidate of candidates) {
    if (results.length >= SIM_TARGET) break;
    const normalized = normalizeName(candidate);
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    const prefixKey = normalized.slice(0, Math.max(1, SIM_PREFIX_K));
    if (prefixSeen.has(prefixKey)) continue;

    const family = getFamily(normalized);
    if (family) {
      const current = familyCounts.get(family) ?? 0;
      if (current >= familyMax) continue;
      if (!shouldAllowFamily(normalized, current, familySoft, familyMax)) continue;
    }

    const prefix2 = normalized.slice(0, 2);
    let tooSimilar = false;
    for (const meta of metas) {
      if (meta.prefix2 !== prefix2) continue;
      const maxDistance = getMaxDistance(normalized.length, SIM_RELAX);
      if (maxDistance > 0 && levenshteinWithin(normalized, meta.normalized, maxDistance)) {
        tooSimilar = true;
        break;
      }
    }
    if (tooSimilar) continue;

    seen.add(normalized);
    prefixSeen.add(prefixKey);
    if (family) {
      familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
    }
    metas.push({ prefix2, normalized });
    results.push(candidate);
  }

  return results;
}

const names = entries.map((entry) => entry.name);
const maxFamilyRatios: number[] = [];

for (let i = 0; i < SIM_RUNS; i += 1) {
  const candidates = sampleCandidates(names, Math.min(names.length, SIM_TARGET * 6));
  const results = buildSimulatedResults(candidates);
  const counts = new Map<FamilyKey, number>();
  for (const name of results) {
    const family = getFamily(normalizeName(name));
    if (family) counts.set(family, (counts.get(family) ?? 0) + 1);
  }
  const maxCount = Math.max(0, ...counts.values());
  const ratio = results.length > 0 ? maxCount / results.length : 0;
  maxFamilyRatios.push(ratio);
}

maxFamilyRatios.sort((a, b) => a - b);
const meanRatio =
  maxFamilyRatios.reduce((sum, value) => sum + value, 0) / Math.max(1, maxFamilyRatios.length);
const p95Index = Math.floor(maxFamilyRatios.length * 0.95);
const p95Ratio = maxFamilyRatios[p95Index] ?? 0;

console.log("\nSimulation (1000 runs, N=50):");
console.log(`  max family share mean: ${(meanRatio * 100).toFixed(2)}%`);
console.log(`  max family share p95: ${(p95Ratio * 100).toFixed(2)}%`);
