import Link from "next/link";
import SmartSearch from "@/components/SmartSearch";
import JsonLd from "@/components/JsonLd";
import SocialProof from "@/components/SocialProof";
import { TOOLS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { getPageUrl, SITE } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "D&D Name Generators | Fantasy Character Name Generator Tools",
  description:
    "Free D&D name generators for fantasy characters and NPCs. Generate elf, dwarf, orc, dragonborn, and more names for your campaign.",
  path: "/en",
});

export default function EnHomePage() {
  const enUrl = getPageUrl("/en");

  const faq = [
    {
      q: "What is a D&D name generator?",
      a: "A D&D name generator helps you create fantasy-style names for characters, NPCs, and locations in Dungeons & Dragons campaigns. It saves time and keeps names consistent with different races and settings.",
    },
    {
      q: "Can I use these generated names in my campaign?",
      a: "Yes. All names generated on this site are intended for creative use in tabletop RPGs, writing projects, and personal campaigns. You are free to modify or adapt them as needed.",
    },
    {
      q: "Are these names official D&D canon names?",
      a: "No. The names are randomly generated fantasy-style names created for inspiration. They are not official Wizards of the Coast or D&D canon content.",
    },
    {
      q: "How do I choose the right name for my character?",
      a: "Start with a generator that matches your character’s ancestry or concept, then generate several options. Tweak spelling, add titles, or combine elements until the name fits your character’s story.",
    },
    {
      q: "Do different fantasy races have different naming styles?",
      a: "Yes. Elf names are often melodic, dwarf names emphasize clan heritage, and orc names tend to sound harsher and more direct. Race-specific generators help keep names believable.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "D&D Name Generators",
      url: enUrl,
      description:
        "Browse D&D name generators by fantasy race and naming guides for lore-friendly character naming.",
      inLanguage: "en",
      isPartOf: {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
      },
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
      "@type": "ItemList",
      name: "D&D Naming Guides (English)",
      itemListElement: GUIDES.map((g, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: g.title,
        url: getPageUrl(g.href),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];

  const quotes = [
    { text: "Helped me name 20 NPCs in one session without breaking immersion.", author: "DM (homebrew campaign)" },
    { text: "The race-specific generators save time and the names feel consistent.", author: "Player (weekly group)" },
    { text: "I generate a list, mix syllables, and get something that fits my setting fast.", author: "DM (one-shot prep)" },
  ];

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <JsonLd data={jsonLd} />

      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">D&D Name Generators</h1>
          <p className="text-lg text-zinc-700">
            A collection of free name generators designed around <span className="font-medium">race, culture, and lore-friendly tone</span>—built for DMs and players who need good names fast.
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold">Great for</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Naming PCs &amp; NPCs</li>
              <li>Clans, families, and factions</li>
              <li>Quick one-shot prep</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">How it works</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Pick a generator</li>
              <li>Click Generate</li>
              <li>Copy your favorites</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Tip</p>
            <p className="mt-2 text-sm text-zinc-700">
              Generate a few batches, then tweak spelling or add a title to match your setting.
            </p>
          </div>
        </div>

        <SmartSearch />

        <p className="text-sm text-zinc-600">
          Prefer a quick start? Try{" "}
          <Link className="text-blue-600 underline" href="/elf">
            Elf
          </Link>
          ,{" "}
          <Link className="text-blue-600 underline" href="/dwarf">
            Dwarf
          </Link>
          ,{" "}
          <Link className="text-blue-600 underline" href="/tiefling">
            Tiefling
          </Link>{" "}
          or{" "}
          <Link className="text-blue-600 underline" href="/eastern">
            Xianxia / Wuxia
          </Link>
          .
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Name generators</h2>
        <p className="text-sm text-zinc-700">
          Race-focused generators for consistent naming style.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold">{t.title}</p>
                <p className="text-sm text-zinc-700">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Naming guides</h2>
        <p className="text-sm text-zinc-700">
          Lore and naming conventions to help you pick names that fit your world.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold">{g.title}</p>
                <p className="text-sm text-zinc-700">{g.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-sm text-zinc-600">
          Want everything in one place? Visit the{" "}
          <Link className="text-blue-600 underline" href="/guides">
            Guides hub
          </Link>
          .
        </p>
      </section>

      <SocialProof quotes={quotes} />

      <section className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="space-y-3">
          {faq.map((item) => (
            <details key={item.q} className="rounded-xl border bg-zinc-50 p-4">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-2 text-sm text-zinc-700">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
