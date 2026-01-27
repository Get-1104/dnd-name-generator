import {
  ElfCulturalContext,
  ElfCulturalOrigin,
  ElfLength,
  ElfNameForm,
  ElfOptions,
  ElfStyle,
} from "./elfOptions";
import { ELF_LEXICON, LexiconRule, LexiconStructure } from "./elfLexicon";
import {
  ELF_BIASES,
  ELF_GIVEN_FAMILIES,
  ELF_POOLS,
  ELF_SUFFIX_TRACK,
  ELF_SURNAME_FAMILIES,
} from "./namePools/elfPools";
import type { ElfBiasRule } from "./namePools/elfPools";
import { hasSoftBigrams, isPronounceableEN, normalizeNamePart, toTitleCase } from "./phonotactics";
import { cropPools } from "./namePools/cropPools";
import type { ToggleKey } from "./namePools/types";

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
  sourcePath?: string;
  rejectedReasons?: Record<string, number>;
  fallback?: string[];
};

function toLowerSet(values: string[]) {
  return new Set(values.map((value) => value.toLowerCase()));
}

function filterByLayer(pool: string[], layer: string[]) {
  if (!layer.length) return pool;
  const allowed = toLowerSet(layer);
  return pool.filter((value) => allowed.has(value.toLowerCase()));
}

function applyBoost(weights: Map<string, number>, layer: string[], boost: number) {
  const layerSet = toLowerSet(layer);
  for (const key of weights.keys()) {
    if (layerSet.has(key.toLowerCase())) {
      weights.set(key, (weights.get(key) ?? 1) + boost);
    }
  }
}
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
  enabled?: Partial<Record<ToggleKey, boolean>>;
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

type RuleEntry = {
  key:
    | "nation"
    | "culturalOrigin"
    | "era"
    | "gender"
    | "culturalContext"
    | "nameForm"
    | "style";
  label: string;
  value: string;
  rule: LexiconRule;
  priority: number;
};

type PrunedPools = {
  chunks: string[];
  endings: string[];
  avoidChunks: string[];
  avoidPrefixes: string[];
  avoidEndings: string[];
  structureRules: Array<{ label: string; rule: LexiconRule }>;
  priorityRules: Array<{ label: string; rule: LexiconRule }>;
  mandatoryChunks: string[];
};

type PoolResult = {
  pools: PrunedPools;
  activeWeights: ElfWeightedInputs;
  fallbackLevel: number;
};

const RULE_LABELS: Record<RuleEntry["key"], string> = {
  nation: "Nation",
  culturalOrigin: "Origin",
  era: "Era",
  gender: "Gender",
  culturalContext: "Context",
  nameForm: "Form",
  style: "Style",
};

function titleize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveNationLabel(value: string) {
  const match = NATION_OPTIONS.find((opt) => opt.value === value);
  return match?.label ?? titleize(value);
}

