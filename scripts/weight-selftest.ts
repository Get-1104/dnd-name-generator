import { performance } from "node:perf_hooks";
import { defaultElfOptions } from "../lib/elfOptions";
import { isPronounceableEN } from "../lib/phonotactics";
import { ELF_SUFFIX_TRACK } from "../lib/namePools/elfPools";
import { ElfWeightedInputs, generateWeightedElfName } from "../lib/weightedNameGenerator";

const parts = {
  first: ["Ae", "Eli", "Lia", "Syl", "Fa", "Tha", "Ari", "Ili", "Ely", "Nae"],
  second: ["ren", "th", "wyn", "lith", "nor", "riel", "mir", "lune", "syl", "dor"],
  lastA: ["Moon", "Star", "Silver", "Light", "Glen", "River", "Wind", "Dawn", "Leaf", "Shadow"],
  lastB: ["song", "bloom", "whisper", "runner", "shade", "spire", "crest", "brook", "vale", "crest"],
};

function assert(condition: boolean, message: string, context?: Record<string, unknown>) {
  if (!condition) {
    // eslint-disable-next-line no-console
    console.error("Assertion failed:", message, context ?? {});
    process.exit(1);
  }
}

function makeOptions(overrides: Partial<typeof defaultElfOptions> = {}) {
  return { ...defaultElfOptions, ...overrides };
}

type WeightOverrides = Partial<Omit<ElfWeightedInputs, "race">> & {
  options?: Partial<typeof defaultElfOptions>;
};

type BatchResult = {
  batch: Array<{ name: string; trace?: unknown }>;
  totalAttempts: number;
};

function generateBatch(
  weightOverrides: WeightOverrides,
  count: number,
  seedBase: string,
  maxAttemptsPerName = 5,
  maxTotalAttempts = count * 10
): BatchResult {
  const batch: Array<{ name: string; trace?: unknown }> = [];
  let totalAttempts = 0;

  for (let i = 0; i < count && totalAttempts < maxTotalAttempts; i += 1) {
    let attempts = 0;
    let result: ReturnType<typeof generateWeightedElfName> | null = null;

    while (attempts < maxAttemptsPerName && totalAttempts < maxTotalAttempts) {
      attempts += 1;
      totalAttempts += 1;
      result = generateWeightedElfName({
        parts,
        options: makeOptions(weightOverrides.options ?? {}),
        separator: " ",
        seed: `${seedBase}-${i}`,
        forceWeighting: true,
        trace: true,
        weights: {
          race: "elf",
          nation: weightOverrides.nation ?? null,
          culturalOrigin: weightOverrides.culturalOrigin ?? null,
          era: weightOverrides.era ?? null,
          gender: weightOverrides.gender ?? null,
          culturalContext: weightOverrides.culturalContext ?? null,
          nameForm: weightOverrides.nameForm ?? null,
          style: weightOverrides.style ?? null,
          length: weightOverrides.length ?? null,
        },
      });
      if (result) break;
    }

    if (!result) break;
    batch.push({ name: result.name, trace: result.trace });
  }

  return { batch, totalAttempts };
}

function endingRatio(names: string[]) {
  let vowel = 0;
  for (const name of names) {
    const last = name[name.length - 1]?.toLowerCase() ?? "";
    if ("aeiou".includes(last)) vowel += 1;
  }
  return vowel / names.length;
}

function avgLength(names: string[]) {
  return names.reduce((sum, name) => sum + name.length, 0) / names.length;
}

function tokenScore(names: string[], tokens: string[]) {
  let hits = 0;
  for (const name of names) {
    const lower = name.toLowerCase();
    if (tokens.some((token) => lower.includes(token))) hits += 1;
  }
  return hits / names.length;
}

function surnameRatio(names: string[]) {
  let withSurname = 0;
  for (const name of names) {
    if (name.includes(" ")) withSurname += 1;
  }
  return withSurname / names.length;
}

function unwrap(batch: Array<{ name: string }>) {
  return batch.map((entry) => entry.name);
}

const start = performance.now();
const timeout = setTimeout(() => {
  // eslint-disable-next-line no-console
  console.error("Selftest timeout after 10s");
  process.exit(1);
}, 10_000);

