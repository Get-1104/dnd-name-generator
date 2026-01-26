import { performance } from "node:perf_hooks";
import { defaultElfOptions } from "../lib/elfOptions";
import { generateWeightedElfName } from "../lib/weightedNameGenerator";

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

function generateBatch(weightOverrides: Record<string, unknown>, count: number, seedBase: string) {
  return Array.from({ length: count }, (_, i) => {
    const result = generateWeightedElfName({
      parts,
      options: makeOptions(weightOverrides.options as Partial<typeof defaultElfOptions>),
      separator: " ",
      seed: `${seedBase}-${i}`,
      forceWeighting: true,
      trace: true,
      weights: {
        race: "elf",
        nation: (weightOverrides.nation as string | null) ?? null,
        culturalOrigin: (weightOverrides.culturalOrigin as any) ?? null,
        era: (weightOverrides.era as any) ?? null,
        gender: (weightOverrides.gender as any) ?? null,
        culturalContext: (weightOverrides.culturalContext as any) ?? null,
        nameForm: (weightOverrides.nameForm as any) ?? null,
        style: (weightOverrides.style as any) ?? null,
        length: (weightOverrides.length as any) ?? null,
      },
    });
    return { name: result.name, trace: result.trace };
  });
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

function unwrap(batch: Array<{ name: string }>) {
  return batch.map((entry) => entry.name);
}

const start = performance.now();

// 1) Gender endings
{
  const masculine = generateBatch({ gender: "masculine" }, 24, "gender-m");
  const feminine = generateBatch({ gender: "feminine" }, 24, "gender-f");
  const neutral = generateBatch({ gender: "neutral" }, 24, "gender-n");

  const masculineRatio = endingRatio(unwrap(masculine));
  const feminineRatio = endingRatio(unwrap(feminine));
  const neutralRatio = endingRatio(unwrap(neutral));

  assert(
    feminineRatio > masculineRatio + 0.15,
    "Gender ending bias not observed",
    { masculineRatio, feminineRatio, neutralRatio, sample: feminine[0] }
  );
}

// 2) Era length bias
{
  const ancient = generateBatch({ era: "ancient" }, 24, "era-a");
  const contemporary = generateBatch({ era: "contemporary" }, 24, "era-c");

  const ancientAvg = avgLength(unwrap(ancient));
  const contemporaryAvg = avgLength(unwrap(contemporary));

  assert(ancientAvg > contemporaryAvg + 0.6, "Era length bias not observed", {
    ancientAvg,
    contemporaryAvg,
    sample: ancient[0],
  });
}

// 3) Nation phoneme bias
{
  const forestTokens = ["sil", "wyn", "leaf", "th", "fen", "lor"];
  const coastalTokens = ["mar", "na", "lio", "sea", "tis"];

  const forest = generateBatch({ nation: "forest-realm" }, 24, "nation-f");
  const coastal = generateBatch({ nation: "coastal-elven-state" }, 24, "nation-c");

  const forestScore = tokenScore(unwrap(forest), forestTokens);
  const coastalScore = tokenScore(unwrap(coastal), coastalTokens);

  assert(forestScore > 0.4, "Forest nation bias too weak", { forestScore, sample: forest[0] });
  assert(coastalScore > 0.35, "Coastal nation bias too weak", { coastalScore, sample: coastal[0] });
}

// 4) High weight not overridden by low
{
  const forestTokens = ["sil", "wyn", "leaf", "th", "fen", "lor"];
  const simple = generateBatch({ nation: "forest-realm", style: "simple" }, 24, "forest-simple");
  const elegant = generateBatch({ nation: "forest-realm", style: "elegant" }, 24, "forest-elegant");

  const simpleScore = tokenScore(unwrap(simple), forestTokens);
  const elegantScore = tokenScore(unwrap(elegant), forestTokens);

  assert(simpleScore > 0.4 && elegantScore > 0.4, "High weight overridden by style", {
    simpleScore,
    elegantScore,
  });
  assert(Math.abs(simpleScore - elegantScore) < 0.25, "Style overly overrides nation", {
    simpleScore,
    elegantScore,
  });
}

// 5) Length boundaries
{
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

  const maxShort = Math.max(...unwrap(shortNames).map((name) => name.length));
  const minLong = Math.min(...unwrap(longNames).map((name) => name.length));

  assert(maxShort < minLong, "Length boundaries not respected", { maxShort, minLong });
}

// 6) Cultural origin differences
{
  const highElfTokens = ["ae", "el", "ia", "iel"];
  const woodElfTokens = ["sil", "wyn", "fen", "th", "lor"];

  const high = generateBatch({ culturalOrigin: "high-elf" }, 24, "origin-high");
  const wood = generateBatch({ culturalOrigin: "wood-elf" }, 24, "origin-wood");

  const highScore = tokenScore(unwrap(high), highElfTokens);
  const woodScore = tokenScore(unwrap(wood), woodElfTokens);

  assert(highScore > 0.35, "High elf traits too weak", { highScore, sample: high[0] });
  assert(woodScore > 0.35, "Wood elf traits too weak", { woodScore, sample: wood[0] });
}

// 7) Context structure bias
{
  const ritual = generateBatch({ culturalContext: "ritual" }, 24, "context-r");
  const common = generateBatch({ culturalContext: "common" }, 24, "context-c");

  const ritualAvg = avgLength(unwrap(ritual));
  const commonAvg = avgLength(unwrap(common));

  assert(ritualAvg > commonAvg + 0.4, "Context structure bias too weak", {
    ritualAvg,
    commonAvg,
    sample: ritual[0],
  });
}

// 8) Form readability bias (outsider-friendly)
{
  const external = generateBatch({ nameForm: "external" }, 24, "form-e");
  const formal = generateBatch({ nameForm: "full" }, 24, "form-f");

  const externalAvg = avgLength(unwrap(external));
  const formalAvg = avgLength(unwrap(formal));

  assert(externalAvg < formalAvg - 0.4, "Form readability bias too weak", {
    externalAvg,
    formalAvg,
    sample: external[0],
  });
}

const end = performance.now();
// eslint-disable-next-line no-console
console.log(`OK (${Math.round(end - start)}ms)`);
