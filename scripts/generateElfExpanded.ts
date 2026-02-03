import fs from "node:fs";
import path from "node:path";
import { defaultElfOptions, elfCulturalOriginOptions } from "../lib/elfOptions";
import type { ElfCulturalOrigin } from "../lib/elfOptions";
import { matchLength, type LengthOpt } from "../lib/lengthFilter";
import type { NameEntry } from "../lib/elfNameEntries";
import { NATION_OPTIONS, generateWeightedElfName } from "../lib/weightedNameGenerator";

type OutputEntry = {
  name: string;
  tags: {
    nation?: string;
    culturalOrigin?: ElfCulturalOrigin;
    era?: NameEntry["era"];
    gender?: NameEntry["gender"];
    context?: NameEntry["context"];
    form?: NameEntry["form"];
    style?: NameEntry["style"];
  };
};

type ComboKey = `${string}::${ElfCulturalOrigin}`;

type Stats = {
  total: number;
  duplicates: number;
  failures: number;
};

const NATION_ENTRY_MAP: Record<string, { origins: NameEntry["culturalOrigin"][]; eras: NameEntry["era"][] }> = {
  "ancient-high-kingdom": { origins: ["ancient-highborn"], eras: ["ancient"] },
  "forest-realm": { origins: ["wood-elf"], eras: ["ancient", "revival"] },
  "coastal-elven-state": { origins: ["high-elf"], eras: ["revival"] },
  "isolated-mountain-enclave": { origins: ["high-elf"], eras: ["revival"] },
  "fallen-empire": { origins: ["drow"], eras: ["ancient"] },
};

const ORIGIN_ERA_PREF: Record<ElfCulturalOrigin, NameEntry["era"]> = {
  "ancient-highborn": "ancient",
  "high-elf": "revival",
  "wood-elf": "revival",
  drow: "ancient",
};

function mapOrigin(value: ElfCulturalOrigin | null | undefined): NameEntry["culturalOrigin"] | null {
  if (!value) return null;
  if (value === "wood-elf") return "wood-elf";
  if (value === "drow") return "drow";
  if (value === "ancient-highborn") return "ancient-highborn";
  return "high-elf";
}

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[\s-]/g, "");
}

function bucketLength(name: string): LengthOpt {
  if (matchLength(name, "short")) return "short";
  if (matchLength(name, "medium")) return "medium";
  return "long";
}

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
    targetOrigin: Number(map.get("--targetOrigin") ?? 1500),
    targetNation: Number(map.get("--targetNation") ?? 1000),
    maxTotal: Number(map.get("--maxTotal") ?? 20000),
    seed: map.get("--seed") ?? "expand",
    out: map.get("--out") ?? "lib/nameEntries/elf.generated.json",
  };
}

function initCountMap<T extends string>(keys: T[]) {
  return new Map<T, number>(keys.map((key) => [key, 0]));
}

function isCompatible(nation: string, origin: ElfCulturalOrigin) {
  const mapping = NATION_ENTRY_MAP[nation];
  if (!mapping) return false;
  const mapped = mapOrigin(origin);
  if (!mapped) return false;
  const eraPref = ORIGIN_ERA_PREF[origin];
  return mapping.origins.includes(mapped) && mapping.eras.includes(eraPref);
}

function buildCombos(nations: string[], origins: ElfCulturalOrigin[]) {
  const combos: Array<{ nation: string; culturalOrigin: ElfCulturalOrigin; key: ComboKey }> = [];
  for (const nation of nations) {
    for (const origin of origins) {
      if (!isCompatible(nation, origin)) continue;
      combos.push({ nation, culturalOrigin: origin, key: `${nation}::${origin}` });
    }
  }
  return combos;
}

function shouldUseCombo(
  nation: string,
  origin: ElfCulturalOrigin,
  countsNation: Map<string, number>,
  countsOrigin: Map<ElfCulturalOrigin, number>,
  targetNation: number,
  targetOrigin: number
) {
  const nationDone = (countsNation.get(nation) ?? 0) >= targetNation;
  const originDone = (countsOrigin.get(origin) ?? 0) >= targetOrigin;
  return !(nationDone && originDone);
}

