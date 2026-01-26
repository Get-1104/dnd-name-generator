export type RaceSlug =
  | "human"
  | "elf"
  | "dwarf"
  | "halfling"
  | "gnome"
  | "half-elf"
  | "half-orc"
  | "dragonborn"
  | "tiefling"
  | "orc"
  | "angel"
  | "demon"
  | "eastern"
  | "goblin";

export interface NamingRuleConfig {
  raceLabel: string;
  default: {
    title?: string;
    paragraphs: string[];
  };
  advanced: {
    title?: string;
    paragraphs: string[];
  };
}

const PLACEHOLDER_DEFAULT = {
  paragraphs: [
    "This race's naming conventions are inspired by fantasy lore and common D&D tropes.",
    "Names often reflect cultural values, history, and the environment of their homeland.",
    "Use this generator to create fitting names for characters in your campaign.",
  ],
};

const PLACEHOLDER_ADVANCED = {
  paragraphs: [
    "In D&D settings, this race's names may vary by subculture or region.",
    "Naming traditions can include elements of heritage, achievements, or mystical significance.",
    "These names are designed to feel authentic within typical fantasy worlds.",
  ],
};

export const NAMING_RULES: Record<RaceSlug, NamingRuleConfig> = {
  elf: {
    raceLabel: "Elf",
    default: {
      paragraphs: [
        "Elven names in Dungeons & Dragons are typically melodic and flowing, often drawing inspiration from nature, moonlight, stars, and ancient elven culture.",
        "Most elves use a personal given name, sometimes accompanied by a family name or honorific. These names favor soft consonants, vowel-rich syllables, and a lyrical rhythm that reflects the long-lived and artistic nature of elven societies.",
        "This generator follows common D&D elven naming conventions, helping you quickly create authentic elf names for player characters or NPCs.",
      ],
    },
    advanced: {
      paragraphs: [
        "In Dungeons & Dragons, elven naming traditions are shaped by longevity, culture, and social context. Because elves can live for centuries, their names are designed to sound timeless rather than tied to short-lived trends. Soft consonants, extended vowels, and fluid syllable structures help elven names remain elegant across generations.",
        "Many elves use different forms of their names depending on situation. A personal name may be used among family and close companions, while a longer or more formal name can appear in elven society, historical records, or ceremonial contexts. When interacting with other races, elves may simplify or adapt their names for easier pronunciation.",
        "Elven names often carry cultural meaning connected to nature, artistry, lineage, or notable deeds. Rather than indicating rank directly, a name reflects identity, heritage, and personal history within elven culture. The names generated here are intended to feel natural within typical D&D settings, making them suitable for player characters, NPCs, noble houses, scouts, mages, and long-established elven communities.",
      ],
    },
  },
  human: {
    raceLabel: "Human",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  dwarf: {
    raceLabel: "Dwarf",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  halfling: {
    raceLabel: "Halfling",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  gnome: {
    raceLabel: "Gnome",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  "half-elf": {
    raceLabel: "Half-Elf",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  "half-orc": {
    raceLabel: "Half-Orc",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  dragonborn: {
    raceLabel: "Dragonborn",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  tiefling: {
    raceLabel: "Tiefling",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  orc: {
    raceLabel: "Orc",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  angel: {
    raceLabel: "Angel",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  demon: {
    raceLabel: "Demon",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  eastern: {
    raceLabel: "Eastern",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  goblin: {
    raceLabel: "Goblin",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
};