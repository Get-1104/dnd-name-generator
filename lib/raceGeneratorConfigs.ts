import type { FaqItem } from "@/components/RaceGeneratorPage";
import type { RaceSlug } from "@/lib/namingRules";

export type NameParts = {
  first?: string[];
  second?: string[];
  third?: string[];
  lastA?: string[];
  lastB?: string[];
  epithets?: string[];
  surnames?: string[];
  givenChars?: string[];
  twoCharRate?: number;
};

export type RacePageConfig = {
  title: string;
  description: string;
  path: `/${string}`;
  raceSlug: RaceSlug;
  faq: FaqItem[];
  includeSurnameDefault: boolean;
  parts: NameParts;
};

export const RACE_PAGE_CONFIGS: Record<RaceSlug, RacePageConfig> = {
  elf: {
    title: "Elf Name Generator",
    description: "Generate elegant elven names for D&D characters and NPCs.",
    path: "/elf",
    raceSlug: "elf",
    faq: [
      { q: "What is an elf name generator?", a: "An elf name generator creates lore-friendly elven names for D&D characters and NPCs." },
      { q: "Can I generate elf names with surnames?", a: "Yes. You can include a surname or enter a custom surname in Advanced options on the Elf page." },
      { q: "How do I get more variety?", a: "Open Advanced options and select fewer tags for broader mixing, or reset to defaults." },
    ],
    includeSurnameDefault: true,
    parts: { first: ["Ae"], second: ["rin"], lastA: ["Moon"], lastB: ["whisper"] },
  },
  human: {
    title: "Human Name Generator",
    description: "Generate believable human names for D&D characters and NPCs.",
    path: "/human",
    raceSlug: "human",
    faq: [
      { q: "What makes a good human D&D name?", a: "Human names are usually the most readable—short, familiar syllables, and a surname that hints at region, trade, or family." },
      { q: "Are the results medieval or modern?", a: "They lean medieval-fantasy, but still easy to say at the table." },
      { q: "Can I generate names without surnames?", a: "Yes—turn off “Include surname” above the list." },
    ],
    includeSurnameDefault: true,
    parts: {
        first: ["Al", "Be", "Cor", "Da", "Ed", "Fi", "Gar", "Ha", "Jo", "Mar", "Ni", "Ro", "Sa", "Wil"],
        second: ["den", "ric", "lan", "mund", "son", "ford", "win", "bert", "ton", "ley", "ven", "gar", "lia", "ren"],
        lastA: ["Stone", "Raven", "Ash", "Oak", "River", "Bright", "Iron", "Storm", "Hill", "Black", "White", "Gold"],
        lastB: ["brook", "wood", "field", "water", "mere", "well", "ward", "fall", "stone", "crest", "hand", "watch"],
    },
  },
  dwarf: {
    title: "Dwarf Name Generator",
    description: "Generate strong dwarf names for D&D characters and NPCs.",
    path: "/dwarf",
    raceSlug: "dwarf",
    faq: [
      { q: "How do dwarf names usually sound?", a: "Dwarf names tend to be sturdy and consonant-heavy, with clan surnames tied to stone, metal, or ancestry." },
      { q: "Do dwarves always use clan names?", a: "Many settings do. Keep surnames on for a classic dwarf feel." },
      { q: "How do I make names more “gritty”?", a: "Regenerate until you get harder consonant clusters (Th, Gr, Br, K)." },
    ],
    includeSurnameDefault: true,
    parts: {
        first: ["Th", "Br", "Gr", "Dor", "Kar", "Bor", "Mor", "Ror", "Har", "Dur", "Bal", "Bar", "Kaz", "Odr"],
        second: ["in", "ar", "ok", "grim", "dun", "gar", "rik", "drum", "mir", "dain", "grom", "bek", "mund", "garn"],
        lastA: ["Iron", "Stone", "Gold", "Bronze", "Anvil", "Hammer", "Deep", "Mountain", "Rock", "Forge", "Granite"],
        lastB: ["beard", "hand", "breaker", "shield", "delver", "born", "fist", "brow", "maker", "keeper", "song"],
    },
  },
  halfling: {
    title: "Halfling Name Generator",
    description: "Generate cheerful halfling names for D&D characters and NPCs.",
    path: "/halfling",
    raceSlug: "halfling",
    faq: [
      { q: "What are halfling naming conventions?", a: "Halfling names often feel warm and homey, with friendly rhythms and surnames tied to places, food, or quirks." },
      { q: "Should I use surnames for halflings?", a: "Yes—halfling family names are common and add charm." },
      { q: "Can I make the names shorter?", a: "Turn off surnames, then regenerate for quick one-word names." },
    ],
    includeSurnameDefault: true,
    parts: {
        first: ["Pip", "Ros", "Sam", "Mil", "Bel", "Tin", "Mar", "Con", "Dai", "Nim", "Lis", "Per"],
        second: ["pin", "ie", "o", "ly", "by", "win", "na", "do", "ric", "la", "fer", "kin"],
        lastA: ["Under", "Good", "Quick", "Green", "Tea", "Apple", "Honey", "Bramble", "Hill", "Soft", "Warm"],
        lastB: ["bough", "barrel", "foot", "meadow", "kettle", "whistle", "topple", "garden", "brook", "mug", "lane"],
    },
  },
  gnome: {
    title: "Gnome Name Generator",
    description: "Generate clever gnome names for D&D characters and NPCs.",
    path: "/gnome",
    raceSlug: "gnome",
    faq: [
      { q: "Why are gnome names so quirky?", a: "Gnome names often sound playful and clever—lots of zippy consonants and tinkery rhythms." },
      { q: "Do gnomes use surnames?", a: "Often yes, especially for clans, workshops, or famous inventors." },
      { q: "How do I get sillier names?", a: "Regenerate until you see more ‘z’, ‘f’, and ‘tink’ sounds." },
    ],
    includeSurnameDefault: true,
    parts: {
        first: ["Fizz", "Tink", "Bim", "Nim", "Zep", "Wiz", "Pog", "Quin", "Jin", "Vex", "Pip", "Glim"],
        second: ["le", "wick", "bin", "zo", "rin", "dle", "zap", "gim", "nock", "bert", "fiz", "per"],
        lastA: ["Copper", "Gear", "Spark", "Gizmo", "Quick", "Bright", "Whistle", "Kettle", "Clock", "Silver"],
        lastB: ["whisk", "spinner", "snap", "buckle", "tock", "whirr", "forge", "foot", "wink", "gadget"],
    },
  },
  dragonborn: {
    title: "Dragonborn Name Generator",
    description: "Generate proud dragonborn names for D&D characters and NPCs.",
    path: "/dragonborn",
    raceSlug: "dragonborn",
    faq: [
      { q: "What do dragonborn names feel like?", a: "Dragonborn names are often formal and draconic—strong syllables, heroic cadence, and sometimes a clan name." },
      { q: "Do dragonborn use clan names?", a: "Commonly yes. Keep surnames on for a classic dragonborn structure." },
      { q: "How do I get longer, grander names?", a: "Regenerate until you see three-part given names or stronger clusters like ‘arj’, ‘bal’, ‘sh’." },
    ],
    includeSurnameDefault: true,
    parts: {
        first: ["Arj", "Bal", "Don", "Ghar", "Hes", "Med", "Nes", "Ras", "Sha", "Tor", "Vor", "Zar"],
        second: ["han", "asar", "darr", "ath", "rin", "vash", "dorn", "skar", "thar", "mir", "zhan", "rak"],
        third: ["", "", "a", "is", "or", "an", "us", "ir"],
        lastA: ["Flame", "Scale", "Storm", "Ember", "Iron", "Ash", "Sky", "Stone", "Fang", "Thunder"],
        lastB: ["heart", "claw", "born", "speaker", "wing", "brand", "shield", "crest", "warden", "caller"],
    },
  },
  tiefling: {
    title: "Tiefling Name Generator",
    description: "Generate infernal tiefling names for D&D characters and NPCs.",
    path: "/tiefling",
    raceSlug: "tiefling",
    faq: [
      { q: "Do tieflings use “virtue names”?", a: "Many do. Tieflings often choose a name that reflects an ideal (Hope, Malice, Mercy) or use infernal-sounding names." },
      { q: "Are these names evil?", a: "Not necessarily—many are dramatic, but you can choose results that fit any alignment." },
      { q: "How do I get more infernal flavor?", a: "Keep surnames on and regenerate until you see harsher syllables like ‘az’, ‘meph’, ‘zar’." },
    ],
    includeSurnameDefault: false,
    parts: {
        first: ["Az", "Meph", "Zar", "Lil", "Bel", "Xan", "Vex", "Mor", "Nyx", "Sar", "Rav", "Cal"],
        second: ["rael", "ira", "th", "zeth", "ion", "ara", "is", "iel", "ora", "eth", "yx", "vyr"],
        lastA: ["Hope", "Mercy", "Malice", "Dread", "Sorrow", "Glory", "Ruin", "Ember", "Ash", "Silk"],
        lastB: ["", "", "", "", "", ""],
    },
  },
  orc: {
    title: "Orc Name Generator",
    description: "Generate fierce orc names for D&D characters and NPCs.",
    path: "/orc",
    raceSlug: "orc",
    faq: [
      { q: "What do orc names sound like?", a: "Orc names are often short, guttural, and punchy—built for shouting across a battlefield." },
      { q: "Do orcs use surnames?", a: "Some settings use tribe names or epithets instead. You can turn surnames off for a raw feel." },
      { q: "How do I get harsher names?", a: "Regenerate until you see more K, G, R, and hard syllables." },
    ],
    includeSurnameDefault: false,
    parts: {
        first: ["Gr", "Kr", "Ug", "Muk", "Thok", "Gor", "Brak", "Ruk", "Dak", "Zug", "Hruk", "Org"],
        second: ["ash", "mog", "nak", "ruk", "tar", "gash", "dush", "grim", "zug", "rok", "shak", "nuk"],
        lastA: ["Skull", "Blood", "Bone", "War", "Iron", "Stone", "Ash", "Rage", "Fang"],
        lastB: ["splitter", "taker", "crusher", "howl", "fist", "tooth", "burn", "scar", "breaker"],
    },
  },
  goblin: {
    title: "Goblin Name Generator",
    description: "Generate tricky goblin names for D&D characters and NPCs.",
    path: "/goblin",
    raceSlug: "goblin",
    faq: [
      { q: "How do goblin names usually look?", a: "Goblin names are quick and sneaky—sharp sounds, nicknames, and silly menace." },
      { q: "Are goblin surnames required?", a: "Not really. Many goblins go by a single nickname." },
      { q: "How do I get funnier names?", a: "Regenerate until you see more ‘sn’, ‘sk’, and playful syllables." },
    ],
    includeSurnameDefault: false,
    parts: {
        first: ["Sn", "Sk", "Gr", "Nib", "Tik", "Zik", "Spro", "Kli", "Pog", "Riz", "Gib", "Krak"],
        second: ["ik", "nak", "zit", "snip", "grot", "bit", "snik", "tch", "rag", "nip", "gle", "rak"],
        lastA: ["Rat", "Scrap", "Mud", "Rust", "Knife", "Soot", "Mush", "Skull"],
        lastB: ["biter", "sniffer", "picker", "runner", "stabber", "licker", "snatcher", "crawler"],
    },
  },
  "half-elf": {
    title: "Half-Elf Name Generator",
    description: "Generate memorable half-elf names by blending elven elegance with human simplicity.",
    path: "/half-elf",
    raceSlug: "half-elf",
    faq: [
      { q: "Do half-elves use human or elf names?", a: "Both. Many half-elves adopt one culture’s naming style or blend the two." },
      { q: "How do I get a more elven feel?", a: "Keep surnames on and regenerate until the given name is more vowel-rich." },
      { q: "How do I get a more human feel?", a: "Turn surnames off for simpler one-word results." },
    ],
    includeSurnameDefault: true,
    parts: {
        first: ["Ae", "Eli", "Lia", "Syl", "Fa", "Tha", "Ari", "Ili", "Ely", "Nae", "Al", "Mar", "Sa", "Wil"],
        second: ["rin", "lith", "riel", "wen", "lian", "mir", "den", "ric", "lan", "mund", "son", "win", "ren"],
        lastA: ["Moon", "Star", "Dawn", "Leaf", "Stone", "Raven", "Oak", "River"],
        lastB: ["whisper", "song", "glade", "watcher", "brook", "wood", "field", "ward"],
    },
  },
  "half-orc": {
    title: "Half-Orc Name Generator",
    description: "Generate tough half-orc names. Mix human readability with orcish grit.",
    path: "/half-orc",
    raceSlug: "half-orc",
    faq: [
      { q: "Are half-orc names more human or more orc?", a: "It depends on upbringing. This generator mixes both sounds for flexible results." },
      { q: "Can I make them more human?", a: "Turn surnames on for more structured full names." },
      { q: "Can I make them more orcish?", a: "Turn surnames off, then regenerate for punchier one-word names." },
    ],
    includeSurnameDefault: true,
    parts: {
        first: ["Gr", "Kr", "Ug", "Muk", "Gor", "Brak", "Ruk", "Dak", "Al", "Cor", "Mar", "Wil", "Gar"],
        second: ["ash", "mog", "nak", "ruk", "tar", "dush", "zug", "rok", "den", "ric", "lan", "mund", "son"],
        lastA: ["Stone", "Iron", "Ash", "Hill", "Skull", "Blood", "Bone", "War"],
        lastB: ["brook", "field", "ward", "hand", "splitter", "crusher", "scar", "breaker"],
    },
  },
  aasimar: {
    title: "Aasimar Name Generator",
    description: "Generate celestial aasimar names for D&D characters and NPCs.",
    path: "/aasimar",
    raceSlug: "aasimar",
    faq: [
      { q: "What do aasimar names sound like?", a: "Aasimar names often feel bright and lyrical, with celestial tones and gentle consonants." },
      { q: "Do aasimar use surnames?", a: "They can—often tied to human families or adopted to blend in." },
      { q: "How do I make names more “divine”?", a: "Regenerate until you see softer vowels and light-themed surnames." },
    ],
    includeSurnameDefault: true,
    parts: {
        first: ["Aur", "Ser", "El", "Lumi", "Cae", "Ari", "Sola", "Theo", "Eli", "Mir"],
        second: ["iel", "aph", "ena", "ora", "wyn", "riel", "ina", "ion", "elle", "is"],
        lastA: ["Bright", "Dawn", "Silver", "Star", "Light", "Gold", "Sun", "Sky"],
        lastB: ["song", "ward", "bloom", "crest", "weaver", "watch", "glow", "keeper"],
    },
  },
  goliath: {
    title: "Goliath Name Generator",
    description: "Generate bold goliath names for D&D characters and NPCs.",
    path: "/goliath",
    raceSlug: "goliath",
    faq: [
      { q: "Do goliaths use epithets?", a: "Often yes. Many goliaths earn descriptive epithets based on deeds, traits, or mountains." },
      { q: "Can I generate without an epithet?", a: "Yes—toggle off “Include epithet” above the list." },
      { q: "What makes a goliath name feel right?", a: "Hard consonants, strong beats, and a proud descriptive epithet." },
    ],
    includeSurnameDefault: false,
    parts: {
        first: ["Kar", "Tor", "Val", "Bran", "Sten", "Hark", "Rok", "Jor", "Krag", "Ulf"],
        second: ["ga", "rim", "dan", "var", "thar", "dor", "mir", "gorn", "nak", "ren"],
        epithets: [
          "Stone-Shoulder",
          "Sky-Walker",
          "Thunder-Step",
          "Cliff-Breaker",
          "Ice-Blood",
          "Peak-Runner",
          "Storm-Caller",
          "Rock-Singer",
          "Frost-Heart",
          "Mountain-Born",
        ],
        lastA: [],
        lastB: [],
    },
  },
  angel: {
    title: "Angel Name Generator",
    description: "Generate angelic names for D&D campaigns and fantasy worlds.",
    path: "/angel",
    raceSlug: "angel",
    faq: [
      { q: "What makes an angel name sound celestial?", a: "Soft vowels, flowing syllables, and a bright rhythm—often ending with -iel, -ael, or -ion." },
      { q: "Can I use these for deities or emissaries?", a: "Yes. They work well for messengers, guardians, and divine NPCs." },
      { q: "How do I get more variety?", a: "Regenerate until you get a different ending, or toggle surnames for longer names." },
    ],
    includeSurnameDefault: false,
    parts: {
        first: ["Ser", "Aza", "Uri", "Micha", "Rafa", "Gabra", "Eli", "Lumi", "Cae", "Theo"],
        second: ["el", "iel", "ael", "ion", "ora", "wyn", "riel", "ana", "eth", "is"],
        lastA: ["Light", "Dawn", "Star", "Silver", "Grace"],
        lastB: ["wing", "song", "ward", "bloom", "keeper"],
    },
  },
  demon: {
    title: "Demon Name Generator",
    description: "Generate demonic names for D&D villains and dark fantasy settings.",
    path: "/demon",
    raceSlug: "demon",
    faq: [
      { q: "Do demon names need to be unreadable?", a: "Not at all. The best villain names are dramatic but pronounceable." },
      { q: "Are these names “infernal” or “abyssal”?", a: "They’re broadly fiendish—harsh consonants, sharp endings, and ominous rhythm." },
      { q: "How do I get darker names?", a: "Regenerate until you see more Z, X, K, and hard syllables." },
    ],
    includeSurnameDefault: false,
    parts: {
        first: ["Xar", "Zul", "Kha", "Vorg", "Mal", "Razh", "Bel", "Nox", "Skor", "Grax"],
        second: ["ath", "gor", "zul", "rax", "moth", "vyr", "thos", "grim", "zeth", "kesh"],
        lastA: ["Ash", "Ruin", "Dread", "Blood", "Void"],
        lastB: ["born", "caller", "weaver", "maw", "keeper"],
    },
  },
  eastern: {
    title: "\u4e1c\u65b9\u56fd\u98ce\u540d\u5b57\u751f\u6210\u5668",
    description: "\u751f\u6210\u4ed9\u4fa0/\u6b66\u4fa0/\u53e4\u98ce\u98ce\u683c\u7684\u4e2d\u6587\u540d\u5b57\u7075\u611f\u3002Also supports xianxia / wuxia / chinese fantasy name generator searches.",
    path: "/eastern",
    raceSlug: "eastern",
    faq: [
      { q: "这是中文名字还是拼音名字？", a: "默认生成中文名字（姓+名），适合仙侠/武侠/国风设定。"},
      { q: "两字名和三字名怎么控制？", a: "生成器会在两字名与三字名之间自动分布（偏两字名）。反复点击 Generate 获取更多变化。"},
      { q: "能不能用于 NPC？", a: "可以。你也可以把生成结果当作灵感，然后微调成角色专属名字。"},
    ],
    includeSurnameDefault: true,
    parts: {
        surnames: ["赵","钱","孙","李","周","吴","郑","王","冯","陈","褚","卫","蒋","沈","韩","杨","朱","秦","许","何","吕","施","张","孔","曹","严","华","金","魏"],
        givenChars: ["云","风","月","雪","霜","霖","川","山","海","星","辰","玄","灵","霄","澜","若","清","然","离","尘","夜","青","白","墨","璃","瑶","珑","霖","寒","烬","歌","影","宁","安","羽","落","霁","岚"],
        twoCharRate: 0.62,
    },
  },
};