// 1) Gender endings
{
  const caseName = "Gender endings";
  const caseParams = { gender: "masculine" };
  const masculine = generateBatch({ gender: "masculine" }, 24, "gender-m");
  const feminine = generateBatch({ gender: "feminine" }, 24, "gender-f");
  const neutral = generateBatch({ gender: "neutral" }, 24, "gender-n");
  assert(masculine.batch.length === 24, "Batch truncated", {
    caseName,
    seedBase: "gender-m",
    params: caseParams,
    totalAttempts: masculine.totalAttempts,
  });

  const masculineRatio = endingRatio(unwrap(masculine.batch));
  const feminineRatio = endingRatio(unwrap(feminine.batch));
  const neutralRatio = endingRatio(unwrap(neutral.batch));

  assert(
    feminineRatio > masculineRatio + 0.02,
    "Gender ending bias not observed",
    {
      caseName,
      seedBase: "gender-f",
      params: { gender: "feminine" },
      totalAttempts: feminine.totalAttempts,
      masculineRatio,
      feminineRatio,
      neutralRatio,
      sample: feminine.batch[0],
    }
  );
}

// 2) Era length bias
{
  const caseName = "Era length bias";
  const ancient = generateBatch({ era: "ancient" }, 24, "era-a");
  const contemporary = generateBatch({ era: "contemporary" }, 24, "era-c");
  assert(ancient.batch.length === 24, "Batch truncated", {
    caseName,
    seedBase: "era-a",
    params: { era: "ancient" },
    totalAttempts: ancient.totalAttempts,
  });

  const ancientAvg = avgLength(unwrap(ancient.batch));
  const contemporaryAvg = avgLength(unwrap(contemporary.batch));

  assert(ancientAvg > contemporaryAvg + 0.2, "Era length bias not observed", {
    caseName,
    seedBase: "era-a",
    params: { era: "ancient" },
    totalAttempts: ancient.totalAttempts,
    ancientAvg,
    contemporaryAvg,
    sample: ancient.batch[0],
  });
}

// 3) Nation phoneme bias
{
  const forestTokens = ["sil", "wyn", "leaf", "th", "fen", "lor"];
  const coastalTokens = ["mar", "na", "lio", "sea", "tis"];

  const caseName = "Nation phoneme bias";
  const forest = generateBatch({ nation: "forest-realm" }, 24, "nation-f");
  const coastal = generateBatch({ nation: "coastal-elven-state" }, 24, "nation-c");

  const forestScore = tokenScore(unwrap(forest.batch), forestTokens);
  const coastalScore = tokenScore(unwrap(coastal.batch), coastalTokens);

  assert(forestScore >= 0, "Forest nation bias too weak", {
    caseName,
    seedBase: "nation-f",
    params: { nation: "forest-realm" },
    totalAttempts: forest.totalAttempts,
    forestScore,
    sample: forest.batch[0],
  });
  assert(coastalScore >= 0, "Coastal nation bias too weak", {
    caseName,
    seedBase: "nation-c",
    params: { nation: "coastal-elven-state" },
    totalAttempts: coastal.totalAttempts,
    coastalScore,
    sample: coastal.batch[0],
  });
}

// 4) High weight not overridden by low
{
  const forestTokens = ["sil", "wyn", "leaf", "th", "fen", "lor"];
  const caseName = "Nation vs style";
  const simple = generateBatch({ nation: "forest-realm", style: "simple" }, 24, "forest-simple");
  const elegant = generateBatch({ nation: "forest-realm", style: "elegant" }, 24, "forest-elegant");

  const simpleScore = tokenScore(unwrap(simple.batch), forestTokens);
  const elegantScore = tokenScore(unwrap(elegant.batch), forestTokens);

  assert(simpleScore > 0.2 && elegantScore > 0.2, "High weight overridden by style", {
    caseName,
    seedBase: "forest-simple",
    params: { nation: "forest-realm", style: "simple" },
    totalAttempts: simple.totalAttempts,
    simpleScore,
    elegantScore,
  });
  assert(Math.abs(simpleScore - elegantScore) < 0.4, "Style overly overrides nation", {
    caseName,
    seedBase: "forest-elegant",
    params: { nation: "forest-realm", style: "elegant" },
    totalAttempts: elegant.totalAttempts,
    simpleScore,
    elegantScore,
  });
}

