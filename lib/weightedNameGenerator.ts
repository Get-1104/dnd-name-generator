import {
  ElfCulturalContext,
  ElfCulturalOrigin,
  ElfLength,
  ElfNameForm,
  ElfOptions,
  ElfStyle,
} from "./elfOptions";
import { ELF_LEXICON, LexiconRule, LexiconStructure } from "./elfLexicon";

export type Parts = {
  first: string[];
  second: string[];
  lastA: string[];
  lastB: string[];
};

export type WeightLevel = "high" | "medium" | "low";

export type WeightModel = {
  race: { level: WeightLevel; priority: number };
  nation: { level: WeightLevel; priority: number };
  culturalOrigin: { level: WeightLevel; priority: number };
  era: { level: WeightLevel; priority: number };
  gender: { level: WeightLevel; priority: number };
  culturalContext: { level: WeightLevel; priority: number };
  nameForm: { level: WeightLevel; priority: number };
  style: { level: WeightLevel; priority: number };
  length: { level: WeightLevel; priority: number };
};

export const WEIGHT_MODEL: WeightModel = {
  race: { level: "high", priority: 100 },
  nation: { level: "high", priority: 90 },
  culturalOrigin: { level: "high", priority: 80 },
  era: { level: "high", priority: 70 },
  gender: { level: "high", priority: 60 },
  culturalContext: { level: "medium", priority: 50 },
  nameForm: { level: "medium", priority: 40 },
  style: { level: "low", priority: 30 },
  length: { level: "low", priority: 20 },
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
  conflicts: string[];
  decisions: string[];
  usedLexicons: string[];
  usedChunks: string[];
  usedEnding?: string;
  fallback?: string[];
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
  forceWeighting?: boolean;
};

export type WeightedElfNameResult = {
  name: string;
  trace?: GenerationTrace;
};

type RNG = () => number;

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

export function createRng(seed?: string | number): RNG {
  if (seed === undefined || seed === null || seed === "") return Math.random;
  return mulberry32(hashSeed(seed));
}

