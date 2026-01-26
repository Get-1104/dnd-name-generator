"use client";

import { NAMING_RULES, type RaceSlug } from "@/lib/namingRules";

interface NamingRulesProps {
  race: RaceSlug;
  isAdvanced?: boolean;
  className?: string;
}

export default function NamingRules({ race, isAdvanced = false, className }: NamingRulesProps) {
  const config = NAMING_RULES[race];
  if (!config) return null;

  const content = isAdvanced ? config.advanced : config.default;

  return (
    <div className={`max-w-3xl mx-auto ${className || ""}`}>
      <div className="p-5">
        {content.paragraphs.map((para, idx) => (
          <p key={idx} className="text-zinc-700 leading-relaxed mb-4 last:mb-0">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}