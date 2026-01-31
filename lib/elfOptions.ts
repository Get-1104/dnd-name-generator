export type ElfStyle = "elegant" | "nature" | "simple";
export type ElfLength = "short" | "medium" | "long";
export type ElfCulturalContext = "noble" | "common" | "ritual" | "records";
export type ElfNameForm = "full" | "short" | "external";
export type ElfPronunciation = "original" | "simplified";
export type ElfMeaningFlavor = "nature" | "moonlight" | "lineage" | "deeds";

export interface ElfOptions {
  style: ElfStyle;
  length: ElfLength;
  surname: boolean;
  surnameCustom?: string;
  culturalContext?: ElfCulturalContext;
  nameForm?: ElfNameForm;
  pronunciation: ElfPronunciation;
  meaningFlavor: ElfMeaningFlavor;
  culturalOrigin?: ElfCulturalOrigin;
}

export const defaultElfOptions: ElfOptions = {
  style: "elegant",
  length: "medium",
  surname: true,
  surnameCustom: "",
  culturalContext: "common",
  nameForm: "full",
  pronunciation: "original",
  meaningFlavor: "nature",
  culturalOrigin: "high-elf",
};

export const elfStyleOptions: { value: ElfStyle; label: string }[] = [
  { value: "elegant", label: "Elegant" },
  { value: "nature", label: "Nature" },
  { value: "simple", label: "Simple" },
];

export const elfLengthOptions: { value: ElfLength; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long / Formal" },
];

export const elfCulturalContextOptions: { value: ElfCulturalContext; label: string }[] = [
  { value: "noble", label: "Noble / High Society" },
  { value: "common", label: "Common" },
  { value: "ritual", label: "Ritual / Ceremonial" },
  { value: "records", label: "Records / Formal Use" },
];

export const elfNameFormOptions: { value: ElfNameForm; label: string }[] = [
  { value: "short", label: "Everyday" },
  { value: "full", label: "Formal" },
  { value: "external", label: "Outsider-friendly" },
];

export const elfPronunciationOptions: { value: ElfPronunciation; label: string }[] = [
  { value: "original", label: "Keep original" },
  { value: "simplified", label: "Simplified for outsiders" },
];

export const elfMeaningFlavorOptions: { value: ElfMeaningFlavor; label: string }[] = [
  { value: "nature", label: "Nature & seasons" },
  { value: "moonlight", label: "Moonlight & stars" },
  { value: "lineage", label: "Lineage & heritage" },
  { value: "deeds", label: "Deeds & honorifics" },
];

export const elfCulturalOriginOptions = [
  { value: "high-elf", label: "High Elf / Sun Elf" },
  { value: "ancient-highborn", label: "Ancient / Highborn Tradition" },
  { value: "wood-elf", label: "Wood Elf" },
  { value: "drow", label: "Dark Elf / Drow" },
] as const;

export type ElfCulturalOrigin =
  (typeof elfCulturalOriginOptions)[number]["value"];