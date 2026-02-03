import { elfCulturalOriginOptions } from "../lib/elfOptions";
import { ELF_NAME_ENTRIES } from "../lib/elfNameEntries";
import { NATION_OPTIONS } from "../lib/weightedNameGenerator";
import type { NameEntry } from "../lib/elfNameEntries";

const NATION_ENTRY_MAP: Record<string, { origins: NameEntry["culturalOrigin"][]; eras: NameEntry["era"][] }> = {
  "ancient-high-kingdom": { origins: ["ancient-highborn"], eras: ["ancient"] },
  "forest-realm": { origins: ["wood-elf"], eras: ["ancient", "revival"] },
  "coastal-elven-state": { origins: ["high-elf"], eras: ["revival"] },
  "isolated-mountain-enclave": { origins: ["high-elf"], eras: ["revival"] },
  "fallen-empire": { origins: ["drow"], eras: ["ancient", "revival"] },
};

function mapOrigin(value: string | null | undefined): NameEntry["culturalOrigin"] | null {
  if (!value) return null;
  if (value === "wood-elf") return "wood-elf";
  if (value === "drow") return "drow";
  if (value === "ancient-highborn") return "ancient-highborn";
  return "high-elf";
}

function matchesNation(entry: NameEntry, nation: string | null | undefined) {
  if (!nation) return true;
  if (entry.nation) return entry.nation === nation;
  const mapping = NATION_ENTRY_MAP[nation];
  if (!mapping) return false;
  return mapping.origins.includes(entry.culturalOrigin) && mapping.eras.includes(entry.era);
}

let failures = 0;

console.log("\nElf filter check (nation/realm)");
for (const opt of NATION_OPTIONS) {
  const count = ELF_NAME_ENTRIES.filter((entry) => matchesNation(entry, opt.value)).length;
  const ok = count >= 10;
  if (!ok) failures += 1;
  console.log(`  ${opt.value}: ${count}${ok ? "" : "  <-- expected >= 10"}`);
}

console.log("\nElf filter check (cultural origin)");
for (const opt of elfCulturalOriginOptions) {
  const origin = mapOrigin(opt.value);
  const count = ELF_NAME_ENTRIES.filter((entry) => entry.culturalOrigin === origin).length;
  const ok = count >= 10;
  if (!ok) failures += 1;
  console.log(`  ${opt.value}: ${count}${ok ? "" : "  <-- expected >= 10"}`);
}

if (failures > 0) {
  console.error(`\nElf filter check failed with ${failures} issue(s).`);
  process.exitCode = 1;
} else {
  console.log("\nElf filter check passed.");
}
