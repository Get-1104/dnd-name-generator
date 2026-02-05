# Elf file boundary list

## A) Elf page entry files (app/elf)
- app/elf/ElfPageClient.tsx
- app/elf/page.tsx

## B) Elf-only logic files
- lib/elfOptions.ts
- lib/elfLexicon.ts
- lib/elfNameEntries.ts
- lib/elfPools.ts
- lib/weightedNameGenerator.ts
- lib/elf/generateElfFromEntries.ts
- lib/nameEntries/elf.generated.json
- lib/namePools/elfPools.ts
- lib/namePools/elfSurnames.ts
- scripts/checkElfFilters.ts
- scripts/cleanElfEntries.ts
- scripts/dumpElfEntries.ts
- scripts/generateElfExpanded.ts
- scripts/reportElfInventory.ts
- scripts/weight-selftest.ts

## C) Shared UI used by Elf (shared, do not move)
- components/GeneratorTemplatePage.tsx
- components/NameGenerator.tsx
- components/NamingRules.tsx
- components/RelatedGenerators.tsx
- components/JsonLd.tsx
- components/ExampleNamesCard.tsx
- components/Toast.tsx
- components/GlobalHeader.tsx
- app/layout.tsx
