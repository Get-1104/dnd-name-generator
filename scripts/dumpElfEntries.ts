import fs from "fs";
import path from "path";
import { ELF_NAME_ENTRIES } from "../lib/elfNameEntries";

const outDir = path.resolve("lib/nameEntries");
const outFile = path.join(outDir, "elf.generated.json");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
	outFile,
	JSON.stringify(ELF_NAME_ENTRIES, null, 2),
	"utf-8"
);

console.log(`✓ Wrote ${ELF_NAME_ENTRIES.length} elf names to ${outFile}`);
