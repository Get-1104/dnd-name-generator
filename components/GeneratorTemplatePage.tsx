"use client";

import { Suspense, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import ElfNameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import NamingRules from "@/components/NamingRules";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { getRelatedGeneratorHrefs } from "@/lib/related";
import type { RaceSlug } from "@/lib/namingRules";

export type FaqItem = { q: string; a: string };

type NameGeneratorProps = ComponentProps<typeof ElfNameGenerator>;

type TemplateProps = {
  race: RaceSlug;
  title: string;
  description: string;
  path: string;
  faq: FaqItem[];

  /** Optional: default advanced state for the page */
  defaultAdvanced?: boolean;

  /** Optional: how many related generators to show */
  relatedMax?: number;

  /** If provided, this custom generator will be rendered instead of <NameGenerator /> */
  renderGenerator?: (ctx: {
    isAdvanced: boolean;
    setIsAdvanced: (v: boolean) => void;
  }) => ReactNode;

  /**
  * Props forwarded into <ElfNameGenerator />
   * (title/description/isAdvanced/onAdvancedToggle are controlled by the template)
   */
  nameGenerator?: Omit<
    NameGeneratorProps,
    "title" | "description" | "isAdvanced" | "onAdvancedToggle"
  >;
};

export default function GeneratorTemplatePage({
  race,
  title,
  description,
  path,
  faq,
  defaultAdvanced = false,
  relatedMax = 4,
  renderGenerator,
  nameGenerator,
}: TemplateProps) {
  const [isAdvanced, setIsAdvanced] = useState(defaultAdvanced);

  const relatedHrefs = getRelatedGeneratorHrefs(path, { max: relatedMax });

  const jsonLd = buildGeneratorPageJsonLd({
    title,
    description,
    path,
    faq,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-white rounded-[32px] p-2 md:p-3">
        <div className="max-w-5xl mx-auto px-2">
          <div className="mx-auto max-w-3xl space-y-3">
            {/* Top hero: title/description */}
            <header className="pt-0">
              <div className="mx-auto max-w-3xl text-center">
                <div
                  className="mx-auto h-px w-12 bg-zinc-200/60 -mt-2"
                  aria-hidden
                />
                <h1 className="text-5xl tracking-tight leading-tight font-semibold max-w-2xl mx-auto mt-2">
                  {title}
                </h1>
              </div>
            </header>

            {/* Promoted main generator stage — centered and focused */}
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-3xl mx-auto">
                {renderGenerator ? (
                  renderGenerator({ isAdvanced, setIsAdvanced })
                ) : (
                  <Suspense fallback={<div className="h-40" />}>
                    <ElfNameGenerator
                      {...(nameGenerator as NameGeneratorProps)}
                      title={title}
                      description={description}
                      isAdvanced={isAdvanced}
                      onAdvancedToggle={() => setIsAdvanced(!isAdvanced)}
                    />
                  </Suspense>
                )}
              </div>
            </div>

            <div className="mt-10 space-y-10">
              <NamingRules race={race} isAdvanced={isAdvanced} />
              {/* FAQ */}
              <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">FAQ</h2>
                <div className="mt-4 space-y-4">
                  {faq.map((f) => (
                    <div key={f.q} className="rounded-xl border border-zinc-100 p-4">
                      <p className="font-medium">{f.q}</p>
                      <p className="mt-2 text-zinc-700">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <RelatedGenerators hrefs={relatedHrefs} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
