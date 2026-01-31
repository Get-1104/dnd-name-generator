"use client";

import { NAMING_RULES, type RaceSlug } from "@/lib/namingRules";

interface NamingRulesProps {
  race: RaceSlug;
  isAdvanced?: boolean;
  className?: string;
}

export default function NamingRules({ race, isAdvanced = false, className }: NamingRulesProps) {
  const config = NAMING_RULES[race];
  const fallbackDefault = [
    "Elven names typically use flowing vowels and soft consonants, reflecting elegance and longevity.",
    "Default mode generates lore-friendly names suitable for D&D characters and NPCs.",
  ];

  const fallbackAdvanced = [
    "Advanced mode lets you control culture, style, and surname structure.",
    "Use fewer options for broader results, or more options for stricter lore.",
  ];

  const paragraphs = config
    ? (isAdvanced ? (config.advanced?.paragraphs ?? config.default?.paragraphs) : config.default?.paragraphs)
    : (isAdvanced ? fallbackAdvanced : fallbackDefault);

  if (!paragraphs || paragraphs.length === 0) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Naming rules</h2>
        <p className="mt-3 text-zinc-700">
          This generator creates lore-friendly names. Open Advanced options for more control.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Naming rules</h2>
      <div className="mt-3 space-y-2 text-zinc-700">
        {paragraphs.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </section>
  );
}