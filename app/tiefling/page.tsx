import RaceGeneratorPage from "@/components/RaceGeneratorPage";
import { createPageMetadata } from "@/lib/metadata";
import { RACE_PAGE_CONFIGS } from "@/lib/raceGeneratorConfigs";

export function generateMetadata() {
  const c = RACE_PAGE_CONFIGS["tiefling"];
  return createPageMetadata({
    title: c.title,
    description: c.description,
    path: c.path,
  });
}

export default function Page() {
  const c = RACE_PAGE_CONFIGS["tiefling"];
  return (
    <RaceGeneratorPage
      title={c.title}
      description={c.description}
      path={c.path}
      raceSlug={c.raceSlug}
      faq={c.faq}
      parts={c.parts}
      includeSurnameDefault={c.includeSurnameDefault}
    />
  );
}
