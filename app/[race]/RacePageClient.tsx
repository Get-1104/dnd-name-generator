"use client";

import RaceTemplateGenerator from "@/components/RaceTemplateGenerator";
import { ELF_NAME_ENTRIES } from "@/lib/elfNameEntries";
import type { RaceDef } from "@/lib/races";

type RacePageClientProps = {
  race: RaceDef;
};

export default function RacePageClient({ race }: RacePageClientProps) {
  return (
    <RaceTemplateGenerator
      title={race.title}
      description={race.description}
      raceSlug={race.slug}
      dataSource={ELF_NAME_ENTRIES}
    />
  );
}
