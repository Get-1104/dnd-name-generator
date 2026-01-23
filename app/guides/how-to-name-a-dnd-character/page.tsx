import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGuidePageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "How to Name a D&D Character | 7 Proven Methods + Examples",
  description: "Learn how to name a D&D character with 7 practical methods, race-inspired tips, and ready-to-use name formulas. Includes examples and FAQs.",
  path: "/guides/how-to-name-a-dnd-character",
});

export default function HowToNameADndCharacterPage() {
  const path = "/guides/how-to-name-a-dnd-character";
  const title = "How to Name a D&D Character (7 Proven Methods)";
  const description =
    "Learn how to name a D&D character with 7 practical methods, race-inspired tips, and ready-to-use name formulas. Includes examples and FAQs.";

  const faq = [
    {
      q: "What makes a good D&D character name?",
      a: "A good D&D name is easy to say at the table, fits the character’s ancestry/culture, and hints at personality or backstory without being too long.",
    },
    {
      q: "Should I use a fantasy name generator?",
      a: "Yes. Generators are great for brainstorming. Generate a shortlist, then tweak spelling, syllables, or add a title to make the final name feel unique.",
    },
    {
      q: "How long should a character name be?",
      a: "For most tables, 2–4 syllables (or a short first+last name) is ideal. If you want a longer ceremonial name, keep a short nickname for play.",
    },
    {
      q: "How do I make my name sound like an elf or dwarf?",
      a: "Use race-flavored syllables and phonetics: elves often feel melodic with softer consonants; dwarves tend to use sturdy, clipped sounds and clan-style surnames.",
    },
    {
      q: "Can I change my character name later?",
      a: "Absolutely. Many players refine names after a few sessions. A nickname, alias, or cultural title can make changes feel natural in the story.",
    },
  ];

  const jsonLd = buildGuidePageJsonLd({
    path,
    title,
    description,
    faq,
    language: "en",
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <JsonLd data={jsonLd} />

      <Link
        href="/en"
        className="inline-block text-sm text-blue-600 underline underline-offset-4"
      >
        ← Back to all D&amp;D name generators
      </Link>

      <article className="space-y-10">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

          <p className="text-zinc-700 leading-7">
            The best D&amp;D character names are easy to say out loud, fit the
            character’s ancestry or culture, and give your table a memorable
            “hook.” Below are seven practical methods you can use in under 5
            minutes—plus examples and ready-to-copy name formulas.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Quick links</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>
                Need instant ideas? Try the{" "}
                <Link href="/en" className="underline underline-offset-4">
                  generator hub
                </Link>
                .
              </li>
              <li>
                Want race-specific styles? Start with{" "}
                <Link href="/elf" className="underline underline-offset-4">
                  elf
                </Link>
                ,{" "}
                <Link href="/dwarf" className="underline underline-offset-4">
                  dwarf
                </Link>
                ,{" "}
                <Link href="/goblin" className="underline underline-offset-4">
                  goblin
                </Link>{" "}
                or{" "}
                <Link href="/dragonborn" className="underline underline-offset-4">
                  dragonborn
                </Link>
                .
              </li>
            </ul>
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">1) The “table test” (say it 3 times)</h2>
          <p className="text-zinc-700 leading-7">
            If your name is hard to pronounce, it won’t get used. Say it three times
            quickly. If you stumble, shorten it or create a nickname.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
            <li>Long: “Aeltheryn Vaeloriandor” → Short: “Ael” / “Vaelor”</li>
            <li>Long: “Thromdrin Granitebreaker” → Short: “Throm”</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">2) Use a 2-part name formula</h2>
          <p className="text-zinc-700 leading-7">
            A simple formula makes names feel consistent with your world.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h3 className="font-medium">Copy-paste formulas</h3>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                <span className="font-medium text-zinc-900">[Given] + [Trait]:</span>{" "}
                “Seren Bright”, “Krag Quickhand”
              </li>
              <li>
                <span className="font-medium text-zinc-900">[Given] + [Place]:</span>{" "}
                “Borin of Stonegate”, “Lumi of Dawnspire”
              </li>
              <li>
                <span className="font-medium text-zinc-900">[Given] + [Clan]:</span>{" "}
                “Thrain Ironbeard”, “Mara Silverleaf”
              </li>
              <li>
                <span className="font-medium text-zinc-900">[Title] + [Given]:</span>{" "}
                “Captain Varek”, “Sister Elyra”
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">3) Match the sound to the ancestry</h2>
          <p className="text-zinc-700 leading-7">
            You don’t need “official” lore—just consistent phonetics.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <ul className="space-y-2 text-zinc-700">
              <li>
                <span className="font-medium text-zinc-900">Elf (melodic):</span>{" "}
                Aerithiel, Sylvara, Luthien
              </li>
              <li>
                <span className="font-medium text-zinc-900">Dwarf (sturdy):</span>{" "}
                Brokk, Thrain, Durgrim Stonehammer
              </li>
              <li>
                <span className="font-medium text-zinc-900">Goblin (punchy):</span>{" "}
                Grik, Snivz, Mogz
              </li>
              <li>
                <span className="font-medium text-zinc-900">Dragonborn (strong):</span>{" "}
                Arjhan, Rhogar, Vrakir
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">4) Tie the name to backstory (one hook)</h2>
          <p className="text-zinc-700 leading-7">
            Pick one detail: origin, oath, mentor, tragedy, or goal. Then add a word,
            title, or surname that reflects it.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
            <li>Oath → “Elyra Oathbinder”</li>
            <li>Mentor → “Krag of Voss”</li>
            <li>Goal → “Seren Starseeker”</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">5) Make a nickname on purpose</h2>
          <p className="text-zinc-700 leading-7">
            Nicknames solve two problems: they’re easy at the table, and they create instant
            roleplay. Your “formal name” can be longer.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
            <li>“Durgrim Stonehammer” → “Durg” / “Hammer”</li>
            <li>“Aurelia Dawnwatcher” → “Aur” / “Dawn”</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">6) Use a generator, then customize</h2>
          <p className="text-zinc-700 leading-7">
            The fastest workflow is: generate 10–20 names → pick 2–3 favorites → tweak.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-700 leading-7">
            <li>
              Generate on the{" "}
              <Link href="/en" className="underline underline-offset-4">
                hub
              </Link>
              .
            </li>
            <li>Swap one vowel, or merge two names.</li>
            <li>Add a title/clan name that fits your world.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">7) Keep a reusable list (DM &amp; player)</h2>
          <p className="text-zinc-700 leading-7">
            Save a list of 20 names you like. Future characters and NPCs become effortless.
            DMs: keep separate lists for towns, taverns, and factions.
          </p>
        </section>

        {/* ✅ Guide → Generator internal links (template) */}
        <RelatedGenerators
          hrefs={["/elf", "/dwarf", "/dragonborn", "/human"]}
          title="Popular generators to start with"
        />

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <ul className="space-y-3">
            {faq.map((f) => (
              <li key={f.q}>
                <h3 className="font-medium">{f.q}</h3>
                <p className="text-zinc-700">{f.a}</p>
              </li>
            ))}
          </ul>
        </section>

        <footer className="pt-2 text-sm text-zinc-600">
          Related guides:{" "}
          <Link className="underline" href="/guides/dnd-name-generator-guide">
            D&amp;D Name Generator Guide
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/guides/elf-naming-conventions">
            Elf Naming Conventions
          </Link>
        </footer>
      </article>
    </main>
  );
}