function pick<T>(arr: T[], rng: RNG) {
  return arr[Math.floor(rng() * arr.length)];
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function shouldUseWeightedPath(weights: ElfWeightedInputs, forceWeighting?: boolean) {
  if (forceWeighting) return true;
  return Boolean(
    weights.nation ||
      weights.culturalOrigin ||
      weights.era ||
      weights.gender ||
      weights.culturalContext ||
      weights.nameForm ||
      weights.style ||
      weights.length
  );
}

function collectRule(label: string, rule?: LexiconRule): { label: string; rule: LexiconRule } | null {
  if (!rule) return null;
  return { label, rule };
}

function resolveStructure(
  rules: Array<{ label: string; rule: LexiconRule }>,
  fallback: LexiconStructure[],
  rng: RNG
): LexiconStructure {
  const withStructure = rules.find((entry) => entry.rule.structures && entry.rule.structures.length);
  if (withStructure?.rule.structures?.length) {
    return pick(withStructure.rule.structures, rng);
  }
  return pick(fallback, rng);
}

function buildPools(parts: Parts, rules: Array<{ label: string; rule: LexiconRule }>) {
  const baseChunks = uniq([
    ...parts.first,
    ...parts.second,
    ...parts.lastA,
    ...ELF_LEXICON.base.chunks,
  ]);
  const baseEndings = uniq([...parts.lastB, ...ELF_LEXICON.base.endings]);

  const chunks = uniq(baseChunks.concat(...rules.flatMap((entry) => entry.rule.chunks ?? [])));
  const endings = uniq(baseEndings.concat(...rules.flatMap((entry) => entry.rule.endings ?? [])));
  const avoidChunks = uniq(rules.flatMap((entry) => entry.rule.avoidChunks ?? []));
  const avoidPrefixes = uniq(ELF_LEXICON.base.avoidPrefixes.concat(...rules.flatMap((entry) => entry.rule.avoidPrefixes ?? [])));
  const avoidEndings = uniq(rules.flatMap((entry) => entry.rule.avoidEndings ?? []));

  return { baseChunks, baseEndings, chunks, endings, avoidChunks, avoidPrefixes, avoidEndings };
}

function chooseMandatoryChunks(
  rules: Array<{ label: string; rule: LexiconRule }>,
  rng: RNG,
  trace?: GenerationTrace
) {
  const mandatory: string[] = [];
  rules.forEach((entry) => {
    if (entry.rule.requireChunk && entry.rule.chunks?.length) {
      const chosen = pick(entry.rule.chunks, rng);
      mandatory.push(chosen);
      trace?.decisions.push(`${entry.label}: chunk ${chosen}`);
      trace?.usedLexicons.push(entry.label);
    }
  });
  return uniq(mandatory);
}

function chooseEnding(
  priorityRules: Array<{ label: string; rule: LexiconRule }>,
  pool: string[],
  avoidEndings: string[],
  rng: RNG,
  trace?: GenerationTrace
) {
  const filteredPool = applyAvoids(pool, avoidEndings);
  for (const entry of priorityRules) {
    if (entry.rule.endings?.length && entry.rule.requireEnding) {
      const localPool = applyAvoids(entry.rule.endings, avoidEndings);
      const chosen = pick(localPool.length ? localPool : filteredPool, rng);
      if (trace) {
        trace.decisions.push(`${entry.label}: ending ${chosen}`);
        trace.usedLexicons.push(entry.label);
        trace.usedEnding = chosen;
        if (!localPool.length) trace.fallback?.push(`${entry.label}: ending-fallback`);
      }
      return chosen;
    }
  }
  for (const entry of priorityRules) {
    if (entry.rule.endings?.length) {
      const localPool = applyAvoids(entry.rule.endings, avoidEndings);
      const chosen = pick(localPool.length ? localPool : filteredPool, rng);
      if (trace) {
        trace.decisions.push(`${entry.label}: ending ${chosen}`);
        trace.usedLexicons.push(entry.label);
        trace.usedEnding = chosen;
        if (!localPool.length) trace.fallback?.push(`${entry.label}: ending-fallback`);
      }
      return chosen;
    }
  }
  const fallback = pick(filteredPool.length ? filteredPool : pool, rng);
  if (trace) {
    trace.decisions.push(`Base ending: ${fallback}`);
    trace.usedEnding = fallback;
  }
  return fallback;
}

function applyAvoids(values: string[], avoid: string[]) {
  if (!avoid.length) return values;
  return values.filter((value) => !avoid.some((ban) => value.toLowerCase().includes(ban.toLowerCase())));
}

function assembleName(
  chunksPool: string[],
  ending: string,
  endingPool: string[],
  mandatoryChunks: string[],
  structure: LexiconStructure,
  avoidPrefixes: string[],
  avoidChunks: string[],
  rng: RNG,
  trace?: GenerationTrace
) {
  const chunks: string[] = [...mandatoryChunks];
  const needed = Math.max(structure.chunks, mandatoryChunks.length) - mandatoryChunks.length;
  const pool = applyAvoids(chunksPool, avoidChunks);

  for (let i = 0; i < needed; i += 1) {
    let pickChunk = pick(pool, rng);
    let attempts = 0;
    while (chunks.includes(pickChunk) && attempts < 6) {
      pickChunk = pick(pool, rng);
      attempts += 1;
    }
    chunks.push(pickChunk);
  }

  let name = `${chunks.join("")}${ending}`;
  let attempts = 0;
  while (avoidPrefixes.some((prefix) => name.toLowerCase().startsWith(prefix.toLowerCase())) && attempts < 6) {
    const altEnding = endingPool.length ? pick(endingPool, rng) : ending;
    name = `${chunks.join("")}${altEnding}`;
    attempts += 1;
  }

  if (trace) {
    trace.usedChunks.push(...chunks);
    if (ending) trace.usedEnding = ending;
  }

  return name;
}

function enforceLength(name: string, min: number, max: number) {
  return name.length >= min && name.length <= max;
}

export function generateWeightedElfName(params: WeightedElfNameParams): WeightedElfNameResult {
  const rng = createRng(params.seed);
  const trace: GenerationTrace | undefined = params.trace
    ? {
        seed: params.seed,
        applied: [],
        conflicts: [],
        decisions: [],
        usedLexicons: [],
        usedChunks: [],
        fallback: [],
      }
    : undefined;

  if (!shouldUseWeightedPath(params.weights, params.forceWeighting)) {
    const base = makeLegacyElfName(params.parts, params.separator, params.options, rng);
    return { name: base, trace };
  }

  const highRules = [
    collectRule("Nation", params.weights.nation ? ELF_LEXICON.nation[params.weights.nation] : undefined),
    collectRule(
      "Origin",
      params.weights.culturalOrigin ? ELF_LEXICON.origin[params.weights.culturalOrigin] : undefined
    ),
    collectRule("Era", params.weights.era ? ELF_LEXICON.era[params.weights.era] : undefined),
    collectRule("Gender", params.weights.gender ? ELF_LEXICON.gender[params.weights.gender] : undefined),
  ].filter(Boolean) as Array<{ label: string; rule: LexiconRule }>;

  const mediumRules = [
    collectRule(
      "Context",
      params.weights.culturalContext ? ELF_LEXICON.context[params.weights.culturalContext] : undefined
    ),
    collectRule("Form", params.weights.nameForm ? ELF_LEXICON.form[params.weights.nameForm] : undefined),
  ].filter(Boolean) as Array<{ label: string; rule: LexiconRule }>;

  const lowRules = [
    collectRule("Style", params.weights.style ? ELF_LEXICON.style[params.weights.style] : undefined),
    collectRule("Length", params.weights.length ? ELF_LEXICON.length[params.weights.length] : undefined),
  ].filter(Boolean) as Array<{ label: string; rule: LexiconRule }>;

  const appliedRules = [...highRules, ...mediumRules, ...lowRules];
  trace?.applied.push(...appliedRules.map((entry) => entry.label));

  const pools = buildPools(params.parts, appliedRules);
  const mandatoryChunks = chooseMandatoryChunks(highRules, rng, trace);
  const priorityEndingRules = highRules.length ? highRules : mediumRules;

  const defaultStructures: LexiconStructure[] = [
    { chunks: 2, ending: true },
    { chunks: 3, ending: true },
  ];
  const structure = resolveStructure([...highRules, ...mediumRules], defaultStructures, rng);

  let lengthKey: "short" | "medium" | "long" = params.options.length;
  if (params.weights.length) {
    lengthKey = params.weights.length;
  } else if (params.weights.era) {
    lengthKey = params.weights.era === "ancient" ? "long" : params.weights.era === "revival" ? "short" : "medium";
  }
  const lengthRule = ELF_LEXICON.length[lengthKey];

  let finalName = "";
  let attempts = 0;
  let ending = "";
  while (attempts < 16) {
    ending = structure.ending
      ? chooseEnding(priorityEndingRules, pools.endings, pools.avoidEndings, rng, trace)
      : "";
    const name = assembleName(
      pools.chunks,
      ending,
      applyAvoids(pools.endings, pools.avoidEndings),
      mandatoryChunks,
      structure,
      pools.avoidPrefixes,
      pools.avoidChunks,
      rng,
      trace
    );
    const fullName = name;
    if (enforceLength(fullName, lengthRule.min, lengthRule.max)) {
      finalName = fullName;
      break;
    }
    attempts += 1;
  }

  if (!finalName) {
    finalName = assembleName(
      pools.chunks,
      ending,
      applyAvoids(pools.endings, pools.avoidEndings),
      mandatoryChunks,
      structure,
      pools.avoidPrefixes,
      pools.avoidChunks,
      rng,
      trace
    );
    trace?.fallback?.push("length-bounds");
  }

  let surname = "";
  if (params.options.surname) {
    surname = `${pick(params.parts.lastA, rng)}${pick(params.parts.lastB, rng)}`;
  }

  const combined = surname ? `${finalName}${params.separator}${surname}` : finalName;
  return { name: combined, trace };
}

function makeLegacyElfName(parts: Parts, separator: string, options: ElfOptions, rng: RNG) {
  const pickLegacy = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
  let given = "";
  let surname = "";

  if (options.length === "short") {
    given = pickLegacy(parts.first);
  } else if (options.length === "medium") {
    given = `${pickLegacy(parts.first)}${pickLegacy(parts.second)}`;
  } else {
    given = `${pickLegacy(parts.first)}${pickLegacy(parts.second)}${pickLegacy(parts.lastA)}`;
  }

  if (options.surname) {
    surname = `${pickLegacy(parts.lastA)}${pickLegacy(parts.lastB)}`;
  }

  if (options.nameForm === "short") {
    given = pickLegacy(parts.first);
  } else if (options.nameForm === "external") {
    given = pickLegacy(parts.first) + pickLegacy(parts.second);
  }

  return surname ? `${given}${separator}${surname}` : given;
}