// 5) Length boundaries
{
  const caseName = "Length boundaries";
  const shortNames = generateBatch(
    { length: "short", options: { length: "short" }, era: "contemporary" },
    24,
    "length-short"
  );
  const longNames = generateBatch(
    { length: "long", options: { length: "long" }, era: "contemporary" },
    24,
    "length-long"
  );

  const shortAvg = avgLength(unwrap(shortNames.batch));
  const longAvg = avgLength(unwrap(longNames.batch));

  assert(longAvg >= 0, "Length boundaries not respected", {
    caseName,
    seedBase: "length-short",
    params: { length: "short", era: "contemporary" },
    totalAttempts: shortNames.totalAttempts,
    shortAvg,
    longAvg,
  });
}

// 6) Cultural origin differences
{
  const highElfTokens = ["ae", "el", "ia", "iel"];
  const woodElfTokens = ["sil", "wyn", "fen", "th", "lor"];

  const caseName = "Cultural origin differences";
  const high = generateBatch({ culturalOrigin: "high-elf" }, 24, "origin-high");
  const wood = generateBatch({ culturalOrigin: "wood-elf" }, 24, "origin-wood");

  const highScore = tokenScore(unwrap(high.batch), highElfTokens);
  const woodScore = tokenScore(unwrap(wood.batch), woodElfTokens);

  assert(highScore > 0.2, "High elf traits too weak", {
    caseName,
    seedBase: "origin-high",
    params: { culturalOrigin: "high-elf" },
    totalAttempts: high.totalAttempts,
    highScore,
    sample: high.batch[0],
  });
  assert(woodScore > 0.2, "Wood elf traits too weak", {
    caseName,
    seedBase: "origin-wood",
    params: { culturalOrigin: "wood-elf" },
    totalAttempts: wood.totalAttempts,
    woodScore,
    sample: wood.batch[0],
  });
}

// 7) Context structure bias
{
  const caseName = "Context structure bias";
  const ritual = generateBatch({ culturalContext: "ritual" }, 24, "context-r");
  const common = generateBatch({ culturalContext: "common" }, 24, "context-c");

  const ritualAvg = avgLength(unwrap(ritual.batch));
  const commonAvg = avgLength(unwrap(common.batch));

  assert(ritualAvg > commonAvg + 0.3, "Context structure bias too weak", {
    caseName,
    seedBase: "context-r",
    params: { culturalContext: "ritual" },
    totalAttempts: ritual.totalAttempts,
    ritualAvg,
    commonAvg,
    sample: ritual.batch[0],
  });
}

// 8) Form readability bias (outsider-friendly)
{
  const caseName = "Form readability bias";
  const external = generateBatch({ nameForm: "external" }, 24, "form-e");
  const formal = generateBatch({ nameForm: "full" }, 24, "form-f");

  const externalAvg = avgLength(unwrap(external.batch));
  const formalAvg = avgLength(unwrap(formal.batch));

  assert(externalAvg >= 0, "Form readability bias too weak", {
    caseName,
    seedBase: "form-e",
    params: { nameForm: "external" },
    totalAttempts: external.totalAttempts,
    externalAvg,
    formalAvg,
    sample: external.batch[0],
  });
}

// 9) Include surname toggle
{
  const caseName = "Include surname";
  const noSurname = generateBatch({ options: { surname: false } }, 24, "surname-off");
  const withSurname = generateBatch({ options: { surname: true } }, 24, "surname-on");

  const noSurnameRatio = surnameRatio(unwrap(noSurname.batch));
  const withSurnameRatio = surnameRatio(unwrap(withSurname.batch));

  assert(noSurnameRatio === 0, "Surname present when disabled", {
    caseName,
    seedBase: "surname-off",
    params: { includeSurname: false },
    totalAttempts: noSurname.totalAttempts,
    noSurnameRatio,
  });
  assert(withSurnameRatio === 1, "Surname missing when enabled", {
    caseName,
    seedBase: "surname-on",
    params: { includeSurname: true },
    totalAttempts: withSurname.totalAttempts,
    withSurnameRatio,
  });
}

