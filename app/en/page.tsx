import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import HomeSearch from "@/components/HomeSearch";
import { TOOLS } from "@/lib/tools";
import { getPageUrl } from "@/lib/site";

export default function EnHomePage() {
  const enUrl = getPageUrl("/en");

  const faq = [
    {
      q: "What is a D&D name generator?",
      a: "A D&D name generator is an online tool that helps you create fantasy character names for tabletop role-playing games like Dungeons & Dragons.",
    },
    {
      q: "How do I use these name generators?",
      a: "Choose a generator, click Generate, and copy the names you like for characters, NPCs, or stories.",
    },
    {
      q: "Are these names official D&D names?",
      a: "No. The names are generated for inspiration and are not official D&D canon.",
    },
    {
      q: "Can I use these names in my campaign or game?",
      a: "Yes. You can freely use the generated names in personal campaigns, games, or creative projects.",
    },
    {
      q: "Do you support different fantasy races?",
      a: "Yes. We support elves, dwarves, tieflings, dragonborn, and Eastern fantasy name styles.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "D&D Name Generators",
      url: enUrl,
      description: "Pick a generator, generate names, and copy your favorites.",
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: `${enUrl}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "D&D Name Generators (English)",
      itemListElement: TOOLS.map((t, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: t.title,
        url: getPageUrl(t.href),
      })),
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
      <JsonLd data={jsonLd} />

      <HomeSearch
        tools={TOOLS}
        headline="D&D Name Generators"
        subhead="Pick a generator, generate names, and copy your favorites."
        searchPlaceholder="Search: dwarf, elf, tiefling, dragonborn, xianxia..."
      />

      {/* ✅ 新增：可见 SEO 内容块（不影响你原有布局） */}
      <section className="mt-10 space-y-8 max-w-3xl">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">What is a D&amp;D Name Generator?</h2>
          <p className="text-zinc-700 leading-7">
            A D&amp;D name generator helps you create fantasy names that fit your character,
            NPC, or campaign setting—fast. Whether you&apos;re rolling up a new hero, improvising
            an NPC, or building world lore, the goal is the same: names that sound right and stay
            consistent at the table.
          </p>
          <p className="text-zinc-700 leading-7">
            Start with popular options like{" "}
            <Link href="/elf" className="underline underline-offset-4">
              elf name generator
            </Link>
            ,{" "}
            <Link href="/dwarf" className="underline underline-offset-4">
              dwarf name generator
            </Link>
            , or{" "}
            <Link href="/tiefling" className="underline underline-offset-4">
              tiefling name generator
            </Link>
            —then tweak spelling or syllables to make the result uniquely yours.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">How to use these generators</h2>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-700 leading-7">
            <li>Pick a generator that matches your character concept (ancestry, culture, or vibe).</li>
            <li>Click Generate until you find a name you like.</li>
            <li>Copy your favorites and save them for future characters, NPCs, towns, or factions.</li>
          </ol>
          <p className="text-zinc-700 leading-7">
            DM tip: keep a short list ready for merchants, guards, tavern owners, and travelers—your
            world will feel more alive with zero extra prep.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Popular generators</h2>
          <p className="text-zinc-700 leading-7">
            These are common needs in most campaigns:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li>
              <Link href="/elf" className="underline underline-offset-4 text-zinc-700">
                Elf Name Generator
              </Link>
            </li>
            <li>
              <Link href="/dwarf" className="underline underline-offset-4 text-zinc-700">
                Dwarf Name Generator
              </Link>
            </li>
            <li>
              <Link href="/tiefling" className="underline underline-offset-4 text-zinc-700">
                Tiefling Name Generator
              </Link>
            </li>
            <li>
              <Link href="/dragonborn" className="underline underline-offset-4 text-zinc-700">
                Dragonborn Name Generator
              </Link>
            </li>
            <li>
              <Link href="/eastern" className="underline underline-offset-4 text-zinc-700">
                Eastern Fantasy Name Generator
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 👇 你原来的“可见 FAQ”（保留） */}
      <section className="mt-12 space-y-4 max-w-3xl">
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
    </>
  );
}
