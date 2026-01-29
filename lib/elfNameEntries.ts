export type NameEntry = {
  name: string;
  gender: "masculine" | "feminine" | "neutral";
  origin: "high" | "wood" | "drow";
  era: "ancient" | "revival";
  context: "common" | "noble" | "ritual" | "records";
  form: "everyday" | "formal" | "outsider";
  style: "elegant" | "nature" | "simple";
  nation?: "ancient-high-kingdom" | "forest-realm" | "coastal-elven-state" | "isolated-mountain-enclave" | "fallen-empire";
  weight: number;
};

const FORBIDDEN = /qw|jh|vk|yy|ii/i;

function hasTripleSame(value: string) {
  return /(.)\1\1/i.test(value);
}

function toTitle(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function isValidName(name: string) {
  if (FORBIDDEN.test(name)) return false;
  if (hasTripleSame(name)) return false;
  if (name.toLowerCase() === name) return false;
  return true;
}

function makeNames(
  stems: string[],
  endings: string[],
  count: number,
  used: Set<string>
) {
  const names: string[] = [];
  for (const stem of stems) {
    for (const ending of endings) {
      if (names.length >= count) return names;
      const candidate = toTitle(`${stem}${ending}`);
      if (!isValidName(candidate)) continue;
      if (used.has(candidate)) continue;
      used.add(candidate);
      names.push(candidate);
    }
  }
  return names;
}


const usedNames = new Set<string>();
const entries: NameEntry[] = [];

function pushSeedEntries(
  names: string[],
  tags: Omit<NameEntry, "name" | "weight">
) {
  const weight = 10;
  for (const name of names) {
    const candidate = toTitle(name.trim());
    if (!isValidName(candidate)) continue;
    if (usedNames.has(candidate)) continue;
    usedNames.add(candidate);
    entries.push({
      name: candidate,
      weight,
      ...tags,
    });
  }
}

const ELF_SEED_GROUPS: Array<{
  nation: NameEntry["nation"];
  origin: NameEntry["origin"];
  era: NameEntry["era"];
  names: string[];
}> = [
  {
    nation: "ancient-high-kingdom",
    origin: "high",
    era: "ancient",
    names: [
      "Aelthirion","Elarion","Saelendor","Thalorien","Elendir","Faelion","Aeryndor","Elithar",
      "Lorandel","Calethir","Ithilren","Aelmir","Eryndal","Thiravel","Althorien","Silandor",
      "Aelcarin","Elorath","Faelarion","Ilyndor","Elandris","Thalinar","Aerendil","Elthorien",
      "Lorathiel","Saelith","Calendir","Aelithor","Elanthal","Thirion",
      "Aelrion","Erythil","Faelthir","Ilandor","Thalorienn","Elisar","Aerendilion","Lorandir",
      "Calithor","Aelindor","Eltharion","Silendir","Thiravelor","Aelorin","Elandor","Faelor",
      "Ithilion","Lorendil","Saelion","Calithren","Aelthorin","Elirand",
    ],
  },
  {
    nation: "forest-realm",
    origin: "wood",
    era: "revival",
    names: [
      "Lirien","Faela","Eryni","Sylwen","Thyraen","Elwyn","Caelys","Ilyra","Saelin","Wyneth",
      "Lethar","Faerin","Eryla","Silvae","Thalen","Elira","Caelin","Ilyen","Saeril","Wynra",
      "Lorien","Faelae","Erynd","Sylrin","Thylen","Elwynne","Caelyr","Ilyraen","Saelith",
      "Wynel","Liriel","Faenor","Erynis","Silren","Thalara","Elwynar","Caelith","Ilyndra",
      "Saelor","Wynith","Lethiel","Faelaith","Erylen","Sylara","Thyriel","Elorin",
      "Caelwyn","Ilyriel","Saelwen","Wynelor","Lorienn","Faerith","Eryndel","Sylorien",
    ],
  },
  {
    nation: "coastal-elven-state",
    origin: "high",
    era: "revival",
    names: [
      "Aeralis","Neriel","Thalassar","Elysea","Caerion","Mariel","Saereth","Ithalis","Pelion",
      "Aelora","Nerys","Thalorin","Elyndar","Caelios","Marisel","Saelinor","Ithalor",
      "Pelaris","Aeralyn","Neritha","Thalessa","Elyra","Caerith","Marielis","Saerion",
      "Ithalyn","Pelionis","Aelaris","Nerynd","Thalorien","Elysea","Caelaris","Marith",
      "Saeriel","Itharion","Pelindra","Aeralis","Nerel","Thalyn","Elyndar","Caerelis",
      "Mariel","Saereth","Ithalis","Pelion","Aelora","Nerys","Thalorin","Elyra",
    ],
  },
  {
    nation: "fallen-empire",
    origin: "drow",
    era: "ancient",
    names: [
      "Zerath","Moriel","Thraedis","Velkyn","Drasiel","Xelthar","Narion","Vaelris","Ulthir",
      "Zyrael","Morath","Threxil","Velorin","Draveth","Xelyra","Narith","Vaelor","Ulther",
      "Zeral","Morith","Thraen","Velthir","Drasyn","Xelorin","Nariel","Vaelth","Ulthyn",
      "Zyrel","Morinel","Threxor","Velaryn","Drathis","Xelthyn","Narorin","Vaelis",
      "Ulthar","Zerith","Moriel","Thraedis","Velkyn","Drasiel","Xelthar","Narion",
      "Vaelris","Ulthir","Zyrael","Morath","Threxil","Velorin","Draveth","Xelyra",
    ],
  },
  {
    nation: "isolated-mountain-enclave",
    origin: "high",
    era: "revival",
    names: [
      "Brinel","Kareth","Thornel","Aldrin","Morik","Helryn","Stelion","Durath","Keldor","Arven",
      "Bryneth","Karion","Thorin","Aldrel","Morin","Helrath","Stelar","Durion","Kelthar",
      "Arvend","Brinor","Karethin","Thornis","Aldrith","Moriel","Helrion","Stelrin",
      "Durathen","Keldrin","Arvenor",
    ],
  },
];

for (const group of ELF_SEED_GROUPS) {
  pushSeedEntries(group.names, {
    gender: "neutral",
    origin: group.origin,
    era: group.era,
    context: "records",
    form: "formal",
    style: "elegant",
    nation: group.nation,
  });
}

const ENDINGS_MASC_ANCIENT = ["en", "ion", "or", "ar", "eth", "ir", "on"];
const ENDINGS_MASC_REVIVAL = ["en", "or", "ar", "el", "eth", "ir", "on"];
const ENDINGS_FEM_ANCIENT = ["a", "ia", "iel", "ina", "ara", "ela", "ira"];
const ENDINGS_FEM_REVIVAL = ["a", "ia", "iel", "ina", "ena", "ela", "ira"];
const ENDINGS_FEM_FORMAL = ["ielle", "ienne", "essa", "oria", "aera", "elyn"];
const ENDINGS_NEU_ANCIENT = ["en", "is", "on", "el", "ir", "an"];
const ENDINGS_NEU_REVIVAL = ["en", "is", "el", "an", "on", "ir"];
const ENDINGS_MASC_NOBLE = ["ael", "aer", "iel", "ion", "ior", "aris"];
const ENDINGS_MASC_RITUAL = ["ethar", "ithar", "aeth", "amir", "orion", "ielor"];
const ENDINGS_MASC_RECORDS = ["anor", "elor", "edon", "aris", "amir", "eron"];
const ENDINGS_MASC_NATURE = ["wyn", "lorn", "bryn", "glen", "rion", "thorn"];
const ENDINGS_MASC_OUTSIDER = ["an", "en", "el", "er", "in", "on"];
const ENDINGS_FEM_NOBLE = ["ielle", "ienne", "essa", "oria", "aera", "elyn"];
const ENDINGS_FEM_RITUAL = ["ethia", "ithia", "myra", "oriah", "aesha", "elith"];
const ENDINGS_FEM_RECORDS = ["aria", "elira", "ionna", "essae", "aenya", "elyra"];
const ENDINGS_FEM_NATURE = ["wyn", "lira", "thiel", "lith", "sylva", "flora"];
const ENDINGS_FEM_OUTSIDER = ["ana", "ena", "elle", "ine", "ira", "ila"];
const ENDINGS_NEU_NOBLE = ["ael", "aer", "iel", "ior", "eon", "aris"];
const ENDINGS_NEU_RITUAL = ["eth", "ith", "mir", "aeth", "orim", "diel"];
const ENDINGS_NEU_RECORDS = ["enor", "elis", "eron", "aeris", "orin", "arion"];
const ENDINGS_NEU_NATURE = ["wyn", "lith", "bryn", "glen", "syl", "thorn"];
const ENDINGS_NEU_OUTSIDER = ["en", "el", "in", "on", "an", "er"];

const HIGH_ANCIENT_MASC_STEMS = [
  "Aer",
  "Ael",
  "Thal",
  "Lor",
  "Val",
  "Cal",
  "Ser",
  "Ith",
  "Rae",
  "Lir",
  "Nael",
  "Sael",
  "Mael",
  "Cael",
  "Aen",
  "Ery",
  "Eld",
  "Tir",
  "Var",
  "Nor",
];
const HIGH_ANCIENT_FEM_STEMS = [
  "Elin",
  "Ael",
  "Aer",
  "Lir",
  "Rael",
  "Ser",
  "Thal",
  "Val",
  "Cael",
  "Maer",
  "Sael",
  "Nael",
  "Eri",
  "Iri",
  "Lir",
  "Mir",
  "Ner",
  "Syl",
  "Thi",
  "Vel",
];
const HIGH_ANCIENT_NEU_STEMS = [
  "Aer",
  "Ael",
  "Thal",
  "Lor",
  "Val",
  "Cal",
  "Ser",
  "Lir",
  "Nael",
  "Sael",
  "Mael",
  "Cael",
  "Elen",
  "Rin",
  "Tir",
  "Ver",
  "Sel",
  "Tal",
  "Aerin",
  "Ery",
];

const HIGH_REVIVAL_MASC_STEMS = [
  "El",
  "Eli",
  "Ael",
  "Ari",
  "Lor",
  "Val",
  "Cal",
  "Ser",
  "Mer",
  "Ner",
  "Sael",
  "Rael",
  "Fael",
  "Leor",
  "Talen",
  "Eren",
  "Cair",
  "Alen",
  "Daren",
  "Galen",
];
const HIGH_REVIVAL_FEM_STEMS = [
  "Elin",
  "Elir",
  "Ael",
  "Aer",
  "Lin",
  "Ren",
  "Fael",
  "Saer",
  "Mir",
  "Ner",
  "Ser",
  "Syl",
  "Thal",
  "Val",
  "Cal",
  "Ely",
  "Ariel",
  "Lier",
  "Nael",
  "Rael",
];
const HIGH_REVIVAL_NEU_STEMS = [
  "Elen",
  "Elis",
  "Aeris",
  "Liren",
  "Rin",
  "Selen",
  "Valen",
  "Calen",
  "Merin",
  "Nerin",
  "Aelin",
  "Faen",
  "Talen",
  "Verin",
  "Saelen",
  "Lorin",
  "Eryen",
  "Naen",
  "Saren",
  "Loren",
];

const WOOD_ANCIENT_MASC_STEMS = [
  "Syl",
  "Fen",
  "Wyn",
  "Ril",
  "Thyr",
  "Fael",
  "Lys",
  "Eryn",
  "Bryn",
  "Tarin",
  "Mora",
  "Rowen",
  "Gwyn",
  "Leth",
  "Kern",
  "Ther",
  "Fenn",
  "Ryn",
  "Cair",
  "Halin",
];
const WOOD_ANCIENT_FEM_STEMS = [
  "Syl",
  "Fen",
  "Wyn",
  "Ril",
  "Thyr",
  "Fael",
  "Lys",
  "Eryn",
  "Bryn",
  "Tar",
  "Mor",
  "Rowen",
  "Gwyn",
  "Leth",
  "Kir",
  "Ther",
  "Fenn",
  "Ryn",
  "Cair",
  "Hal",
];
const WOOD_ANCIENT_NEU_STEMS = [
  "Sylen",
  "Fenn",
  "Wyn",
  "Rilen",
  "Thyr",
  "Faen",
  "Lysen",
  "Eryn",
  "Bryn",
  "Tarin",
  "Moren",
  "Rowen",
  "Gwyn",
  "Leth",
  "Kern",
  "Ther",
  "Fenn",
  "Ryn",
  "Cairn",
  "Halen",
];

const WOOD_REVIVAL_MASC_STEMS = [
  "Syl",
  "Fen",
  "Wyn",
  "Ril",
  "Fael",
  "Eryn",
  "Bryn",
  "Rowen",
  "Gwyn",
  "Leth",
  "Tarin",
  "Maren",
  "Loran",
  "Faren",
  "Riven",
  "Thalen",
  "Calen",
  "Saren",
  "Noren",
  "Halden",
];
const WOOD_REVIVAL_FEM_STEMS = [
  "Syl",
  "Fen",
  "Wyn",
  "Ril",
  "Fael",
  "Eryn",
  "Bryn",
  "Rowen",
  "Gwyn",
  "Leth",
  "Tar",
  "Maren",
  "Lor",
  "Far",
  "Rin",
  "Thal",
  "Cal",
  "Sar",
  "Nor",
  "Hal",
];
const WOOD_REVIVAL_NEU_STEMS = [
  "Sylen",
  "Fenin",
  "Wyn",
  "Rilen",
  "Faen",
  "Eryn",
  "Bryn",
  "Rowen",
  "Gwyn",
  "Leth",
  "Tarin",
  "Maren",
  "Lorin",
  "Faren",
  "Rinen",
  "Thalen",
  "Calen",
  "Saren",
  "Noren",
  "Halen",
];

const DROW_ANCIENT_MASC_STEMS = [
  "Zar",
  "Vyr",
  "Xil",
  "Nyx",
  "Dris",
  "Zel",
  "Vex",
  "Syr",
  "Vel",
  "Ryl",
  "Zor",
  "Kyr",
  "Drael",
  "Xar",
  "Vor",
  "Zyn",
  "Voren",
  "Xerin",
  "Draven",
  "Zarek",
];
const DROW_ANCIENT_FEM_STEMS = [
  "Zir",
  "Vyr",
  "Xil",
  "Nyx",
  "Dris",
  "Zel",
  "Vex",
  "Syr",
  "Vel",
  "Ryl",
  "Zor",
  "Kyr",
  "Drael",
  "Xar",
  "Vor",
  "Zyn",
  "Vyren",
  "Xer",
  "Dran",
  "Zar",
];
const DROW_ANCIENT_NEU_STEMS = [
  "Zar",
  "Vyr",
  "Xil",
  "Nyx",
  "Dris",
  "Zel",
  "Vex",
  "Syr",
  "Vel",
  "Ryl",
  "Zor",
  "Kyr",
  "Draen",
  "Xar",
  "Vor",
  "Zyn",
  "Vyren",
  "Xer",
  "Draven",
  "Zarek",
];

const DROW_REVIVAL_MASC_STEMS = [
  "Zar",
  "Vyr",
  "Xil",
  "Dris",
  "Zel",
  "Syr",
  "Vel",
  "Ryl",
  "Zor",
  "Kyr",
  "Drael",
  "Xar",
  "Vor",
  "Zyn",
  "Voren",
];
const DROW_REVIVAL_FEM_STEMS = [
  "Zir",
  "Vyr",
  "Xil",
  "Dris",
  "Zel",
  "Syr",
  "Vel",
  "Ryl",
  "Zor",
  "Kyr",
  "Drael",
  "Xar",
  "Vor",
  "Zyn",
  "Vyren",
];
const DROW_REVIVAL_NEU_STEMS = [
  "Zar",
  "Vyr",
  "Xil",
  "Dris",
  "Zel",
  "Syr",
  "Vel",
  "Ryl",
  "Zor",
  "Kyr",
  "Draen",
  "Xar",
  "Vor",
  "Zyn",
  "Vyren",
];

function pushGroupFixed(
  stems: string[],
  endings: string[],
  count: number,
  tags: Omit<NameEntry, "name" | "weight">
) {
  const names = makeNames(stems, endings, count, usedNames);
  const commonCutoff = Math.floor(names.length * 0.2);
  const midCutoff = Math.floor(names.length * 0.6);
  names.forEach((name, i) => {
    const weight = i < commonCutoff ? 12 : i < midCutoff ? 6 : 2;
    entries.push({
      name,
      gender: tags.gender,
      origin: tags.origin,
      era: tags.era,
      context: tags.context,
      form: tags.form,
      style: tags.style,
      weight,
    });
  });
}

const BASE_GROUPS = [
  { stems: HIGH_ANCIENT_MASC_STEMS, endings: ENDINGS_MASC_ANCIENT, count: 35, gender: "masculine", origin: "high", era: "ancient" },
  { stems: HIGH_ANCIENT_FEM_STEMS, endings: ENDINGS_FEM_ANCIENT, count: 35, gender: "feminine", origin: "high", era: "ancient" },
  { stems: HIGH_ANCIENT_NEU_STEMS, endings: ENDINGS_NEU_ANCIENT, count: 20, gender: "neutral", origin: "high", era: "ancient" },
  { stems: HIGH_REVIVAL_MASC_STEMS, endings: ENDINGS_MASC_REVIVAL, count: 50, gender: "masculine", origin: "high", era: "revival" },
  { stems: HIGH_REVIVAL_FEM_STEMS, endings: ENDINGS_FEM_REVIVAL, count: 50, gender: "feminine", origin: "high", era: "revival" },
  { stems: HIGH_REVIVAL_NEU_STEMS, endings: ENDINGS_NEU_REVIVAL, count: 20, gender: "neutral", origin: "high", era: "revival" },
  { stems: WOOD_ANCIENT_MASC_STEMS, endings: ENDINGS_MASC_ANCIENT, count: 22, gender: "masculine", origin: "wood", era: "ancient" },
  { stems: WOOD_ANCIENT_FEM_STEMS, endings: ENDINGS_FEM_ANCIENT, count: 22, gender: "feminine", origin: "wood", era: "ancient" },
  { stems: WOOD_ANCIENT_NEU_STEMS, endings: ENDINGS_NEU_ANCIENT, count: 16, gender: "neutral", origin: "wood", era: "ancient" },
  { stems: WOOD_REVIVAL_MASC_STEMS, endings: ENDINGS_MASC_REVIVAL, count: 35, gender: "masculine", origin: "wood", era: "revival" },
  { stems: WOOD_REVIVAL_FEM_STEMS, endings: ENDINGS_FEM_REVIVAL, count: 35, gender: "feminine", origin: "wood", era: "revival" },
  { stems: WOOD_REVIVAL_NEU_STEMS, endings: ENDINGS_NEU_REVIVAL, count: 20, gender: "neutral", origin: "wood", era: "revival" },
  { stems: DROW_ANCIENT_MASC_STEMS, endings: ENDINGS_MASC_ANCIENT, count: 22, gender: "masculine", origin: "drow", era: "ancient" },
  { stems: DROW_ANCIENT_FEM_STEMS, endings: ENDINGS_FEM_ANCIENT, count: 22, gender: "feminine", origin: "drow", era: "ancient" },
  { stems: DROW_ANCIENT_NEU_STEMS, endings: ENDINGS_NEU_ANCIENT, count: 16, gender: "neutral", origin: "drow", era: "ancient" },
  { stems: DROW_REVIVAL_MASC_STEMS, endings: ENDINGS_MASC_REVIVAL, count: 20, gender: "masculine", origin: "drow", era: "revival" },
  { stems: DROW_REVIVAL_FEM_STEMS, endings: ENDINGS_FEM_REVIVAL, count: 20, gender: "feminine", origin: "drow", era: "revival" },
  { stems: DROW_REVIVAL_NEU_STEMS, endings: ENDINGS_NEU_REVIVAL, count: 10, gender: "neutral", origin: "drow", era: "revival" },
];

BASE_GROUPS.forEach((group) => {
  pushGroupFixed(group.stems, group.endings, group.count, {
    gender: group.gender as NameEntry["gender"],
    origin: group.origin as NameEntry["origin"],
    era: group.era as NameEntry["era"],
    context: "common",
    form: "everyday",
    style: "simple",
  });
});

const ADVANCED_COUNTS = {
  noble: 10,
  ritual: 8,
  records: 8,
  nature: 8,
  outsider: 8,
};

BASE_GROUPS.forEach((group) => {
  const gender = group.gender as NameEntry["gender"];
  const origin = group.origin as NameEntry["origin"];
  const era = group.era as NameEntry["era"];
  const isMasc = gender === "masculine";
  const isFem = gender === "feminine";
  const isNeu = gender === "neutral";
  const nobleEndings = isMasc
    ? ENDINGS_MASC_NOBLE
    : isFem
      ? ENDINGS_FEM_NOBLE
      : ENDINGS_NEU_NOBLE;
  const ritualEndings = isMasc
    ? ENDINGS_MASC_RITUAL
    : isFem
      ? ENDINGS_FEM_RITUAL
      : ENDINGS_NEU_RITUAL;
  const recordsEndings = isMasc
    ? ENDINGS_MASC_RECORDS
    : isFem
      ? ENDINGS_FEM_RECORDS
      : ENDINGS_NEU_RECORDS;
  const natureEndings = isMasc
    ? ENDINGS_MASC_NATURE
    : isFem
      ? ENDINGS_FEM_NATURE
      : ENDINGS_NEU_NATURE;
  const outsiderEndings = isMasc
    ? ENDINGS_MASC_OUTSIDER
    : isFem
      ? ENDINGS_FEM_OUTSIDER
      : ENDINGS_NEU_OUTSIDER;

  pushGroupFixed(group.stems, nobleEndings, ADVANCED_COUNTS.noble, {
    gender,
    origin,
    era,
    context: "noble",
    form: "formal",
    style: "elegant",
  });
  pushGroupFixed(group.stems, ritualEndings, ADVANCED_COUNTS.ritual, {
    gender,
    origin,
    era,
    context: "ritual",
    form: "formal",
    style: "elegant",
  });
  pushGroupFixed(group.stems, recordsEndings, ADVANCED_COUNTS.records, {
    gender,
    origin,
    era,
    context: "records",
    form: "formal",
    style: "elegant",
  });
  pushGroupFixed(group.stems, natureEndings, ADVANCED_COUNTS.nature, {
    gender,
    origin,
    era,
    context: "common",
    form: "everyday",
    style: "nature",
  });
  pushGroupFixed(group.stems, outsiderEndings, ADVANCED_COUNTS.outsider, {
    gender,
    origin,
    era,
    context: "common",
    form: "outsider",
    style: "simple",
  });
});

export const ELF_NAME_ENTRIES: NameEntry[] = entries;
