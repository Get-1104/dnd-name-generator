import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function HumanPage() {
  const title = "Human Name Generator";
  const description = "Generate flexible human names for D&D characters and NPCs.";
  const path = "/human";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a human name generator?",
        a: "A human name generator creates believable fantasy human names for D&D characters, NPCs, and worldbuilding.",
      },
      {
        q: "How do I use this human name generator?",
        a: "Click Generate to produce a new list of names, then use Copy to save them for your campaign notes or character sheet.",
      },
      {
        q: "Are the names tied to a specific culture?",
        a: "No. The names are flexible fantasy-style options you can adapt to different regions, kingdoms, or backgrounds in your world.",
      },
      {
        q: "Can I generate names for towns and NPC lists?",
        a: "Yes. This tool is great for quickly creating many names for settlements, guards, merchants, and nobles.",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-6">
        <Link
          href="/en"
          className="inline-block text-sm text-blue-600 underline underline-offset-4"
        >
          ← Back to all D&amp;D name generators
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

          <p className="text-zinc-700 leading-7">
            Humans are the most diverse and adaptable people in D&amp;D, found in
            nearly every kingdom, guild, and profession. Because of that variety,
            human names can be simple and practical, or noble and historical.
          </p>

          <p className="text-zinc-700 leading-7">
            Need a different style? Explore the{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            hub, or try something more rugged like{" "}
            <Link href="/orc" className="underline underline-offset-4">
              orc names
            </Link>{" "}
            or more elegant like{" "}
            <Link href="/elf" className="underline underline-offset-4">
              elf names
            </Link>
            .
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/orc" className="underline underline-offset-4">
                Orc Name Generator
              </Link>{" "}
              — harsh, powerful names for warbands and raiders.
            </li>
            <li>
              <Link href="/elf" className="underline underline-offset-4">
                Elf Name Generator
              </Link>{" "}
              — melodic names for ancient lineages and noble houses.
            </li>
            <li>
              <Link href="/dwarf" className="underline underline-offset-4">
                Dwarf Name Generator
              </Link>{" "}
              — clan-based names with sturdy, grounded tones.
            </li>
            <li>
              <Link href="/eastern" className="underline underline-offset-4">
                Eastern Fantasy Name Generator
              </Link>{" "}
              — wuxia/xianxia-style Chinese name inspiration.
            </li>
          </ul>
        </div>
      </section>

      <NameGenerator
        hideHeader
        title={title}
        description={description}
        parts={{
          first: ["Al", "Ben", "Cor", "Dan", "El", "Fin", "Gar", "Hen", "Jon", "Mar"],
          second: ["den", "ric", "win", "thor", "ley", "son", "nard", "ton", "well", "ver"],
          lastA: ["Stone", "Raven", "Bright", "Ash", "River", "Iron", "Oak", "North", "Silver", "Storm"],
          lastB: ["field", "brook", "ford", "heart", "wood", "watch", "crest", "hall", "vale", "ward"],
        }}
        initialCount={10}
        examples={[
          "Alden Stonefield",
          "Corric Ravenbrook",
          "Elwin Brightford",
          "Marver Northhall",
          "Benson Stormward",
        ]}
      />
    </>
  );
}