function writeJson(filePath: string, data: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function logCounts(title: string, counts: Map<string, number>) {
  console.log(title);
  for (const [key, value] of counts.entries()) {
    console.log(`  ${key}: ${value}`);
  }
}

const args = parseArgs(process.argv.slice(2));

if (!Number.isFinite(args.targetOrigin) || args.targetOrigin <= 0) {
  throw new Error("--targetOrigin must be a positive number");
}
if (!Number.isFinite(args.targetNation) || args.targetNation <= 0) {
  throw new Error("--targetNation must be a positive number");
}
if (!Number.isFinite(args.maxTotal) || args.maxTotal <= 0) {
  throw new Error("--maxTotal must be a positive number");
}

const nations = NATION_OPTIONS.map((opt) => opt.value);
const culturalOrigins = elfCulturalOriginOptions.map((opt) => opt.value);

const combos = buildCombos(nations, culturalOrigins);
const countsNation = initCountMap(nations);
const countsOrigin = initCountMap(culturalOrigins);
const lengthCounts = new Map<LengthOpt, number>([
  ["short", 0],
  ["medium", 0],
  ["long", 0],
]);
const comboAttempts = new Map<ComboKey, number>();
const results: OutputEntry[] = [];
const seen = new Set<string>();
const stats: Stats = { total: 0, duplicates: 0, failures: 0 };

const maxAttemptsPerCombo = Math.max(200000, args.targetNation * 200);
let pass = 0;

while (stats.total < args.maxTotal) {
  pass += 1;
  let progressThisPass = 0;

  for (const combo of combos) {
    if (stats.total >= args.maxTotal) break;
    if (!shouldUseCombo(combo.nation, combo.culturalOrigin, countsNation, countsOrigin, args.targetNation, args.targetOrigin)) {
      continue;
    }

    const attempts = comboAttempts.get(combo.key) ?? 0;
    if (attempts >= maxAttemptsPerCombo) {
      continue;
    }

    comboAttempts.set(combo.key, attempts + 1);

    const seed = `${args.seed}-${combo.key}-${attempts}`;
    const result = generateWeightedElfName({
      parts: { first: [], second: [], lastA: [], lastB: [] },
      options: { ...defaultElfOptions, surname: false },
      separator: " ",
      seed,
      trace: true,
      weights: {
        race: "elf",
        nation: combo.nation,
        culturalOrigin: combo.culturalOrigin,
        era: ORIGIN_ERA_PREF[combo.culturalOrigin],
        gender: null,
        culturalContext: null,
        nameForm: null,
        style: null,
        length: null,
      },
    });

    if (!result.name) {
      stats.failures += 1;
      continue;
    }

    const normalized = normalizeName(result.name);
    if (seen.has(normalized)) {
      stats.duplicates += 1;
      continue;
    }

    seen.add(normalized);
    stats.total += 1;
    progressThisPass += 1;

    const entry: OutputEntry = {
      name: result.name,
      tags: {
        nation: combo.nation,
        culturalOrigin: combo.culturalOrigin,
        era: result.trace?.entryTags?.era,
        gender: result.trace?.entryTags?.gender,
        context: result.trace?.entryTags?.context,
        form: result.trace?.entryTags?.form,
        style: result.trace?.entryTags?.style,
      },
    };

    results.push(entry);

    countsNation.set(combo.nation, (countsNation.get(combo.nation) ?? 0) + 1);
    countsOrigin.set(combo.culturalOrigin, (countsOrigin.get(combo.culturalOrigin) ?? 0) + 1);
    const lengthBucket = bucketLength(result.name);
    lengthCounts.set(lengthBucket, (lengthCounts.get(lengthBucket) ?? 0) + 1);
  }

  const targetsMet =
    nations.every((nation) => (countsNation.get(nation) ?? 0) >= args.targetNation) &&
    culturalOrigins.every((origin) => (countsOrigin.get(origin) ?? 0) >= args.targetOrigin);

  if (targetsMet) break;
  if (progressThisPass === 0) break;
}

writeJson(args.out, results);

console.log("\nElf expansion complete.");
console.log(`Total generated: ${stats.total}`);
console.log(`Duplicates skipped: ${stats.duplicates}`);
console.log(`Failures: ${stats.failures}`);
console.log("");
logCounts("Origin counts:", new Map([...countsOrigin.entries()]));
logCounts("Nation counts:", new Map([...countsNation.entries()]));
console.log("");
console.log("Length distribution:");
console.log(`  short: ${lengthCounts.get("short") ?? 0}`);
console.log(`  medium: ${lengthCounts.get("medium") ?? 0}`);
console.log(`  long: ${lengthCounts.get("long") ?? 0}`);
console.log(`\nOutput written to ${args.out}`);
