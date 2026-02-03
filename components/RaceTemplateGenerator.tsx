"use client";

import { Suspense, useMemo } from "react";
import NameGenerator from "@/components/NameGenerator";
import type { NameEntry } from "@/lib/elfNameEntries";

type RaceTemplateGeneratorProps = {
  title: string;
  description: string;
  raceSlug: string;
  dataSource: NameEntry[];
};

export default function RaceTemplateGenerator({
  title,
  description,
  raceSlug,
  dataSource,
}: RaceTemplateGeneratorProps) {
  const entries = useMemo(() => dataSource, [dataSource]);

  return (
    <div className="bg-white rounded-[32px] p-2 md:p-3" data-race={raceSlug} data-path={`/${raceSlug}`}>
      <div className="max-w-5xl mx-auto px-2">
        <div className="mx-auto max-w-3xl space-y-3">
          <header className="pt-0 text-center">
            <div className="mx-auto h-px w-12 bg-zinc-200/60 -mt-2" aria-hidden />
            <h1 className="text-5xl tracking-tight leading-tight font-semibold max-w-2xl mx-auto mt-2">
              {title}
            </h1>
            <p className="mt-3 text-zinc-600">{description}</p>
          </header>

          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-3xl mx-auto">
              <Suspense fallback={<div className="h-24" />}>
                <NameGenerator
                  hideHeader
                  title={title}
                  description={description}
                  entries={entries}
                  parts={{
                    first: ["Ae", "Eli", "Lia", "Syl", "Fa", "Tha", "Ari", "Ili", "Ely", "Nae"],
                    second: [
                      "rin",
                      "lith",
                      "syl",
                      "vyr",
                      "thas",
                      "riel",
                      "nor",
                      "wen",
                      "lian",
                      "mir",
                    ],
                    lastA: [
                      "Moon",
                      "Star",
                      "Silver",
                      "Dawn",
                      "Night",
                      "Sun",
                      "Leaf",
                      "Wind",
                      "Mist",
                      "Song",
                    ],
                    lastB: [
                      "whisper",
                      "bloom",
                      "runner",
                      "shade",
                      "weaver",
                      "song",
                      "glade",
                      "dancer",
                      "brook",
                      "watcher",
                    ],
                  }}
                  initialCount={10}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
