"use client";

import GeneratorTemplatePage from "@/components/GeneratorTemplatePage";
import type { RaceSlug } from "@/lib/namingRules";
import type { NameParts } from "@/lib/raceGeneratorConfigs";

export type FaqItem = { q: string; a: string };

export default function RaceGeneratorPage({
  title,
  description,
  path,
  raceSlug,
  faq,
  parts,
  includeSurnameDefault,
}: {
  title: string;
  description: string;
  path: `/${string}`; // "/dwarf"
  raceSlug: RaceSlug;
  faq: FaqItem[];
  parts: NameParts;
  includeSurnameDefault: boolean;
}) {
  const safeParts = {
    first: parts.first ?? [],
    second: parts.second ?? [],
    lastA: parts.lastA ?? [],
    lastB: parts.lastB ?? [],
  };

  return (
    <GeneratorTemplatePage
      race={raceSlug}
      title={title}
      description={description}
      path={path}
      faq={faq}
      nameGenerator={{
        hideHeader: true,
        parts: safeParts,
        initialCount: 10,
        variant: "simple",
        simpleIncludeSurnameDefault: includeSurnameDefault,
      }}
    />
  );
}
