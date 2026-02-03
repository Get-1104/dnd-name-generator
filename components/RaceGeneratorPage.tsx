"use client";

import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";
import NamingRules from "@/components/NamingRules";
import RelatedGenerators from "@/components/RelatedGenerators";
import SimpleNameGenerator, { type SimpleGeneratorConfig } from "@/components/SimpleNameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { getRelatedGeneratorHrefs } from "@/lib/related";
import type { RaceSlug } from "@/lib/namingRules";

export type FaqItem = { q: string; a: string };

export default function RaceGeneratorPage({
  title,
  description,
  path,
  raceSlug,
  faq,
  generatorConfig,
}: {
  title: string;
  description: string;
  path: string; // "/dwarf"
  raceSlug: RaceSlug;
  faq: FaqItem[];
  generatorConfig: SimpleGeneratorConfig;
}) {
  const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });
  const jsonLd = buildGeneratorPageJsonLd({ title, description, path, faq });

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="bg-white rounded-[32px] p-2 md:p-3" data-race={raceSlug} data-path={path}>
        <div className="max-w-5xl mx-auto px-2">
          <div className="mx-auto max-w-3xl space-y-3">
            <header className="pt-0">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto h-px w-12 bg-zinc-200/60 -mt-2" aria-hidden />
                <h1 className="text-5xl tracking-tight leading-tight font-semibold max-w-2xl mx-auto mt-2">
                  {title}
                </h1>
                <p className="mt-3 text-zinc-600">{description}</p>
              </div>
            </header>

            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-3xl mx-auto">
                <Suspense fallback={<div className="h-40" />}>
                  <SimpleNameGenerator config={generatorConfig} initialCount={10} />
                </Suspense>
              </div>
            </div>

            <div className="mt-10 space-y-10">
              <NamingRules race={raceSlug} />
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
