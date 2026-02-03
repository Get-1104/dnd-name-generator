type RuleBlock = { title?: string; paragraphs: string[] };
export type NamingRuleConfig = {
  raceLabel?: string;
  default: RuleBlock;
  advanced?: RuleBlock;
};

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

export const NAMING_RULES = {
  elf: {
    raceLabel: "Elf",
    default: {
      title: "Naming rules",
      paragraphs: [
        "Elven names in Dungeons & Dragons are typically melodic and flowing, often drawing inspiration from nature, moonlight, stars, and ancient elven culture.",
        "Most elves use a personal given name, sometimes accompanied by a family name or honorific.",
        "These names favor soft consonants, vowel-rich syllables, and a lyrical rhythm that reflects the long-lived and artistic nature of elven societies.",
        "This generator follows common D&D elven naming conventions, helping you quickly create authentic names for PCs and NPCs.",
      ],
    },
    advanced: {
      title: "Advanced naming rules",
      paragraphs: [
        "Advanced options let you tune culture, style, and structure (including surnames) for more specific results.",
        "For broader variety, select fewer tags. For stricter lore accuracy, select more tags that match your character’s background.",
        "If you see repeated patterns, reset to defaults or reduce constraints so the generator can mix more pools naturally.",
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
  aasimar: {
    raceLabel: "Aasimar",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
  goliath: {
    raceLabel: "Goliath",
    default: PLACEHOLDER_DEFAULT,
    advanced: PLACEHOLDER_ADVANCED,
  },
} satisfies Record<string, NamingRuleConfig>;

export type RaceSlug = keyof typeof NAMING_RULES;