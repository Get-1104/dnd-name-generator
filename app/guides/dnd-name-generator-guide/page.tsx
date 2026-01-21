import type { Metadata } from "next";
import Link from "next/link";
import { getPageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "What Is a D&D Name Generator? Complete Guide + Examples",
  description:
    "Learn what a D&D name generator is, how it works, and how to create names for elves, dwarves, goblins, and more. Includes examples and FAQs.",
};

export default function DndNameGeneratorGuidePage() {
  const title = "What Is a D&D Name Generator? (Complete Guide)";
  const description =
    "A practical guide to D&D name generators: how they work, how to use them, and examples for popular fantasy races.";
  const path = "/guides/dnd-name-generator-guide";

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

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: getPageUrl(path),
      inLanguage: "en",
      isPartOf: {
        "@type": "WebSite",
        name: "D&D Name Generators",
        url: getPageUrl("/en"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "D&D Name Generators",
          item: getPageUrl("/en"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: getPageUrl("/guides/dnd-name-generator-guide"),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];

  return (
    <>
      {/* ✅ JSON-LD（保持和工具页一样：直接 script 注入） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-6">
        {/* ✅ Back（统一回 /en） */}
        <Link
          href="/en"
          className="inline-block text-sm text-blue-600 underline underline-offset-4"
        >
          ← Back to all D&amp;D name generators
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

          <p className="text-zinc-700 leading-7">
            A D&amp;D name generator helps you create fantasy names that fit your character,
            NPC, or campaign setting—fast. It&apos;s especially useful for DMs who need names on
            the fly and for players who want a name that matches a race, culture, or vibe.
          </p>

          <p className="text-zinc-700 leading-7">
            If you want to jump straight into tools, start on{" "}
            <Link href="/en" className="underline underline-offset-4">
              the generator hub
            </Link>{" "}
            and pick a style you like.
          </p>
        </header>

        {/* ✅ Related generators（风格对齐工具页的卡片组件） */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/elf" className="underline underline-offset-4">
                Elf Name Generator
              </Link>{" "}
              — elegant, melodic names for fantasy elves.
            </li>
            <li>
              <Link href="/dwarf" className="underline underline-offset-4">
                Dwarf Name Generator
              </Link>{" "}
              — sturdy, clan-based names for dwarves.
            </li>
            <li>
              <Link href="/goblin" className="underline underline-offset-4">
                Goblin Name Generator
              </Link>{" "}
              — short, punchy names for goblins and raiders.
            </li>
            <li>
              <Link href="/dragonborn" className="underline underline-offset-4">
                Dragonborn Name Generator
              </Link>{" "}
              — strong draconic names inspired by honor and lineage.
            </li>
          </ul>
        </div>

        {/* ✅ 内容块 1：How it works */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How does a D&amp;D name generator work?</h2>
          <p className="text-zinc-700 leading-7">
            Most generators combine fantasy syllable patterns and style rules to create names
            that “sound right” for a race or culture. The best results come from generating a
            list, then refining one option by adjusting spelling, adding a surname, or mixing
            two names together.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
            <li>Generate multiple variations instantly</li>
            <li>Use race-flavored syllables (elf, dwarf, goblin, etc.)</li>
            <li>Perfect for PCs, NPCs, towns, factions, and quick DM prep</li>
          </ul>
        </section>

        {/* ✅ 内容块 2：Examples */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Examples of generated names</h2>
          <p className="text-zinc-700 leading-7">
            Use these as inspiration and tweak syllables to match your setting.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <ul className="space-y-2 text-zinc-700">
              <li>
                <span className="font-medium text-zinc-900">Elf:</span> Aerin Moonwhisper, Elywen
                Starbloom
              </li>
              <li>
                <span className="font-medium text-zinc-900">Dwarf:</span> Durgrim Stonehammer,
                Borin Ironbeard
              </li>
              <li>
                <span className="font-medium text-zinc-900">Goblin:</span> Snik Mudsnout, Krag
                Rustpicker
              </li>
              <li>
                <span className="font-medium text-zinc-900">Dragonborn:</span> Arjhan Flameheart,
                Rhogar Skywatcher
              </li>
            </ul>
          </div>
        </section>

        {/* ✅ 可见 FAQ（AI 很喜欢引用这种结构） */}
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
      </section>
    </>
  );
}
