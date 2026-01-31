import type { PoolsByLayer } from "./types";
import type { ElfCulturalContext, ElfCulturalOrigin, ElfLength } from "../elfOptions";
import { ELF_LEXICON } from "../elfLexicon";

/**
 * Pool-layer mapping (independent + crop-able):
 * - Nation -> ELF_POOLS.nation + ELF_BIASES.nation
 * - Origin -> ELF_POOLS.origin + ELF_BIASES.origin
 * - Era -> ELF_POOLS.era + ELF_BIASES.era
 * - Gender -> ELF_POOLS.gender + ELF_BIASES.gender
 * - Context -> ELF_POOLS.context + ELF_BIASES.context
 * - Form -> ELF_POOLS.form + ELF_BIASES.form
 * - Style -> ELF_POOLS.style + ELF_BIASES.style
 * - Length -> ELF_POOLS.length + ELF_BIASES.length
 * - Surname -> ELF_SURNAME_FAMILIES + ELF_BIASES.context/form/origin/nation
 * Each dimension is a standalone layer; disabling a checkbox skips its bias/crop,
 * and generation falls back to default families.
 */

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

const baseChunks = ELF_LEXICON.base.chunks;
const baseEndings = ELF_LEXICON.base.endings;

const bannedGivenTokens = new Set([
  "moon",
  "leaf",
  "wind",
  "dawn",
  "night",
  "silver",
  "star",
  "sun",
  "mist",
  "song",
  "shadow",
  "river",
  "brook",
  "glade",
  "whisper",
  "dancer",
  "runner",
  "weaver",
  "watcher",
  "singer",
  "spire",
  "shade",
  "bloom",
  "crest",
  "vale",
  "ford",
  "wood",
  "field",
  "hill",
  "light",
]);

function isGivenSafe(value: string) {
  const lower = value.toLowerCase();
  for (const token of bannedGivenTokens) {
    if (lower.includes(token)) return false;
  }
  return true;
}

const phoneticRoots = uniq(
  [
    ...baseChunks,
    ...Object.values(ELF_LEXICON.gender).flatMap((entry) => entry.chunks ?? []),
    ...Object.values(ELF_LEXICON.era).flatMap((entry) => entry.chunks ?? []),
    ...Object.values(ELF_LEXICON.origin).flatMap((entry) => entry.chunks ?? []),
    ...Object.values(ELF_LEXICON.nation).flatMap((entry) => entry.chunks ?? []),
    ...Object.values(ELF_LEXICON.style).flatMap((entry) => entry.chunks ?? []),
    ...Object.values(ELF_LEXICON.form).flatMap((entry) => entry.chunks ?? []),
  ].filter((value) => value.length <= 4 && isGivenSafe(value))
);

const nameStems = uniq(
  [
    ...baseChunks,
    ...baseEndings,
    ...Object.values(ELF_LEXICON.gender).flatMap((entry) => entry.chunks ?? []),
    ...Object.values(ELF_LEXICON.origin).flatMap((entry) => entry.chunks ?? []),
  ].filter((value) => value.length >= 4 && value.length <= 7 && isGivenSafe(value))
);

const poeticRoots = uniq([
  "Moon",
  "Leaf",
  "Dawn",
  "Wind",
  "Mist",
  "Star",
  "Sun",
  "Shadow",
  "Silver",
  "River",
  "Glen",
  "Night",
  "Light",
  "Bloom",
  "Song",
  "Thorn",
]);

const surnameNouns = uniq([
  "whisper",
  "song",
  "bloom",
  "runner",
  "shade",
  "spire",
  "brook",
  "crest",
  "vale",
  "glade",
]);

const surnamePlaces = uniq([
  "glade",
  "brook",
  "vale",
  "crest",
  "field",
  "wood",
  "hill",
]);

const surnameMaterials = uniq([
  "Silver",
  "Gold",
  "Iron",
  "Moonstone",
]);

export type ElfFamilyRoot = {
  value: string;
  tags: string[];
  kind: "fantasy" | "human";
};

