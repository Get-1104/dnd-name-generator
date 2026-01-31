import RacePageClient from "../[race]/RacePageClient";
import { getRaceBySlug } from "@/lib/races";

export default function HumanPage() {
  const race = getRaceBySlug("human");
  if (!race) return null;
  return <RacePageClient race={race} />;
}
