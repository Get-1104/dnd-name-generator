export type LexiconStructure = {
  chunks: number;
  ending: boolean;
};

export type LexiconRule = {
  chunks?: string[];
  endings?: string[];
  avoidChunks?: string[];
  avoidPrefixes?: string[];
  avoidEndings?: string[];
  structures?: LexiconStructure[];
  requireChunk?: boolean;
  requireEnding?: boolean;
};

export type ElfLexicon = {
  base: Required<Pick<LexiconRule, "chunks" | "endings">> & {
    avoidPrefixes: string[];
  };
  nation: Record<string, LexiconRule>;
  origin: Record<"high-elf" | "ancient-highborn" | "wood-elf" | "drow", LexiconRule>;
  era: Record<"ancient" | "contemporary" | "revival", LexiconRule>;
  gender: Record<"masculine" | "feminine" | "neutral", LexiconRule>;
  context: Record<"noble" | "common" | "ritual" | "records", LexiconRule>;
  form: Record<"short" | "full" | "external", LexiconRule>;
  style: Record<"elegant" | "nature" | "simple", LexiconRule>;
  length: Record<"short" | "medium" | "long", { min: number; max: number } & LexiconRule>;
};

export const ELF_LEXICON: ElfLexicon = {
  base: {
    chunks: [
      "Ae",
      "Ael",
      "Eli",
      "Lia",
      "Syl",
      "Fa",
      "Tha",
      "Ari",
      "Ili",
      "Ely",
      "Nae",
      "Iri",
      "Lau",
      "Vae",
      "Shae",
      "Thi",
      "El",
      "Il",
      "Ri",
      "Sa",
      "Va",
      "Lo",
      "Mir",
      "Nor",
      "Ril",
      "Ser",
      "Tin",
      "Val",
      "Yl",
      "Aer",
      "Lor",
      "Fen",
      "Wyn",
      "Thal",
      "Lys",
      "Rae",
      "Ith",
      "An",
      "Cal",
    ],
    endings: [
      "a",
      "ia",
      "iel",
      "wyn",
      "lith",
      "nor",
      "riel",
      "mir",
      "lune",
      "dor",
      "th",
      "eth",
      "ion",
      "or",
      "ir",
      "ar",
      "en",
      "ae",
      "is",
    ],
    avoidPrefixes: ["aeae", "aaa", "ee"],
  },
  nation: {
    "ancient-high-kingdom": {
      chunks: ["Ae", "Ith", "Val", "Thae", "Eir", "Ser", "Cal"],
      endings: ["iel", "ion", "eth", "a"],
      avoidChunks: ["Gr", "Zug"],
      requireEnding: true,
    },
    "forest-realm": {
      chunks: ["Syl", "Wyn", "Fen", "Lor", "Leaf", "Thal", "Ril"],
      endings: ["a", "ia", "wyn", "lith"],
      requireChunk: true,
    },
    "coastal-elven-state": {
      chunks: ["Mar", "Lio", "Na", "Sea", "Tis", "Cor", "Pel"],
      endings: ["a", "ia", "is", "en"],
      requireChunk: true,
    },
    "isolated-mountain-enclave": {
      chunks: ["Kor", "Dr", "Bar", "Grim", "Ul", "Kra"],
      endings: ["or", "ar", "th"],
      requireEnding: true,
    },
    "fallen-empire": {
      chunks: ["Zar", "Vor", "Nyx", "Rax", "Dra", "Xil"],
      endings: ["ir", "or", "eth"],
      requireEnding: true,
    },
  },
  origin: {
    "high-elf": {
      chunks: ["Ae", "Ael", "Eli", "Rae", "Val", "Ser"],
      endings: ["iel", "ia", "eth"],
      requireEnding: true,
    },
    "ancient-highborn": {
      chunks: ["Ith", "Eir", "Cal", "Thae", "Val"],
      endings: ["ion", "eth", "iel"],
      requireEnding: true,
    },
    "wood-elf": {
      chunks: ["Syl", "Wyn", "Fen", "Lor", "Leaf", "Thal"],
      endings: ["a", "ia", "wyn"],
      requireChunk: true,
    },
    drow: {
      chunks: ["Z", "Dr", "Ny", "Xil", "Rax", "Vra"],
      endings: ["ir", "or", "th"],
      requireEnding: true,
    },
  },
  era: {
    ancient: {
      chunks: ["Ae", "Ith", "Val", "Eir"],
      endings: ["eth", "ion", "iel"],
      structures: [{ chunks: 3, ending: true }, { chunks: 2, ending: true }],
      requireEnding: true,
    },
    contemporary: {
      chunks: ["Eli", "Lia", "Ril", "Nor"],
      endings: ["a", "ia", "en"],
      structures: [{ chunks: 2, ending: true }],
    },
    revival: {
      chunks: ["Thal", "Ser", "Cal", "Lys"],
      endings: ["eth", "ir"],
      structures: [{ chunks: 2, ending: true }],
      requireEnding: true,
    },
  },
  gender: {
    masculine: {
      chunks: ["Dar", "Kor", "Ror", "Var"],
      endings: ["or", "ar", "ir", "th"],
      requireEnding: true,
      requireChunk: true,
    },
    feminine: {
      chunks: ["Lia", "Rae", "Eli", "Nae"],
      endings: ["a", "ia", "iel"],
      requireEnding: true,
      requireChunk: true,
    },
    neutral: {
      chunks: ["Ely", "Iri", "Ser", "Val"],
      endings: ["en", "is", "ae"],
      requireChunk: true,
    },
  },
  context: {
    noble: { chunks: ["Ae", "Val", "Ser"], structures: [{ chunks: 2, ending: true }] },
    common: {},
    ritual: { chunks: ["Thae", "Ith", "Rae"], structures: [{ chunks: 3, ending: true }] },
    records: { chunks: ["Cal", "Eir", "Nor"], structures: [{ chunks: 2, ending: true }] },
  },
  form: {
    short: { structures: [{ chunks: 1, ending: true }, { chunks: 1, ending: false }] },
    full: { structures: [{ chunks: 2, ending: true }, { chunks: 3, ending: true }] },
    external: {
      chunks: ["El", "Ari", "Lia", "Nor", "Sa", "Va"],
      endings: ["a", "en", "ia"],
      structures: [{ chunks: 2, ending: true }],
    },
  },
  style: {
    elegant: { chunks: ["Ae", "Eli", "Rae", "Lys"], endings: ["iel", "ia"] },
    nature: { chunks: ["Leaf", "Wyn", "Fen", "Lor"], endings: ["a", "wyn"] },
    simple: { chunks: ["El", "An", "Cal"], endings: ["a", "en"] },
  },
  length: {
    short: { min: 3, max: 6 },
    medium: { min: 6, max: 9 },
    long: { min: 9, max: 13 },
  },
};
