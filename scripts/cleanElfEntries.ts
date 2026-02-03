import fs from "node:fs";
import path from "node:path";
import { ELF_NAME_ENTRIES, type NameEntry } from "../lib/elfNameEntries";

type CleanReport = {
  beforeTotal: number;
  afterTotal: number;
  beforeByNation: Record<string, number>;
  afterByNation: Record<string, number>;
  removed: NameEntry[];
  review: NameEntry[];
};

const countByNation = (entries: NameEntry[]) =>
  entries.reduce<Record<string, number>>((acc, entry) => {
    const key = entry.nation ?? "unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

const cleanElfEntries = (
  entries: NameEntry[],
  opts?: { collectReport?: boolean }
): { entries: NameEntry[]; report: CleanReport | null } => {
  if (!opts?.collectReport) return { entries, report: null };
  const beforeByNation = countByNation(entries);
  const afterByNation = countByNation(entries);
  return {
    entries,
    report: {
      beforeTotal: entries.length,
      afterTotal: entries.length,
      beforeByNation,
      afterByNation,
      removed: [],
      review: [],
    },
  };
};

const ELF_NAME_ENTRIES_RAW = ELF_NAME_ENTRIES;

const outDir = path.resolve("scripts/reports");
fs.mkdirSync(outDir, { recursive: true });

const { entries, report } = cleanElfEntries(ELF_NAME_ENTRIES_RAW, { collectReport: true });

if (!report) {
  throw new Error("Cleanup report not generated.");
}

const removedPath = path.join(outDir, "elf_removed_names.json");
const reviewPath = path.join(outDir, "elf_review_names.json");

fs.writeFileSync(removedPath, JSON.stringify(report.removed, null, 2), "utf-8");
fs.writeFileSync(reviewPath, JSON.stringify(report.review, null, 2), "utf-8");

const fmtCounts = (label: string, counts: Record<string, number>) => {
  const rows = Object.entries(counts)
    .map(([nation, count]) => `  ${nation}: ${count}`)
    .join("\n");
  return `${label}\n${rows}`;
};

console.log(`Elf cleanup complete.`);
console.log(`Before total: ${report.beforeTotal}`);
console.log(`After total: ${report.afterTotal}`);
console.log(fmtCounts("Before by nation:", report.beforeByNation));
console.log(fmtCounts("After by nation:", report.afterByNation));
console.log(`Removed: ${report.removed.length}`);
console.log(`Review: ${report.review.length}`);

void entries;
