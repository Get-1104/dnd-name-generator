import { notFound } from "next/navigation";
import RacePageClient from "./RacePageClient";
import { createPageMetadata } from "@/lib/metadata";
import { getRaceBySlug, RACES } from "@/lib/races";

type RacePageParams = {
  params: Promise<{ race: string }>;
};

export function generateStaticParams() {
  return RACES.map((r) => ({ race: r.slug }));
}

export async function generateMetadata({ params }: RacePageParams) {
  const { race: raceSlug } = await params;
  const race = getRaceBySlug(raceSlug);
  if (!race) return {};
  return createPageMetadata({
    title: race.title,
    description: race.description,
    path: `/${race.slug}`,
  });
}

export default async function RacePage({ params }: RacePageParams) {
  const { race: raceSlug } = await params;
  const race = getRaceBySlug(raceSlug);
  if (!race) return notFound();
  return <RacePageClient race={race} />;
}
