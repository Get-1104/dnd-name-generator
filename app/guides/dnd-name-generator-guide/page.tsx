import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGuidePageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "What Is a D&D Name Generator? Complete Guide + Examples",
  description: "Learn what a D&D name generator is, how it works, and how to create names for elves, dwarves, goblins, and more. Includes examples and FAQs.",
  path: "/guides/dnd-name-generator-guide",
});

export default function DndNameGeneratorGuidePage() {
  const path = "/guides/dnd-name-generator-guide";
  const title = "What Is a D&D Name Generator? (Complete Guide)";
  const description =
    "A practical guide to D&D name generators: how they work, how to use them, and examples for popular fantasy races.";

  const faq = [
    {
      q: "What is a D&D name generator?",
      a: "A D&D name generator is an online tool that creates fantasy-style names you can use for player characters, NPCs, towns, factions, and stories in tabletop RPGs like Dungeons & Dragons.",
    },
    {
      q: "How does a D&D name generator work?",
      a: "Most generators combine fantasy syllable patterns and style rules to produce names that match a race, culture, or vibe. Generate a list, then tweak spelling or combine parts to fit your world.",
    },
    {
      q: "Are the generated names official D&D canon?",
      a: "No. These names are generated for inspiration and are not official D&D canon content.",
    },
    {
      q: "Can I use generated names in my campaign or writing?",
      a: "Yes. You can freely use generated names in personal campaigns and creative projects. Many players adjust spelling or add titles to better match their setting.",
    },
    {
      q: "How many names can I generate?",
      a: "You can generate names as many times as you want. A common workflow is to generate a shortlist, keep favorites, then refine one name for your final character.",
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
            A D&amp;D name generator helps you create fantasy names that fit your
            character, NPC, or campaign setting—fast. It&apos;s especially useful
            for DMs who need names on the fly and for players who want a name
            that matches a race, culture, or vibe.
          </p>

          <p className="text-zinc-700 leading-7">
            If you want to jump straight into tools, start on{" "}
            <Link href="/en" className="underline underline-offset-4">
              the generator hub
            </Link>{" "}
            and pick a style you like.
          </p>
        </header>

        {/* ✅ Guide → Generator internal links (template) */}
        <RelatedGenerators
          hrefs={["/elf", "/dwarf", "/goblin", "/dragonborn"]}
          title="Start with these generators"
          note="Tip: Generate 10–20 names, save favorites, then tweak spelling or add a surname/title to match your setting."
        />

        {/* 内容块 1：How it works */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">
            How does a D&amp;D name generator work?
          </h2>
          <p className="text-zinc-700 leading-7">
            Most generators combine fantasy syllable patterns and style rules to
            create names that “sound right” for a race or culture. The best
            results come from generating a list, then refining one option by
            adjusting spelling, adding a surname, or mixing two names together.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
            <li>Generate multiple variations instantly</li>
            <li>Use race-flavored syllables (elf, dwarf, goblin, etc.)</li>
            <li>Perfect for PCs, NPCs, towns, factions, and quick DM prep</li>
          </ul>
        </section>

        {/* 内容块 2：Examples */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Examples of generated names</h2>
          <p className="text-zinc-700 leading-7">
            Use these as inspiration and tweak syllables to match your setting.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <ul className="space-y-2 text-zinc-700">
              <li>
                <span className="font-medium text-zinc-900">Elf:</span> Aerin
                Moonwhisper, Elywen Starbloom
              </li>
              <li>
                <span className="font-medium text-zinc-900">Dwarf:</span> Durgrim
                Stonehammer, Borin Ironbeard
              </li>
              <li>
                <span className="font-medium text-zinc-900">Goblin:</span> Snik
                Mudsnout, Krag Rustpicker
              </li>
              <li>
                <span className="font-medium text-zinc-900">Dragonborn:</span>{" "}
                Arjhan Flameheart, Rhogar Skywatcher
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <ul className="space-y-3">
            {faq.map((f) => (
              <li key={f.q}>
                <h3 className="font-medium">{f.q}</h3>
                <p className="text-zinc-700 leading-7">{f.a}</p>
              </li>
            ))}
          </ul>
        </section>

        <footer className="pt-2 text-sm text-zinc-600">
          Explore more:{" "}
          <Link className="underline" href="/guides/how-to-name-a-dnd-character">
            How to Name a D&amp;D Character
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/guides/elf-naming-conventions">
            Elf Naming Conventions
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/guides/dwarf-clan-names-and-traditions">
            Dwarf Clan Names &amp; Traditions
          </Link>
        </footer>
      </article>
    </main>
  );
}