function buildSourcePath(weights: ElfWeightedInputs) {
  const parts: string[] = ["Elf"];
  if (weights.culturalOrigin) parts.push(titleize(weights.culturalOrigin));
  if (weights.nation) parts.push(resolveNationLabel(weights.nation));
  if (weights.era) parts.push(titleize(weights.era));
  if (weights.gender) parts.push(titleize(weights.gender));
  if (weights.nameForm) parts.push(titleize(weights.nameForm));
  if (weights.style) parts.push(titleize(weights.style));
  if (weights.length) parts.push(titleize(weights.length));
  return parts.join(" > ");
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

function intersect(left: string[], right: string[]) {
  if (!right.length) return left;
  const set = new Set(right.map((item) => item.toLowerCase()));
  return left.filter((item) => set.has(item.toLowerCase()));
}

function buildRacePool(parts: Parts) {
  const chunks = uniq([...parts.first, ...parts.second, ...parts.lastA, ...ELF_LEXICON.base.chunks]);
  const endings = uniq([...parts.lastB, ...ELF_LEXICON.base.endings]);
  return {
    chunks,
    endings,
    avoidPrefixes: ELF_LEXICON.base.avoidPrefixes,
  };
}

function buildCropInput(params: WeightedElfNameParams) {
  const enabled = params.enabled ?? {
    nation: Boolean(params.weights.nation),
    origin: Boolean(params.weights.culturalOrigin),
    era: Boolean(params.weights.era),
    gender: Boolean(params.weights.gender),
    context: Boolean(params.weights.culturalContext),
    form: Boolean(params.weights.nameForm),
    style: Boolean(params.weights.style),
    length: Boolean(params.weights.length),
  };

  const selected = {
    nation: params.weights.nation ?? undefined,
    origin: params.weights.culturalOrigin ?? undefined,
    era: params.weights.era ?? undefined,
    gender: params.weights.gender ?? undefined,
    context: params.weights.culturalContext ?? undefined,
    form: params.weights.nameForm ?? undefined,
    style: params.weights.style ?? undefined,
    length: params.weights.length ?? undefined,
  };

  return { enabled, selected };
}

function getSelectedRules(weights: ElfWeightedInputs): RuleEntry[] {
  const entries: RuleEntry[] = [];
  if (weights.nation) {
    entries.push({
      key: "nation",
      label: RULE_LABELS.nation,
      value: weights.nation,
      rule: ELF_LEXICON.nation[weights.nation],
      priority: WEIGHT_MODEL.nation.priority,
    });
  }
  if (weights.culturalOrigin) {
    entries.push({
      key: "culturalOrigin",
      label: RULE_LABELS.culturalOrigin,
      value: weights.culturalOrigin,
      rule: ELF_LEXICON.origin[weights.culturalOrigin],
      priority: WEIGHT_MODEL.culturalOrigin.priority,
    });
  }
  if (weights.era) {
    entries.push({
      key: "era",
      label: RULE_LABELS.era,
      value: weights.era,
      rule: ELF_LEXICON.era[weights.era],
      priority: WEIGHT_MODEL.era.priority,
    });
  }
  if (weights.gender) {
    entries.push({
      key: "gender",
      label: RULE_LABELS.gender,
      value: weights.gender,
      rule: ELF_LEXICON.gender[weights.gender],
      priority: WEIGHT_MODEL.gender.priority,
    });
  }
  if (weights.culturalContext) {
    entries.push({
      key: "culturalContext",
      label: RULE_LABELS.culturalContext,
      value: weights.culturalContext,
      rule: ELF_LEXICON.context[weights.culturalContext],
      priority: WEIGHT_MODEL.culturalContext.priority,
    });
  }
  if (weights.nameForm) {
    entries.push({
      key: "nameForm",
      label: RULE_LABELS.nameForm,
      value: weights.nameForm,
      rule: ELF_LEXICON.form[weights.nameForm],
      priority: WEIGHT_MODEL.nameForm.priority,
    });
  }
  if (weights.style) {
    entries.push({
      key: "style",
      label: RULE_LABELS.style,
      value: weights.style,
      rule: ELF_LEXICON.style[weights.style],
      priority: WEIGHT_MODEL.style.priority,
    });
  }
  return entries;
}

function prunePools(racePool: ReturnType<typeof buildRacePool>, rules: RuleEntry[], rng: RNG, trace?: GenerationTrace) {
  let chunks = racePool.chunks;
  let endings = racePool.endings;
  const avoidChunks = uniq(rules.flatMap((entry) => entry.rule.avoidChunks ?? []));
  const avoidPrefixes = uniq(racePool.avoidPrefixes.concat(...rules.flatMap((entry) => entry.rule.avoidPrefixes ?? [])));
  const avoidEndings = uniq(rules.flatMap((entry) => entry.rule.avoidEndings ?? []));

  for (const entry of rules) {
    if (entry.rule.chunks?.length) {
      chunks = intersect(chunks, entry.rule.chunks);
    }
    if (entry.rule.endings?.length) {
      endings = intersect(endings, entry.rule.endings);
    }
  }

  if (!chunks.length || !endings.length) {
    return null;
  }

  const priorityRules = [...rules]
    .sort((a, b) => b.priority - a.priority)
    .map((entry) => ({ label: entry.label, rule: entry.rule }));

  const structureRules = priorityRules.filter((entry) => entry.rule.structures?.length);

  const mandatoryChunks: string[] = [];
  for (const entry of priorityRules) {
    if (entry.rule.requireChunk && entry.rule.chunks?.length) {
      const available = intersect(chunks, entry.rule.chunks);
      if (!available.length) {
        trace?.conflicts.push(`${entry.label}: mandatory chunk unavailable`);
        return null;
      }
      const chosen = pick(available, rng);
      mandatoryChunks.push(chosen);
      trace?.decisions.push(`${entry.label}: mandatory chunk ${chosen}`);
      trace?.usedLexicons.push(entry.label);
    }
  }

  return {
    chunks,
    endings,
    avoidChunks,
    avoidPrefixes,
    avoidEndings,
    structureRules,
    priorityRules,
    mandatoryChunks: uniq(mandatoryChunks),
  } satisfies PrunedPools;
}

function buildCandidatePools(
  params: WeightedElfNameParams,
  rng: RNG,
  trace?: GenerationTrace
): PoolResult | null {
  const racePool = buildRacePool(params.parts);
  const fallbackSteps: Array<{ label: string; apply: (weights: ElfWeightedInputs) => ElfWeightedInputs }> = [
    {
      label: "drop-style-context-form",
      apply: (weights) => ({
        ...weights,
        style: null,
        culturalContext: null,
        nameForm: null,
      }),
    },
    {
      label: "drop-gender-era",
      apply: (weights) => ({
        ...weights,
        gender: null,
        era: null,
      }),
    },
    {
      label: "drop-nation-origin",
      apply: (weights) => ({
        ...weights,
        nation: null,
        culturalOrigin: null,
      }),
    },
  ];

  let activeWeights = params.weights;
  let fallbackLevel = 0;

  while (fallbackLevel <= fallbackSteps.length) {
    if (trace) {
      trace.applied = [];
      trace.conflicts = [];
    }
    const rules = getSelectedRules(activeWeights);
    trace?.applied.push(...rules.map((entry) => entry.label));
    const pools = prunePools(racePool, rules, rng, trace);
    if (pools) {
      return { pools, activeWeights, fallbackLevel };
    }
    if (fallbackLevel < fallbackSteps.length) {
      const step = fallbackSteps[fallbackLevel];
      trace?.fallback?.push(step.label);
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[ElfNameFallback]", step.label);
      }
      activeWeights = step.apply(activeWeights);
      fallbackLevel += 1;
      continue;
    }
    break;
  }

  const basePools = prunePools(racePool, [], rng, trace);
  if (basePools) {
    trace?.fallback?.push("race-only");
    return { pools: basePools, activeWeights, fallbackLevel };
  }

  return null;
}