export type ElfFamily = {
  id: string;
  weight: number;
  givenRoots: string[];
  givenSuffixes: string[];
  surnameRoots: ElfFamilyRoot[];
  surnameSuffixes: string[];
  semanticTags: string[];
  phoneticProfile: {
    vowels: string[];
    consonants: string[];
    forbidden: string[];
    syllableRange: {
      short: [number, number];
      medium: [number, number];
      long: [number, number];
    };
  };
  l1Tags?: {
    origin?: string[];
    nation?: string[];
    era?: string[];
  };
};

export const ELF_REALISM_POOLS = {
  phoneticRoots,
  nameStems,
  poeticRoots,
  surnameNouns,
  surnamePlaces,
  surnameMaterials,
} as const;

export type StemProfile = {
  stem: string;
  weight: number;
  canonical: string;
  rareVariants: string[];
  gender: "masculine" | "feminine" | "neutral";
  origin: ElfCulturalOrigin;
  era: "ancient" | "contemporary" | "revival";
  context?: ElfCulturalContext;
  length?: ElfLength;
};

export const ELF_CANONICAL_PROFILES_BY_GENDER: Record<
  "masculine" | "feminine" | "neutral",
  StemProfile[]
> = {
  masculine: [
    { stem: "el", weight: 12, canonical: "Elen", rareVariants: ["Elan", "Elor"], gender: "masculine", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "aer", weight: 11, canonical: "Aeron", rareVariants: ["Aeris"], gender: "masculine", origin: "ancient-highborn", era: "ancient", context: "noble", length: "medium" },
    { stem: "thal", weight: 10, canonical: "Thalen", rareVariants: ["Thalion"], gender: "masculine", origin: "ancient-highborn", era: "ancient", context: "noble", length: "medium" },
    { stem: "lor", weight: 9, canonical: "Loren", rareVariants: ["Lorion"], gender: "masculine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "val", weight: 9, canonical: "Valen", rareVariants: ["Valor"], gender: "masculine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "cal", weight: 8, canonical: "Calen", rareVariants: ["Calor"], gender: "masculine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "dar", weight: 6, canonical: "Daren", rareVariants: ["Darion"], gender: "masculine", origin: "wood-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "mal", weight: 6, canonical: "Malen", rareVariants: ["Malor"], gender: "masculine", origin: "wood-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "gal", weight: 5, canonical: "Galen", rareVariants: ["Galor"], gender: "masculine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "kael", weight: 5, canonical: "Kaelen", rareVariants: ["Kaelor"], gender: "masculine", origin: "high-elf", era: "revival", context: "records", length: "medium" },
    { stem: "jor", weight: 4, canonical: "Joren", rareVariants: ["Jorion"], gender: "masculine", origin: "ancient-highborn", era: "ancient", context: "noble", length: "medium" },
    { stem: "tor", weight: 4, canonical: "Toren", rareVariants: ["Torion"], gender: "masculine", origin: "ancient-highborn", era: "ancient", context: "noble", length: "medium" },
    { stem: "ral", weight: 3, canonical: "Ralen", rareVariants: ["Ralor"], gender: "masculine", origin: "high-elf", era: "revival", context: "records", length: "medium" },
    { stem: "far", weight: 3, canonical: "Faren", rareVariants: ["Farion"], gender: "masculine", origin: "wood-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "bel", weight: 2, canonical: "Belen", rareVariants: ["Belor"], gender: "masculine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "hal", weight: 2, canonical: "Halen", rareVariants: ["Halor"], gender: "masculine", origin: "wood-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "nar", weight: 2, canonical: "Naren", rareVariants: ["Narion"], gender: "masculine", origin: "wood-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "var", weight: 2, canonical: "Varen", rareVariants: ["Varion"], gender: "masculine", origin: "high-elf", era: "revival", context: "records", length: "medium" },
    { stem: "phae", weight: 1, canonical: "Phaen", rareVariants: ["Phaelor"], gender: "masculine", origin: "ancient-highborn", era: "ancient", context: "ritual", length: "medium" },
    { stem: "quil", weight: 1, canonical: "Quilen", rareVariants: ["Quilor"], gender: "masculine", origin: "ancient-highborn", era: "ancient", context: "ritual", length: "medium" },
    { stem: "or", weight: 1, canonical: "Oren", rareVariants: ["Orion"], gender: "masculine", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "zar", weight: 2, canonical: "Zaren", rareVariants: ["Zarion"], gender: "masculine", origin: "drow", era: "ancient", context: "ritual", length: "medium" },
    { stem: "vyr", weight: 1, canonical: "Vyren", rareVariants: ["Vyrion"], gender: "masculine", origin: "drow", era: "ancient", context: "ritual", length: "medium" },
  ],
  feminine: [
    { stem: "elin", weight: 12, canonical: "Elin", rareVariants: ["Elina", "Elinar"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "lir", weight: 11, canonical: "Lirien", rareVariants: ["Liria"], gender: "feminine", origin: "ancient-highborn", era: "ancient", context: "noble", length: "medium" },
    { stem: "ael", weight: 10, canonical: "Aela", rareVariants: ["Aelina"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "rae", weight: 9, canonical: "Raena", rareVariants: ["Raelin"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "fae", weight: 9, canonical: "Faela", rareVariants: ["Faelin"], gender: "feminine", origin: "wood-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "ser", weight: 8, canonical: "Sera", rareVariants: ["Seren"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "syl", weight: 7, canonical: "Sylia", rareVariants: ["Sylien"], gender: "feminine", origin: "wood-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "ila", weight: 6, canonical: "Ilana", rareVariants: ["Ilia"], gender: "feminine", origin: "high-elf", era: "revival", context: "records", length: "medium" },
    { stem: "ira", weight: 5, canonical: "Irana", rareVariants: ["Iria"], gender: "feminine", origin: "high-elf", era: "revival", context: "records", length: "medium" },
    { stem: "mer", weight: 5, canonical: "Meria", rareVariants: ["Merin"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "nys", weight: 4, canonical: "Nysa", rareVariants: ["Nysia"], gender: "feminine", origin: "drow", era: "ancient", context: "ritual", length: "short" },
    { stem: "vel", weight: 4, canonical: "Velia", rareVariants: ["Velen"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "sae", weight: 3, canonical: "Saena", rareVariants: ["Saelin"], gender: "feminine", origin: "high-elf", era: "revival", context: "records", length: "medium" },
    { stem: "sel", weight: 3, canonical: "Selia", rareVariants: ["Selin"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "thal", weight: 2, canonical: "Thalia", rareVariants: ["Thalina"], gender: "feminine", origin: "ancient-highborn", era: "ancient", context: "noble", length: "medium" },
    { stem: "val", weight: 2, canonical: "Valia", rareVariants: ["Valin"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "wen", weight: 2, canonical: "Wena", rareVariants: ["Wenia"], gender: "feminine", origin: "wood-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "ari", weight: 1, canonical: "Aria", rareVariants: ["Arian"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "ela", weight: 1, canonical: "Ela", rareVariants: ["Elia"], gender: "feminine", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "lyr", weight: 1, canonical: "Lyra", rareVariants: ["Lyrin"], gender: "feminine", origin: "high-elf", era: "revival", context: "records", length: "short" },
    { stem: "zir", weight: 2, canonical: "Zira", rareVariants: ["Ziriel"], gender: "feminine", origin: "drow", era: "ancient", context: "ritual", length: "short" },
    { stem: "vyr", weight: 1, canonical: "Vyria", rareVariants: ["Vyrien"], gender: "feminine", origin: "drow", era: "ancient", context: "ritual", length: "medium" },
  ],
  neutral: [
    { stem: "el", weight: 10, canonical: "Elis", rareVariants: ["Elen"], gender: "neutral", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "aer", weight: 9, canonical: "Aeris", rareVariants: ["Aeron"], gender: "neutral", origin: "ancient-highborn", era: "ancient", context: "noble", length: "medium" },
    { stem: "lir", weight: 8, canonical: "Liren", rareVariants: ["Liris"], gender: "neutral", origin: "high-elf", era: "revival", context: "records", length: "medium" },
    { stem: "syl", weight: 7, canonical: "Sylen", rareVariants: ["Sylis"], gender: "neutral", origin: "wood-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "val", weight: 7, canonical: "Valis", rareVariants: ["Valen"], gender: "neutral", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "lor", weight: 6, canonical: "Loren", rareVariants: ["Loris"], gender: "neutral", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "rin", weight: 5, canonical: "Rin", rareVariants: ["Rinen"], gender: "neutral", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "sel", weight: 5, canonical: "Selis", rareVariants: ["Selen"], gender: "neutral", origin: "high-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "thal", weight: 4, canonical: "Thalen", rareVariants: ["Thalis"], gender: "neutral", origin: "ancient-highborn", era: "ancient", context: "noble", length: "medium" },
    { stem: "ver", weight: 3, canonical: "Veris", rareVariants: ["Veren"], gender: "neutral", origin: "high-elf", era: "revival", context: "records", length: "medium" },
    { stem: "tal", weight: 2, canonical: "Talen", rareVariants: ["Talis"], gender: "neutral", origin: "wood-elf", era: "contemporary", context: "common", length: "medium" },
    { stem: "fae", weight: 2, canonical: "Faen", rareVariants: ["Faeis"], gender: "neutral", origin: "wood-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "na", weight: 1, canonical: "Naen", rareVariants: ["Nais"], gender: "neutral", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "rae", weight: 1, canonical: "Raen", rareVariants: ["Raelis"], gender: "neutral", origin: "high-elf", era: "contemporary", context: "common", length: "short" },
    { stem: "il", weight: 1, canonical: "Ilen", rareVariants: ["Ilis"], gender: "neutral", origin: "high-elf", era: "revival", context: "records", length: "short" },
    { stem: "ae", weight: 1, canonical: "Aen", rareVariants: ["Aenis"], gender: "neutral", origin: "high-elf", era: "revival", context: "records", length: "short" },
    { stem: "zar", weight: 2, canonical: "Zaris", rareVariants: ["Zaren"], gender: "neutral", origin: "drow", era: "ancient", context: "ritual", length: "medium" },
    { stem: "vyr", weight: 1, canonical: "Vyris", rareVariants: ["Vyren"], gender: "neutral", origin: "drow", era: "ancient", context: "ritual", length: "medium" },
  ],
};

export const ELF_FAMILIES: ElfFamily[] = [
  {
    id: "high",
    weight: 1.0,
    givenRoots: ["Ae", "Ael", "Eli", "Rae", "Val", "Ser", "Ith", "Eir"],
    givenSuffixes: ["iel", "ion", "eth", "ae", "ir"],
    surnameRoots: [
      { value: "Silver", tags: ["silver", "light"], kind: "human" },
      { value: "Moon", tags: ["moon", "night"], kind: "human" },
      { value: "Lun", tags: ["moon"], kind: "fantasy" },
      { value: "Aestra", tags: ["star"], kind: "fantasy" },
    ],
    surnameSuffixes: ["glade", "spire", "driel", "lith"],
    semanticTags: ["moon", "silver", "star"],
    phoneticProfile: {
      vowels: ["ae", "ia", "ie", "ei"],
      consonants: ["l", "n", "r", "th", "s"],
      forbidden: ["sk", "gr", "kk", "aeae"],
      syllableRange: {
        short: [2, 2],
        medium: [2, 3],
        long: [3, 4],
      },
    },
    l1Tags: { origin: ["high-elf", "ancient-highborn"], era: ["ancient", "revival"] },
  },
  {
    id: "wood",
    weight: 1.0,
    givenRoots: ["Syl", "Wyn", "Fen", "Lor", "Thal", "Ril"],
    givenSuffixes: ["a", "ia", "wyn", "ith"],
    surnameRoots: [
      { value: "Leaf", tags: ["leaf", "wood"], kind: "human" },
      { value: "Dawn", tags: ["dawn"], kind: "human" },
      { value: "Eryn", tags: ["wood"], kind: "fantasy" },
      { value: "Thir", tags: ["thorn"], kind: "fantasy" },
    ],
    surnameSuffixes: ["shade", "glade", "brook", "wyn"],
    semanticTags: ["leaf", "wood", "dawn"],
    phoneticProfile: {
      vowels: ["y", "ai", "io"],
      consonants: ["l", "w", "n", "f", "r"],
      forbidden: ["sk", "gr", "kk", "aeae"],
      syllableRange: {
        short: [2, 2],
        medium: [2, 3],
        long: [3, 3],
      },
    },
    l1Tags: { origin: ["wood-elf"], nation: ["forest-realm"], era: ["contemporary"] },
  },
  {
    id: "drow",
    weight: 0.9,
    givenRoots: ["Z", "Dr", "Ny", "Xil", "Rax", "Vra"],
    givenSuffixes: ["ir", "or", "ith", "ra"],
    surnameRoots: [
      { value: "Nyx", tags: ["shadow", "night"], kind: "fantasy" },
      { value: "Vex", tags: ["shadow"], kind: "fantasy" },
      { value: "Dark", tags: ["shadow"], kind: "human" },
      { value: "Void", tags: ["void"], kind: "fantasy" },
    ],
    surnameSuffixes: ["thir", "vyr", "shade", "drel"],
    semanticTags: ["shadow", "night"],
    phoneticProfile: {
      vowels: ["i", "o", "a"],
      consonants: ["z", "x", "r", "d", "v"],
      forbidden: ["aeae", "ll", "nn"],
      syllableRange: {
        short: [2, 2],
        medium: [2, 3],
        long: [3, 3],
      },
    },
    l1Tags: { origin: ["drow"], era: ["ancient"] },
  },
];

export const ELF_POOLS: PoolsByLayer<string> = {
  gender: {
    masculine: ELF_LEXICON.gender.masculine.chunks ?? ["ar", "en", "or", "th", "mir"],
    feminine: ELF_LEXICON.gender.feminine.chunks ?? ["ith", "iel", "ia", "ael", "ly"],
    neutral: ELF_LEXICON.gender.neutral.chunks ?? ["el", "an", "in", "ae", "ryn"],
  },
  era: {
    ancient: ELF_LEXICON.era.ancient.chunks ?? ["ae", "th", "iel", "mir"],
    contemporary: ELF_LEXICON.era.contemporary.chunks ?? ["li", "na", "wen", "rin"],
    revival: ELF_LEXICON.era.revival.chunks ?? ["aer", "syl", "ith", "nor"],
  },
  style: {
    elegant: ELF_LEXICON.style.elegant.chunks ?? ["ae", "iel", "syl", "lith"],
    nature: ELF_LEXICON.style.nature.chunks ?? ["leaf", "moon", "wind", "dawn"],
    simple: ELF_LEXICON.style.simple.chunks ?? ["lin", "nar", "wen", "ril"],
  },
  origin: {
    "high-elf": ELF_LEXICON.origin["high-elf"].chunks ?? ["ae", "ael", "eli"],
    "ancient-highborn": ELF_LEXICON.origin["ancient-highborn"].chunks ?? ["ith", "eir", "cal"],
    "wood-elf": ELF_LEXICON.origin["wood-elf"].chunks ?? ["syl", "wyn", "fen"],
    drow: ELF_LEXICON.origin.drow.chunks ?? ["z", "dr", "ny"],
  },
  nation: {
    "ancient-high-kingdom": ELF_LEXICON.nation["ancient-high-kingdom"].chunks ?? ["ae", "ith", "val"],
    "forest-realm": ELF_LEXICON.nation["forest-realm"].chunks ?? ["syl", "wyn", "fen"],
    "coastal-elven-state": ELF_LEXICON.nation["coastal-elven-state"].chunks ?? ["mar", "lio", "na"],
    "isolated-mountain-enclave":
      ELF_LEXICON.nation["isolated-mountain-enclave"].chunks ?? ["kor", "dr", "bar"],
    "fallen-empire": ELF_LEXICON.nation["fallen-empire"].chunks ?? ["zar", "vor", "nyx"],
  },
  context: {
    noble: ELF_LEXICON.context.noble.chunks ?? ["ae", "val", "ser"],
    common: ELF_LEXICON.context.common.chunks ?? ["el", "an", "cal"],
    ritual: ELF_LEXICON.context.ritual.chunks ?? ["thae", "ith", "rae"],
    records: ELF_LEXICON.context.records.chunks ?? ["cal", "eir", "nor"],
  },
  form: {
    short: ELF_LEXICON.form.short.chunks ?? ["el", "an", "ia"],
    full: ELF_LEXICON.form.full.chunks ?? ["ae", "lia", "nor"],
    external: ELF_LEXICON.form.external.chunks ?? ["el", "ari", "lia"],
  },
  length: {
    short: baseChunks.slice(0, 8),
    medium: baseChunks.slice(8, 16),
    long: baseEndings.slice(0, 8),
  },
};

// ✅ Human-like name pools (given/surname are independent)
export const ELF_NAME_POOLS = {
  given: {
    // Phonetic roots for given names only
    phoneticRoots: [
      "ae",
      "el",
      "li",
      "na",
      "ra",
      "ri",
      "sa",
      "tha",
      "va",
      "wyn",
      "syl",
      "iel",
      "mir",
      "nor",
      "lith",
      "ria",
      "lor",
      "fen",
      "eir",
      "ael",
      "ser",
      "ith",
      "cal",
      "aer",
      "val",
      "lyn",
      "nia",
      "ila",
      "ara",
      "ven",
    ],
    // Slightly longer stems for given names only
    nameStems: [
      "Aelith",
      "Elar",
      "Lirien",
      "Naeris",
      "Sylan",
      "Thalia",
      "Valen",
      "Eiryn",
      "Rilith",
      "Seren",
      "Alar",
      "Elandra",
      "Lorien",
      "Neriel",
      "Rhaen",
      "Saelis",
      "Virel",
      "Arieth",
      "Calith",
      "Elion",
      "Faelar",
      "Ithiel",
      "Kaelis",
      "Lirael",
      "Myriel",
      "Nimor",
      "Raeven",
      "Tiriel",
      "Vaelin",
      "Yllar",
    ],
  },
  surname: {
    nouns: [
      "Moon",
      "Leaf",
      "Wind",
      "Star",
      "Dawn",
      "Mist",
      "Silver",
      "Glen",
      "River",
      "Shadow",
      "Light",
      "Bloom",
      "Song",
      "Vale",
      "Brook",
      "Grove",
      "Glade",
      "Frost",
      "Ember",
      "Thorn",
      "Sky",
      "Wild",
      "Stone",
      "Ash",
      "Sun",
      "Night",
      "Aurora",
      "Rain",
      "Willow",
      "Meadow",
    ],
    agents: [
      "watcher",
      "dancer",
      "runner",
      "weaver",
      "singer",
      "whisper",
      "keeper",
      "warden",
      "seeker",
      "rider",
      "hunter",
      "strider",
      "speaker",
      "shaper",
      "ward",
      "walker",
      "caller",
      "bloom",
      "warden",
      "glide",
      "shade",
      "spire",
      "bough",
      "crest",
      "fletch",
      "gaze",
      "brook",
      "glade",
      "gleam",
      "vale",
    ],
    adjs: [
      "Silver",
      "Golden",
      "Night",
      "Dawn",
      "Misty",
      "Elder",
      "Quiet",
      "Bright",
      "Lone",
      "Soft",
      "Wild",
      "Green",
      "Pale",
      "Blue",
      "Silent",
      "Shadow",
      "Moonlit",
      "Starry",
      "Winter",
      "Autumn",
      "Spring",
      "Summer",
      "Gentle",
      "Frost",
      "Ashen",
      "Sun",
      "Dusk",
      "Storm",
      "Willow",
      "River",
    ],
  },
};

export type GivenNameFamily = {
  id: string;
  weight: number;
  onsets: string[];
  nuclei: string[];
  codas: string[];
  suffixes: string[];
  bannedFragments?: string[];
  preferredBigrams?: string[];
};

export type SurnameFamily = {
  id: string;
  weight: number;
  prefixes: string[];
  roots: string[];
  suffixes: string[];
  compounds?: string[];
};

export type ElfBiasRule = {
  familyWeights?: Record<string, number>;
  onsetBoosts?: string[];
  nucleusBoosts?: string[];
  codaBoosts?: string[];
  suffixBoosts?: string[];
  preferredBigrams?: string[];
  bannedFragments?: string[];
  surnameFamilyAllow?: string[];
  surnameFamilyWeights?: Record<string, number>;
  suffixChanceBoost?: number;
  lengthPolicy?: { syllables?: readonly [number, number]; minLen?: number; maxLen?: number };
};

export const ELF_GIVEN_FAMILIES: GivenNameFamily[] = [
  {
    id: "high",
    weight: 1.2,
    onsets: ["l", "n", "r", "s", "th", "v", "m", "f", "h", "el", "ae", "ar", "al", "li", "ser", "val"],
    nuclei: ["a", "e", "i", "o", "u", "ae", "ia", "ie", "ei", "oa", "ui"],
    codas: ["", "l", "n", "r", "s", "th", "nd", "rn", "ll", "ss", "st"],
    suffixes: ["iel", "ia", "a", "eth", "ion", "or", "en", "ir", "el"],
    preferredBigrams: ["ae", "el", "ri", "ia", "th", "ll"],
  },
  {
    id: "wood",
    weight: 1.1,
    onsets: ["l", "w", "f", "th", "br", "fr", "s", "m", "n", "r", "el", "fa", "fen", "wyn", "lor"],
    nuclei: ["a", "e", "i", "o", "u", "ai", "ia", "io", "oa", "au", "y"],
    codas: ["", "n", "r", "l", "s", "th", "nd", "rn", "lth", "sh"],
    suffixes: ["wyn", "yth", "iel", "a", "en", "ia"],
    preferredBigrams: ["wa", "yn", "en", "th", "lo"],
  },
  {
    id: "drow",
    weight: 0.9,
    onsets: ["z", "x", "d", "dr", "v", "s", "n", "r", "t", "kr", "zr"],
    nuclei: ["a", "e", "i", "o", "u", "ia", "ei", "y"],
    codas: ["", "n", "r", "s", "th", "nd", "rn", "x"],
    suffixes: ["ir", "ith", "ra", "ryn", "drel", "vyr"],
    preferredBigrams: ["zr", "vr", "th", "ir"],
  },
  {
    id: "humanish",
    weight: 1.0,
    onsets: ["b", "d", "g", "l", "m", "n", "r", "s", "t", "w", "h", "br", "cr", "dr", "fr", "gr", "pr", "tr", "cl", "fl"],
    nuclei: ["a", "e", "i", "o", "u", "ea", "ie", "ai", "oi", "ou", "au"],
    codas: ["", "n", "r", "l", "s", "t", "nd", "rn", "rt", "st", "ck", "th"],
    suffixes: ["en", "an", "er", "el", "ia", "is", "on", "or"],
    preferredBigrams: ["st", "nd", "rn", "rl", "ll"],
  },
];

export const ELF_SURNAME_FAMILIES: SurnameFamily[] = [
  {
    id: "englishySurname",
    weight: 1.2,
    prefixes: ["", "", "", ""],
    roots: [
      "Moon",
      "Silver",
      "Star",
      "Dawn",
      "Night",
      "Sun",
      "Wind",
      "Mist",
      "Shadow",
      "River",
      "Glen",
      "Vale",
      "Thorn",
      "Glimmer",
      "Bright",
      "Winter",
      "Summer",
      "Sky",
      "Gold",
      "Gem",
    ],
    suffixes: ["whisper", "frond", "bloom", "blossom", "breeze", "flower", "brook", "glen", "vale", "crest", "shade", "song"],
    compounds: ["watcher", "ward", "dell", "spire", "tracker"],
  },
  {
    id: "elfySurname",
    weight: 1.0,
    prefixes: ["Tel", "Gal", "Lae", "Ael", "Sil", "Mor", "Thal", "El", "Fae"],
    roots: ["Moon", "Leaf", "Lune", "Briar", "Night", "Silver", "Mist", "Shadow", "Glen", "Thorn", "Star", "Dawn"],
    suffixes: ["whisper", "frond", "bloom", "blossom", "glade", "wyn", "lith", "riel", "song", "breeze"],
    compounds: ["crest", "dell", "spire"],
  },
];

export const ELF_BIASES = {
  nation: {
    "ancient-high-kingdom": {
      familyWeights: { high: 1.5 },
      suffixBoosts: ["iel", "eth", "ion"],
      surnameFamilyAllow: ["elfySurname"],
    },
    "forest-realm": {
      familyWeights: { wood: 1.4 },
      onsetBoosts: ["w", "f", "th", "l"],
      surnameFamilyAllow: ["englishySurname", "elfySurname"],
    },
    "coastal-elven-state": {
      familyWeights: { humanish: 1.2 },
      nucleusBoosts: ["ea", "ie", "ai"],
      surnameFamilyAllow: ["englishySurname"],
    },
    "isolated-mountain-enclave": {
      familyWeights: { humanish: 1.1 },
      onsetBoosts: ["gr", "br", "dr"],
      surnameFamilyAllow: ["englishySurname"],
    },
    "fallen-empire": {
      familyWeights: { drow: 1.4, high: 0.9 },
      suffixBoosts: ["ith", "ir"],
      surnameFamilyAllow: ["elfySurname"],
    },
  },
  origin: {
    "high-elf": {
      familyWeights: { high: 1.6 },
      suffixBoosts: ["iel", "eth", "ion", "ia"],
      preferredBigrams: ["ae", "el", "ia", "th"],
    },
    "ancient-highborn": {
      familyWeights: { high: 1.5 },
      suffixBoosts: ["iel", "ion", "eth"],
      preferredBigrams: ["ae", "ei", "th"],
    },
    "wood-elf": {
      familyWeights: { wood: 1.6 },
      onsetBoosts: ["w", "f", "th", "l"],
      suffixBoosts: ["wyn", "yth"],
    },
    drow: {
      familyWeights: { drow: 1.8 },
      onsetBoosts: ["z", "x", "dr"],
      suffixBoosts: ["ith", "ir", "vyr"],
    },
  },
  era: {
    ancient: {
      suffixBoosts: ["iel", "eth", "ion"],
      lengthPolicy: { syllables: [2, 3] },
    },
    contemporary: {
      familyWeights: { humanish: 1.3 },
      suffixBoosts: ["en", "an", "er"],
      lengthPolicy: { syllables: [1, 2] },
    },
    revival: {
      suffixBoosts: ["iel", "ia", "ir"],
    },
  },
  gender: {
    feminine: {
      suffixBoosts: ["a", "ia", "iel", "eth"],
      nucleusBoosts: ["a", "e", "ia", "ie"],
    },
    masculine: {
      suffixBoosts: ["or", "an", "ir", "en"],
      nucleusBoosts: ["o", "a", "e"],
    },
    neutral: {
      suffixBoosts: ["en", "el", "is"],
      nucleusBoosts: ["e", "i"],
    },
  },
  context: {
    noble: {
      suffixBoosts: ["iel", "eth", "ion"],
      surnameFamilyAllow: ["elfySurname"],
      suffixChanceBoost: 0.15,
    },
    common: {
      suffixBoosts: ["en", "an"],
      surnameFamilyAllow: ["englishySurname"],
    },
    ritual: {
      suffixBoosts: ["iel", "ion"],
      preferredBigrams: ["ae", "th"],
      suffixChanceBoost: 0.2,
    },
    records: {
      suffixBoosts: ["en", "el"],
      surnameFamilyAllow: ["englishySurname"],
    },
  },
  form: {
    short: {
      lengthPolicy: { syllables: [1, 2] },
      suffixBoosts: ["en", "an"],
    },
    full: {
      lengthPolicy: { syllables: [2, 3] },
      suffixBoosts: ["iel", "ion", "eth"],
      suffixChanceBoost: 0.1,
    },
    external: {
      familyWeights: { humanish: 1.5 },
      preferredBigrams: ["st", "nd", "rn", "rl", "ll"],
      lengthPolicy: { syllables: [1, 2] },
    },
  },
  style: {
    elegant: {
      nucleusBoosts: ["ae", "ia", "ie", "ei"],
      suffixBoosts: ["iel", "eth", "ion"],
    },
    nature: {
      onsetBoosts: ["w", "l", "n", "r", "f"],
      suffixBoosts: ["wyn", "leaf", "wood"],
    },
    simple: {
      familyWeights: { humanish: 1.4 },
      lengthPolicy: { syllables: [1, 2] },
      suffixBoosts: ["en", "el"],
    },
  },
  length: {
    short: { lengthPolicy: { syllables: [1, 1], minLen: 4, maxLen: 6 } },
    medium: { lengthPolicy: { syllables: [2, 2], minLen: 6, maxLen: 8 } },
    long: { lengthPolicy: { syllables: [2, 3], minLen: 8, maxLen: 10 } },
  },
} as const;

export const ELF_SUFFIX_TRACK = ["ith", "yl", "wen", "iel", "ion", "ria", "ra", "en", "an", "ir", "or", "wyn", "eth", "el"];
