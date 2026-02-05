"use client";

// Do NOT import ElfNameGenerator here.

import { Suspense } from "react";
import GeneratorTemplatePage from "@/components/GeneratorTemplatePage";
import HumanGenerator from "@/components/HumanGenerator";
import { RACE_PAGE_CONFIGS } from "@/lib/raceGeneratorConfigs";

export default function HumanPageClient() {
  const cfg = RACE_PAGE_CONFIGS.human;

  return (
    <GeneratorTemplatePage
      race="human"
      title={cfg.title}
      description={cfg.description}
      path={cfg.path}
      faq={cfg.faq}
      renderGenerator={() => (
        <Suspense fallback={<div className="h-40" />}>
          <HumanGenerator />
        </Suspense>
      )}
    />
  );
}