function fallbackGenerate(
  params: WeightedElfNameParams,
  rng: RNG,
  trace?: GenerationTrace,
  reason?: string
): WeightedElfNameResult {
  if (reason) {
    trace?.fallback?.push(reason);
  }
  const base = makeLegacyElfName(params.parts, params.separator, params.options, rng);
  return { name: base, trace };
}

function generateFromPools(
  params: WeightedElfNameParams,
  rng: RNG,
  poolResult: PoolResult,
  trace?: GenerationTrace
): WeightedElfNameResult {
  const { activeWeights } = poolResult;
  let lengthKey: GivenLengthKey = params.options.length;
  if (activeWeights.length) {
    lengthKey = activeWeights.length;
  } else if (activeWeights.era) {
    lengthKey = activeWeights.era === "ancient" ? "long" : activeWeights.era === "revival" ? "short" : "medium";
  }

  const enabled = params.enabled ?? {};
  const biasLayers: BiasLayer[] = [];

  const pushBias = (
    key: keyof typeof ELF_BIASES,
    value: string | null | undefined,
    enabledKey: keyof typeof enabled
  ) => {
    if (!value || !enabled[enabledKey]) return;
    const entry = resolveBiasLayer(key, value);
    if (entry) biasLayers.push(entry);
  };

  pushBias("nation", activeWeights.nation, "nation");
  pushBias("origin", activeWeights.culturalOrigin, "origin");
  pushBias("era", activeWeights.era, "era");
  pushBias("gender", activeWeights.gender, "gender");
  pushBias("context", activeWeights.culturalContext, "context");
  pushBias("form", activeWeights.nameForm, "form");
  pushBias("style", activeWeights.style, "style");
  pushBias("length", activeWeights.length, "length");

  if (trace) {
    trace.applied.push(...biasLayers.map((layer) => layer.key));
  }

  const lengthPolicy = resolveLengthPolicy(lengthKey, biasLayers);
  const batchState = getBatchState(params.seed);

  const onsetBoosts = biasLayers.flatMap((layer) => layer.onsetBoosts ?? []);
  const nucleusBoosts = biasLayers.flatMap((layer) => layer.nucleusBoosts ?? []);
  const codaBoosts = biasLayers.flatMap((layer) => layer.codaBoosts ?? []);
  const suffixBoosts = biasLayers.flatMap((layer) => layer.suffixBoosts ?? []);
  const bannedFragments = uniq([
    ...biasLayers.flatMap((layer) => layer.bannedFragments ?? []),
  ]);

  const givenFamily = pickGivenFamily(biasLayers, rng);
  const givenOnsetWeights = buildWeights(givenFamily.onsets, onsetBoosts, 0.45);
  const givenNucleusWeights = buildWeights(givenFamily.nuclei, nucleusBoosts, 0.4);
  const codas = givenFamily.codas.includes("") ? givenFamily.codas : ["", ...givenFamily.codas];
  const givenCodaWeights = buildWeights(codas, codaBoosts, 0.3);
  const givenSuffixWeights = buildWeights(givenFamily.suffixes, suffixBoosts, 0.55);

  const suffixChanceBoost = biasLayers.reduce((sum, layer) => sum + (layer.suffixChanceBoost ?? 0), 0);
  const suffixChance = clamp(0.08, 0.18 + suffixChanceBoost, 0.45);

  let attempts = 0;
  const maxAttempts = 30;
  const rejectedCounts: Record<string, number> = {};
  let fallbackUsed = false;

  trace?.decisions.push(`maxAttempts:${maxAttempts}`);

  const bumpRejected = (reason: string) => {
    rejectedCounts[reason] = (rejectedCounts[reason] ?? 0) + 1;
    if (trace) {
      trace.rejectedReasons = trace.rejectedReasons ?? {};
      trace.rejectedReasons[reason] = (trace.rejectedReasons[reason] ?? 0) + 1;
    }
  };

  while (attempts < maxAttempts) {
    attempts += 1;
    const usedChunks: string[] = [];
    const usedLexicons: string[] = ["given.onsets", "given.nuclei", "given.codas", "given.suffixes"];

    const syllableCount = chooseSyllableCountFromPolicy(lengthPolicy, rng);
    let name = "";

    for (let i = 0; i < syllableCount; i += 1) {
      const onset = weightedPick(givenFamily.onsets, givenOnsetWeights, rng);
      const nucleus = weightedPick(givenFamily.nuclei, givenNucleusWeights, rng);
      const coda = weightedPick(codas, givenCodaWeights, rng);
      name += `${onset}${nucleus}${coda}`;
      usedChunks.push(onset, nucleus, coda);
    }

    if (givenFamily.suffixes.length && rng() < suffixChance) {
      const suffix = weightedPick(givenFamily.suffixes, givenSuffixWeights, rng);
      name += suffix;
      usedChunks.push(suffix);
    }

    const given = toTitleCase(name);
    const givenLower = given.toLowerCase();

    if (!enforceLength(given, lengthPolicy.minLen, lengthPolicy.maxLen)) {
      bumpRejected("given:length");
      continue;
    }

    if (GIVEN_BANNED.size && [...GIVEN_BANNED].some((token) => givenLower.includes(token))) {
      bumpRejected("given:banned-token");
      continue;
    }

    if (bannedFragments.some((fragment) => givenLower.includes(fragment))) {
      bumpRejected("given:banned-fragment");
      continue;
    }

    const pronounce = isPronounceableEN(given);
    if (!pronounce.ok) {
      bumpRejected(`given:${pronounce.reason ?? "phonotactics"}`);
      continue;
    }

    if (hasSoftBigrams(given) && rng() > 0.35) {
      bumpRejected("given:soft-bigram");
      continue;
    }

    const suffixKey = extractSuffix(given);
    if (wouldExceedSuffixShare(batchState, suffixKey, 0.35)) {
      bumpRejected("given:suffix-repeat");
      continue;
    }

    if (batchState.names.has(given)) {
      bumpRejected("given:duplicate");
      continue;
    }

    let surname = "";
    if (params.options.surname) {
      let surnameAttempts = 0;
      let validSurname = false;
      while (surnameAttempts < 24) {
        surnameAttempts += 1;
        const candidate = buildSurnameCandidate(biasLayers, rng, usedChunks);
        usedLexicons.push("surname.prefixes", "surname.roots", "surname.suffixes");
        const cleaned = normalizeNamePart(candidate);
        if (!enforceLength(candidate, SURNAME_LENGTH.min, SURNAME_LENGTH.max)) {
          bumpRejected("surname:length");
          continue;
        }
        const surnamePronounce = isPronounceableEN(cleaned);
        if (!surnamePronounce.ok) {
          bumpRejected(`surname:${surnamePronounce.reason ?? "phonotactics"}`);
          continue;
        }
        if (hasSoftBigrams(candidate) && rng() > 0.35) {
          bumpRejected("surname:soft-bigram");
          continue;
        }
        surname = toTitleCase(candidate);
        validSurname = true;
        break;
      }

      if (!validSurname) {
        surname = toTitleCase(buildSurnameCandidate(biasLayers, rng, usedChunks));
        fallbackUsed = true;
        trace?.fallback?.push("surname-fallback");
      }
    }

    const fullName = surname ? `${given} ${surname}` : given;
    if (batchState.names.has(fullName)) {
      bumpRejected("full:duplicate");
      continue;
    }

    if (trace) {
      trace.usedLexicons.push(...usedLexicons);
      trace.usedChunks.push(...usedChunks.filter(Boolean));
    }

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[NameQualityTrace]", {
        applied: trace?.applied ?? [],
        usedLexicons,
        usedChunks,
        fallbackUsed,
      });
    }

    registerBatchName(batchState, given, suffixKey);
    batchState.names.add(fullName);

    if (fallbackUsed) {
      trace?.fallback?.push("fallback-used");
    }

    const sourcePath = buildSourcePath(activeWeights);
    if (trace) {
      trace.sourcePath = sourcePath;
    }
    return { name: fullName, trace };
  }

  // Fallback: minimal valid given name
  const fallbackChunks: string[] = [];
  let fallbackGiven = "";
  for (let i = 0; i < 30; i += 1) {
    const candidate = buildGivenFallback(givenFamily, lengthPolicy, rng, fallbackChunks);
    const pronounce = isPronounceableEN(candidate);
    if (!pronounce.ok) continue;
    if (!enforceLength(candidate, lengthPolicy.minLen, lengthPolicy.maxLen)) continue;
    fallbackGiven = toTitleCase(candidate);
    break;
  }
  if (!fallbackGiven) {
    fallbackGiven = toTitleCase("Aelena");
  }

  const fallbackSurname = params.options.surname
    ? toTitleCase(buildSurnameCandidate(biasLayers, rng, fallbackChunks))
    : "";
  const finalName = fallbackSurname ? `${fallbackGiven} ${fallbackSurname}` : fallbackGiven;
  if (trace) {
    trace.usedLexicons.push("given.onsets", "given.nuclei", "given.codas", "given.suffixes");
    trace.usedChunks.push(...fallbackChunks.filter(Boolean));
    trace.fallback?.push("quality-fallback");
  }
  if (process.env.NODE_ENV !== "production") {
    const top3 = Object.entries(rejectedCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([reason, count]) => ({ reason, count }));
    // eslint-disable-next-line no-console
    console.debug("[NameQualitySummary]", {
      resultsCount: 1,
      rejectedTop3: top3,
      fallbackUsed: true,
      totalAttempts: attempts,
    });
  }
  return { name: finalName, trace };
}