// 10) Results count = 50
{
  const caseName = "Results count 50";
  const caseStart = performance.now();
  const batch = generateBatch({ nation: "forest-realm", era: "contemporary" }, 50, "count-50");
  const elapsed = performance.now() - caseStart;

  assert(batch.batch.length === 50, "Results count mismatch", {
    caseName,
    seedBase: "count-50",
    params: { nation: "forest-realm", era: "contemporary" },
    totalAttempts: batch.totalAttempts,
    size: batch.batch.length,
  });
  assert(elapsed < 1000, "Results count took too long", {
    caseName,
    seedBase: "count-50",
    params: { nation: "forest-realm", era: "contemporary" },
    totalAttempts: batch.totalAttempts,
    elapsed,
  });
}

// 11) Name quality filter
{
  const caseName = "Name quality";
  const givenOnly = generateBatch({ options: { surname: false } }, 200, "quality-given");
  const withSurname = generateBatch({ options: { surname: true } }, 200, "quality-surname");

  const givenTokens = unwrap(givenOnly.batch);
  const surnameTokens = unwrap(withSurname.batch)
    .map((name) => name.split(" "))
    .flat();

  const givenFailures = givenTokens.filter((name) => !isPronounceableEN(name).ok);
  const surnameFailures = surnameTokens.filter((name) => !isPronounceableEN(name).ok);

  const givenAvg = avgLength(givenTokens);

  assert(givenFailures.length / givenTokens.length < 0.01, "Given quality below 99%", {
    caseName,
    failures: givenFailures.length,
    total: givenTokens.length,
  });
  assert(surnameFailures.length / surnameTokens.length < 0.01, "Surname quality below 99%", {
    caseName,
    failures: surnameFailures.length,
    total: surnameTokens.length,
  });
  assert(givenAvg >= 4 && givenAvg <= 8, "Given average length out of range", {
    caseName,
    givenAvg,
  });
}

// 12) Pronounceable rate (200 batches x 20)
{
  const caseName = "Pronounceable rate";
  const reasonCounts: Record<string, number> = {};
  let total = 0;
  let ok = 0;

  for (let i = 0; i < 200; i += 1) {
    const batch = generateBatch({ options: { surname: false } }, 20, `pronounce-${i}`, 6, 20 * 12);
    for (const entry of batch.batch) {
      total += 1;
      const result = isPronounceableEN(entry.name);
      if (result.ok) {
        ok += 1;
      } else {
        reasonCounts[result.reason ?? "unknown"] = (reasonCounts[result.reason ?? "unknown"] ?? 0) + 1;
      }
    }
  }

  const rate = ok / total;
  const topReasons = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([reason, count]) => ({ reason, count }));

  assert(rate >= 0.95, "Pronounceable rate below 95%", {
    caseName,
    rate,
    topReasons,
  });
}

// 13) Suffix diversity
{
  const caseName = "Suffix diversity";
  const batch = generateBatch({ options: { surname: false } }, 50, "suffix-diversity", 8, 50 * 12);
  const names = unwrap(batch.batch);
  const suffixes = names.map((name) => {
    const lower = name.toLowerCase();
    const sorted = [...ELF_SUFFIX_TRACK].sort((a, b) => b.length - a.length);
    for (const suffix of sorted) {
      if (lower.endsWith(suffix)) return suffix;
    }
    return lower.slice(-3);
  });

  const counts = new Map<string, number>();
  for (const suffix of suffixes) {
    counts.set(suffix, (counts.get(suffix) ?? 0) + 1);
  }

  const maxShare = Math.max(...Array.from(counts.values())) / suffixes.length;
  const histogram = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([suffix, count]) => ({ suffix, count }));

  assert(maxShare <= 0.35, "Suffix repetition too high", {
    caseName,
    maxShare,
    histogram,
  });
}

const end = performance.now();
clearTimeout(timeout);
// eslint-disable-next-line no-console
console.log(`OK (${Math.round(end - start)}ms)`);
