import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import RelatedGenerators from "@/components/RelatedGenerators";
import { createPageMetadata } from "@/lib/metadata";
import { getPageUrl } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Dragonborn Naming Conventions in D&D | Clan Names + Examples",
  description:
    "Learn dragonborn naming conventions for D&D: personal names, clan names, traditions, and 40+ examples. Includes FAQs and a dragonborn name generator link.",
  path: "/guides/dragonborn-naming-conventions",
});

export default function DragonbornNamingConventionsPage() {
  const path = "/guides/dragonborn-naming-conventions";
  const pageUrl = getPageUrl(path);

  const faq = [
    {
      q: "How do dragonborn names work in D&D?",
      a: "Dragonborn names typically include a personal name plus a clan name. Many tables treat clan names like surnames that signal heritage, honor, and reputation.",
    },
    {
      q: "Do dragonborn use clan names as last names?",
      a: "Often, yes. A dragonborn might introduce themselves with a personal name and clan name, especially in formal situations or when honor and lineage matter.",
    },
    {
      q: "How do I make a dragonborn name sound draconic?",
      a: "Use strong consonants (k, g, r, z) and clear syllables. Keep it pronounceable—2–4 syllables for the personal name is a good default.",
    },
    {
      q: "Can I use a dragonborn name generator?",
      a: "Yes. Generate a batch, then customize one detail—swap a vowel, add a title, or adjust the clan name to match your character’s vibe.",
    },
    {
      q: "Should dragonborn names be lore-accurate?",
      a: "Lore accuracy is optional. Consistency and table readability matter more than perfect canon—pick a style and stick with it.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Dragonborn Naming Conventions in D&D",
      url: pageUrl,
      inLanguage: "en",
      description:
        "A practical guide to dragonborn naming conventions in D&D: personal names, clan names, traditions, examples, and FAQs—with a dragonborn name generator link.",
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
          item: getPageUrl("/guides"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Dragonborn Naming Conventions",
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="content page-y space-y-10">

<header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Dragonborn Naming Conventions in D&amp;D (Clan Names + Examples)
          </h1>

          <p className="text-zinc-700 leading-7">
            Dragonborn names usually aim for a <strong>draconic</strong>, <strong>honorable</strong>
            , and <strong>memorable</strong> feel. The easiest way to get there is to use a strong
            personal name plus a clan name that signals heritage. This guide gives you a simple
            structure you can reuse, plus examples you can copy and tweak.
          </p>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">In Short</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>Common structure: personal name + clan name (surname-like).</li>
              <li>Use strong consonants (k, g, r, z) but keep names pronounceable.</li>
              <li>Clan names can be meaning-based (stone, flame, storm) or lineage-based.</li>
              <li>Generate a batch, then customize one detail for uniqueness.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Quick links</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>
                Need instant names? Use the{" "}
                <Link href="/dragonborn" className="underline underline-offset-4">
                  Dragonborn Name Generator
                </Link>
                .
              </li>
              <li>
                Compare naming styles: {" "}
                <Link href="/dwarf" className="underline underline-offset-4">
                  Dwarf
                </Link>
                ,{" "}
                <Link href="/tiefling" className="underline underline-offset-4">
                  Tiefling
                </Link>
                , and{" "}
                <Link href="/orc" className="underline underline-offset-4">
                  Orc
                </Link>
                .
              </li>
            </ul>
          </section>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1) Personal name: strong, clear syllables</h2>
          <p className="text-zinc-700 leading-7">
            A dragonborn personal name should feel firm and direct. Avoid long, twisty spellings.
            Aim for 2–4 syllables and test it out loud.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-medium">Sound checklist</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                Strong consonants: <em>k</em>, <em>g</em>, <em>r</em>, <em>z</em>, <em>th</em>.
              </li>
              <li>
                Clear rhythm: avoid too many silent letters or unusual clusters.
              </li>
              <li>
                Keep it table-friendly: if your group can say it once, they can remember it.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2) Clan name: heritage and reputation</h2>
          <p className="text-zinc-700 leading-7">
            The clan name does a lot of narrative work. It can hint at origin, deeds, or values.
            Choose a clan name that supports your character concept—honor, vengeance, scholarship,
            or duty.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-medium">Easy clan name themes</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                <span className="font-medium text-zinc-900">Elemental:</span> Flame, Ash, Storm,
                Frost
              </li>
              <li>
                <span className="font-medium text-zinc-900">Stone/Metal:</span> Iron, Granite,
                Obsidian
              </li>
              <li>
                <span className="font-medium text-zinc-900">Virtue/Deed:</span> Oath, Honor,
                Vengeance
              </li>
              <li>
                <span className="font-medium text-zinc-900">Lineage-style:</span> -mir, -vyr,
                -daar (use consistent suffixes)
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3) Examples you can steal</h2>
          <p className="text-zinc-700 leading-7">
            Use these as-is or swap one syllable to make them your own.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-800">
              {[
                "Arjhan Flameward",
                "Balasar Ironscale",
                "Donaar Stormcrest",
                "Ghesh Ashmantle",
                "Heskan Graniteclaw",
                "Kriv Oathbinder",
                "Medrash Obsidianbrand",
                "Nadarr Frostvein",
                "Patrin Emberfall",
                "Rhogar Honorstone",
                "Tarhun Vengeance-sire",
                "Torinn Skyshard",
              ].map((name) => (
                <li key={name} className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Try related generators</h2>
          <p className="text-zinc-700 leading-7">
            If you want a different naming vibe, compare a few generators—it helps you choose a
            consistent style for your world.
          </p>
          <RelatedGenerators
            hrefs={["/dragonborn", "/dwarf", "/tiefling", "/orc"]}
            extraLinks={[
              { href: "/en", label: "Browse all generators" },
              { href: "/guides", label: "Read more naming guides" },
            ]}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="space-y-4">
            {faq.map((f) => (
              <details
                key={f.q}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <summary className="cursor-pointer font-medium text-zinc-900">{f.q}</summary>
                <p className="mt-2 text-zinc-700 leading-7">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}