function buildWeightMap(
  values: string[],
  rules: RuleEntry[],
  selectPool: (rule: LexiconRule) => string[] | undefined,
  weightBase = 1
) {
  const weights = new Map<string, number>();
  for (const value of values) {
    weights.set(value, weightBase);
  }
  for (const entry of rules) {
    const pool = selectPool(entry.rule) ?? [];
    const poolSet = new Set(pool.map((item) => item.toLowerCase()));
    for (const value of values) {
      if (poolSet.has(value.toLowerCase())) {
        weights.set(value, (weights.get(value) ?? weightBase) + entry.priority);
      }
    }
  }
  return weights;
}

function weightedPick(values: string[], weights: Map<string, number>, rng: RNG) {
  const total = values.reduce((sum, value) => sum + (weights.get(value) ?? 1), 0);
  let roll = rng() * total;
  for (const value of values) {
    roll -= weights.get(value) ?? 1;
    if (roll <= 0) return value;
  }
  return values[values.length - 1];
}

function chooseEnding(
  priorityRules: Array<{ label: string; rule: LexiconRule }>,
  pool: string[],
  avoidEndings: string[],
  rng: RNG,
  trace?: GenerationTrace,
  weights?: Map<string, number>
) {
  const filteredPool = applyAvoids(pool, avoidEndings);
  for (const entry of priorityRules) {
    if (entry.rule.endings?.length && entry.rule.requireEnding) {
      const localPool = intersect(filteredPool, entry.rule.endings ?? []);
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
  if (filteredPool.length) {
    const fallback = weights ? weightedPick(filteredPool, weights, rng) : pick(filteredPool, rng);
    if (trace) {
      trace.decisions.push(`Pruned ending: ${fallback}`);
      trace.usedEnding = fallback;
    }
    return fallback;
  }
  const fallback = pick(pool, rng);
  if (trace) {
    trace.decisions.push(`Fallback ending: ${fallback}`);
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
  trace?: GenerationTrace,
  pickChunk?: (pool: string[]) => string
) {
  const chunks: string[] = [...mandatoryChunks];
  const needed = Math.max(structure.chunks, mandatoryChunks.length) - mandatoryChunks.length;
  const pool = applyAvoids(chunksPool, avoidChunks);
  const pickFromPool = pickChunk ?? ((values: string[]) => pick(values, rng));

  for (let i = 0; i < needed; i += 1) {
    let pickChunkValue = pickFromPool(pool);
    let attempts = 0;
    while (chunks.includes(pickChunkValue) && attempts < 6) {
      pickChunkValue = pickFromPool(pool);
      attempts += 1;
    }
    chunks.push(pickChunkValue);
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

type GivenLengthKey = "short" | "medium" | "long";

const GIVEN_LENGTHS: Record<GivenLengthKey, { min: number; max: number }> = {
  short: { min: 4, max: 6 },
  medium: { min: 6, max: 8 },
  long: { min: 8, max: 11 },
};

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

const GIVEN_SYLLABLE_POLICY: Record<GivenLengthKey, { syllables: [number, number]; minLen: number; maxLen: number }> =
  {
    short: { syllables: [1, 2], minLen: 4, maxLen: 6 },
    medium: { syllables: [2, 2], minLen: 6, maxLen: 8 },
    long: { syllables: [2, 3], minLen: 8, maxLen: 10 },
  };

const SURNAME_LENGTH = { min: 5, max: 12 };

type BatchState = {
  names: Set<string>;
  suffixCounts: Map<string, number>;
  total: number;
  lastUsed: number;
};

const BATCH_CACHE = new Map<string, BatchState>();

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
  const lower = normalizeNamePart(name);
  const sorted = [...ELF_SUFFIX_TRACK].sort((a, b) => b.length - a.length);
  for (const suffix of sorted) {
    if (lower.endsWith(suffix)) return suffix;
  }
  return lower.slice(-3);
}

function wouldExceedSuffixShare(state: BatchState, suffix: string, maxShare = 0.35) {
  if (!suffix) return false;
  const current = state.suffixCounts.get(suffix) ?? 0;
  const nextShare = (current + 1) / (state.total + 1);
  return nextShare > maxShare;
}

function registerBatchName(state: BatchState, name: string, suffix: string) {
  state.total += 1;
  state.names.add(name);
  if (suffix) {
    state.suffixCounts.set(suffix, (state.suffixCounts.get(suffix) ?? 0) + 1);
  }
}

function buildWeights(pool: string[], boosts: string[] = [], boostValue = 0.4) {
  const weights = new Map(pool.map((value) => [value, 1]));
  if (boosts.length) {
    applyBoost(weights, boosts, boostValue);
  }
  return weights;
}

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function resolveLengthPolicy(
  lengthKey: GivenLengthKey,
  biases: Array<{ lengthPolicy?: { syllables?: readonly [number, number]; minLen?: number; maxLen?: number } }>
) {
  const base = GIVEN_SYLLABLE_POLICY[lengthKey];
  let [minSyl, maxSyl] = base.syllables;
  let minLen = base.minLen;
  let maxLen = base.maxLen;

  for (const bias of biases) {
    if (bias.lengthPolicy?.syllables) {
      minSyl = Math.max(minSyl, bias.lengthPolicy.syllables[0]);
      maxSyl = Math.min(maxSyl, bias.lengthPolicy.syllables[1]);
    }
    if (bias.lengthPolicy?.minLen) minLen = Math.max(minLen, bias.lengthPolicy.minLen);
    if (bias.lengthPolicy?.maxLen) maxLen = Math.min(maxLen, bias.lengthPolicy.maxLen);
  }

  if (minSyl > maxSyl) {
    [minSyl, maxSyl] = base.syllables;
  }

  return { syllables: [minSyl, maxSyl] as [number, number], minLen, maxLen };
}

export function isNameLike(token: string, kind: "given" | "surname") {
  const normalized = toTitleCase(token);
  const cleaned = normalizeNamePart(normalized);
  const length = cleaned.length;
  const min = kind === "given" ? 4 : 5;
  const max = kind === "given" ? 10 : 12;
  if (length < min || length > max) {
    return { ok: false, reason: "length" };
  }
  const pronounceable = isPronounceableEN(cleaned);
  if (!pronounceable.ok) return pronounceable;
  return { ok: true };
}

type BiasLayer = ElfBiasRule & { key: string };

function resolveBiasLayer(key: keyof typeof ELF_BIASES, value: string): BiasLayer | null {
  const source = (ELF_BIASES[key] as unknown as Record<string, ElfBiasRule> | undefined) ?? undefined;
  const layer = source?.[value];
  if (!layer) return null;
  return { key: `${key}:${value}`, ...layer };
}

function pickGivenFamily(biases: BiasLayer[], rng: RNG) {
  const weights = new Map<string, number>();
  for (const family of ELF_GIVEN_FAMILIES) {
    let weight = family.weight;
    for (const bias of biases) {
      const multiplier = bias.familyWeights?.[family.id];
      if (multiplier) weight *= multiplier;
    }
    weights.set(family.id, Math.max(0.05, weight));
  }

  const ids = ELF_GIVEN_FAMILIES.map((family) => family.id);
  const pickedId = weightedPick(ids, weights, rng);
  return ELF_GIVEN_FAMILIES.find((family) => family.id === pickedId) ?? ELF_GIVEN_FAMILIES[0];
}

function pickSurnameFamily(biases: BiasLayer[], rng: RNG) {
  const allowSets = biases
    .map((bias) => bias.surnameFamilyAllow)
    .filter((value): value is string[] => Boolean(value && value.length));
  let allowed = ELF_SURNAME_FAMILIES.map((family) => family.id);
  if (allowSets.length) {
    allowed = allowSets.reduce((acc, current) => acc.filter((id) => current.includes(id)), allowed);
  }
  if (!allowed.length) {
    allowed = ELF_SURNAME_FAMILIES.map((family) => family.id);
  }

  const weights = new Map<string, number>();
  for (const family of ELF_SURNAME_FAMILIES) {
    if (!allowed.includes(family.id)) continue;
    let weight = family.weight;
    for (const bias of biases) {
      const multiplier = bias.surnameFamilyWeights?.[family.id];
      if (multiplier) weight *= multiplier;
    }
    weights.set(family.id, Math.max(0.05, weight));
  }

  const pickedId = weightedPick(allowed, weights, rng);
  return ELF_SURNAME_FAMILIES.find((family) => family.id === pickedId) ?? ELF_SURNAME_FAMILIES[0];
}

function chooseSyllableCountFromPolicy(
  policy: { syllables: [number, number] },
  rng: RNG
) {
  const [min, max] = policy.syllables;
  if (min === max) return min;
  return min + Math.floor(rng() * (max - min + 1));
}

function buildGivenFallback(
  family: typeof ELF_GIVEN_FAMILIES[number],
  policy: { syllables: [number, number] },
  rng: RNG,
  usedChunks: string[]
) {
  const syllables = chooseSyllableCountFromPolicy(policy, rng);
  let name = "";
  const codas = family.codas.includes("") ? family.codas : ["", ...family.codas];
  for (let i = 0; i < syllables; i += 1) {
    const onset = pick(family.onsets, rng) ?? "";
    const nucleus = pick(family.nuclei, rng) ?? "a";
    const coda = pick(codas, rng) ?? "";
    name += `${onset}${nucleus}${coda}`;
    usedChunks.push(onset, nucleus, coda);
  }
  return toTitleCase(name);
}

function buildSurnameCandidate(biases: BiasLayer[], rng: RNG, usedChunks: string[]) {
  const family = pickSurnameFamily(biases, rng);
  const prefix = pick(family.prefixes, rng) ?? "";
  const root = pick(family.roots, rng) ?? "";
  let suffix = "";

  const roll = rng();
  if (roll < 0.55) {
    suffix = pick(family.suffixes, rng) ?? "";
  } else if (roll < 0.8 && family.compounds?.length) {
    suffix = pick(family.compounds, rng) ?? "";
  }

  const candidate = `${prefix}${root}${suffix}`;
  usedChunks.push(prefix, root, suffix);
  return toTitleCase(candidate);
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
    return fallbackGenerate(params, rng, trace);
  }

  const cropInput = buildCropInput(params);
  const cropResult = cropPools(ELF_POOLS, cropInput);
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[CROP TRACE]", cropResult.trace);
  }

  const croppedPool = cropResult.activeArrays.flat();
  if (croppedPool.length) {
    const pools: PrunedPools = {
      chunks: croppedPool,
      endings: croppedPool,
      avoidChunks: [],
      avoidPrefixes: [],
      avoidEndings: [],
      structureRules: [],
      priorityRules: [],
      mandatoryChunks: [],
    };
    const poolResult: PoolResult = {
      pools,
      activeWeights: params.weights,
      fallbackLevel: 0,
    };
    return generateFromPools(params, rng, poolResult, trace);
  }

  if (cropResult.trace.some((entry) => entry.mode === "missing")) {
    trace?.fallback?.push("crop-missing");
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[CROP FALLBACK] missing layer, falling back to race pool");
    }
  }

  const poolResult = buildCandidatePools(params, rng, trace);
  if (!poolResult) {
    return fallbackGenerate(params, rng, trace, "no-pools");
  }

  return generateFromPools(params, rng, poolResult, trace);
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
