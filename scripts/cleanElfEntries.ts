import fs from "node:fs";
import path from "node:path";
import { ELF_NAME_ENTRIES_RAW, cleanElfEntries } from "../lib/elfNameEntries";

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
