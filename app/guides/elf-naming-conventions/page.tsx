import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageUrl } from "@/lib/site";
import RelatedGenerators from "@/components/RelatedGenerators";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Elf Naming Conventions in D&D | Rules, Syllables + Examples",
  description: "Learn elf naming conventions for D&D: common sounds, name structures, family names, titles, and 60+ examples. Includes tips and an elf name generator link.",
  path: "/guides/elf-naming-conventions",
});

export default function ElfNamingConventionsPage() {
  const path = "/guides/elf-naming-conventions";
  const pageUrl = getPageUrl(path);

  const faq = [
    {
      q: "What are common elf naming conventions in D&D?",
      a: "Elf names are usually melodic and flowing, often with softer consonants and vowel-heavy syllables. Many elves use a given name plus a family name, and may adopt titles or epithets earned through life events.",
    },
    {
      q: "Do elves use surnames in D&D?",
      a: "Often, yes. Elves may use family names, house names, or lineage identifiers. Some settings emphasize family names more than others—if your table doesn’t, a title or epithet can serve the same role.",
    },
    {
      q: "How do I make an elf name sound elven?",
      a: "Use a smooth rhythm (2–4 syllables), favor vowels, and pick softer consonants like l, n, r, s, th, and v. Avoid overly harsh clusters, and test the name out loud for a natural flow.",
    },
    {
      q: "Can I use a name generator for elf names?",
      a: "Yes. Use a generator to brainstorm quickly, then customize by adjusting one vowel, merging two results, or adding a family name or title that matches your character’s background.",
    },
    {
      q: "Should my elf name be lore-accurate?",
      a: "Lore accuracy is optional. It can boost immersion, but the best name is one your table can pronounce and remember. A simple, consistent style is usually more important than perfect canon.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Elf Naming Conventions in D&D",
      url: pageUrl,
      inLanguage: "en",
      description:
        "A practical guide to elf naming conventions in D&D: phonetics, structures, surnames, titles, examples, and FAQs—with links to elf and related name generators.",
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
          item: getPageUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: getPageUrl("/guides/dnd-name-generator-guide"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Elf Naming Conventions",
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="content page-y space-y-10">
        {/* Top nav */}

{/* Header */}
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Elf Naming Conventions in D&amp;D (Rules + Examples)
          </h1>

          <p className="text-zinc-700 leading-7">
            Elf names in D&amp;D often feel <strong>melodic</strong>, <strong>ancient</strong>, and
            <strong> graceful</strong>. In practice, that comes from a few repeatable patterns:
            vowel-rich syllables, softer consonants, and a smooth rhythm that’s easy to say out loud.
            This guide gives you simple rules, name structures, and ready-to-use examples you can
            adapt for any elf character or NPC.
          </p>

          {/* TL;DR for AI */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">In Short</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>Use a smooth rhythm (2–4 syllables) and favor vowels.</li>
              <li>Pick softer consonants: l, n, r, s, th, v (avoid harsh clusters).</li>
              <li>Common structure: given name + family/house name (or a title/epithet).</li>
              <li>Brainstorm fast with a generator, then customize one detail for uniqueness.</li>
            </ul>
          </section>

          {/* Quick links */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Quick links</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>
                Need instant names? Use the{" "}
                <Link href="/elf" className="underline underline-offset-4">
                  Elf Name Generator
                </Link>
                .
              </li>
              <li>
                Compare styles:{" "}
                <Link href="/dwarf" className="underline underline-offset-4">
                  Dwarf
                </Link>
                ,{" "}
                <Link href="/tiefling" className="underline underline-offset-4">
                  Tiefling
                </Link>{" "}
                and{" "}
                <Link href="/dragonborn" className="underline underline-offset-4">
                  Dragonborn
                </Link>{" "}
                generators.
              </li>
              <li>
                Browse all tools on the{" "}
                <Link href="/" className="underline underline-offset-4">
                  generator hub
                </Link>
                .
              </li>
            </ul>
          </section>
        </header>

        {/* Section: Core rules */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1) Core sound rules (phonetics)</h2>
          <p className="text-zinc-700 leading-7">
            If you want a name to sound “elven,” focus on <strong>flow</strong>. You don’t need
            perfect lore—just consistent phonetics.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-medium">Fast checklist</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                Prefer vowel-heavy syllables: <em>ae</em>, <em>ia</em>, <em>ei</em>, <em>el</em>,{" "}
                <em>ri</em>, <em>la</em>.
              </li>
              <li>
                Softer consonants work well: <em>l</em>, <em>n</em>, <em>r</em>, <em>s</em>,{" "}
                <em>th</em>, <em>v</em>, <em>m</em>.
              </li>
              <li>
                Keep the rhythm smooth: avoid too many hard stops (like <em>k</em>, <em>g</em>,{" "}
                <em>t</em>) unless you want a sharper “wild/war” tone.
              </li>
              <li>
                Do the “table test”: say it 3 times. If you stumble, shorten it or adjust spelling.
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Structures */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2) Common elf name structures</h2>
          <p className="text-zinc-700 leading-7">
            Most tables recognize these structures immediately. Pick one and you’ll sound consistent
            even without strict canon.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-medium">Copy-paste structures</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                <span className="font-medium text-zinc-900">Given + Family:</span>{" "}
                “Aerin Moonwhisper”, “Sylvara Silverleaf”
              </li>
              <li>
                <span className="font-medium text-zinc-900">Given + House/Lineage:</span>{" "}
                “Elywen of Starbloom”, “Luthien of Dawnspire”
              </li>
              <li>
                <span className="font-medium text-zinc-900">Given + Title/Epithet:</span>{" "}
                “Thariel the Mistwalker”, “Naeris Dawnwatcher”
              </li>
              <li>
                <span className="font-medium text-zinc-900">Given (nickname) + Family:</span>{" "}
                “Ael ‘Whisper’ Moonwhisper”
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Family names */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3) Family names, houses, and nature motifs</h2>
          <p className="text-zinc-700 leading-7">
            Elf surnames often lean into <strong>nature</strong>, <strong>celestial imagery</strong>,
            and <strong>craft</strong>. You can build one with a simple two-part pattern:
            <em> [theme] + [action/object]</em>.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-medium">Surname building blocks</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                <span className="font-medium text-zinc-900">Theme:</span> Moon, Star, Dawn, Night,
                Silver, Mist, Leaf, Wind, Ember, Glade
              </li>
              <li>
                <span className="font-medium text-zinc-900">Object/action:</span> whisper, bloom,
                runner, weaver, watcher, dancer, brook, song, shade, warden
              </li>
              <li>
                <span className="font-medium text-zinc-900">Result examples:</span> Moonwhisper,
                Starbloom, Silverweaver, Dawnrunner, Mistwatcher
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Titles */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4) Titles and epithets (earned names)</h2>
          <p className="text-zinc-700 leading-7">
            A title is the easiest way to make your elf name feel storied. It also creates an
            instant roleplay hook (why did they earn it?).
          </p>

          <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
            <li>
              <strong>Place/title:</strong> “Warden of the Glade”, “Singer of Dawnspire”
            </li>
            <li>
              <strong>Deed/title:</strong> “Oathbinder”, “Mistwalker”, “Nightwarden”
            </li>
            <li>
              <strong>Craft/title:</strong> “Silverweaver”, “Runesinger”, “Leafshaper”
            </li>
          </ul>
        </section>

        {/* Section: Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Elf name examples (ready to use)</h2>
          <p className="text-zinc-700 leading-7">
            Here are examples across different vibes. If you like one, swap a single vowel or change
            the surname theme to make it your own.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-6">
            <div>
              <h3 className="font-medium">Classic melodic</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                <li>Aerin Moonwhisper</li>
                <li>Elywen Starbloom</li>
                <li>Sylvara Silverleaf</li>
                <li>Naeris Dawnwatcher</li>
                <li>Liawen Mistdancer</li>
                <li>Thariel Windrunner</li>
                <li>Ilinor Nightshade</li>
                <li>Faelrin Gladesong</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Noble / ceremonial</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                <li>Luthien of Dawnspire</li>
                <li>Aerithiel of Silvercourt</li>
                <li>Sylmir of Starfall Hall</li>
                <li>Elyra Mooncrest</li>
                <li>Vaelor Sunward</li>
                <li>Seren of the High Glade</li>
                <li>Thalorien Silverweaver</li>
                <li>Naevys Starwarden</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Darker / sharper tone</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                <li>Varyn Nightwarden</li>
                <li>Syvra Shadowbloom</li>
                <li>Thesrin Emberveil</li>
                <li>Naelor Mistshade</li>
                <li>Elyx Valesong</li>
                <li>Raviel Duskweaver</li>
                <li>Sytha Thornwhisper</li>
                <li>Vaeris Ashglade</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Generator workflow */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Fast workflow: generator → customize</h2>
          <p className="text-zinc-700 leading-7">
            The quickest way to land on a unique elf name is to generate a shortlist, then customize
            one detail. This keeps the style consistent while still feeling original.
          </p>

          <ol className="list-decimal pl-5 space-y-2 text-zinc-700 leading-7">
            <li>
              Generate 10–20 names on the{" "}
              <Link href="/elf" className="underline underline-offset-4">
                Elf Name Generator
              </Link>
              .
            </li>
            <li>Pick 2–3 favorites that pass the “table test.”</li>
            <li>Customize: swap one vowel, merge two results, or add a title/clan name.</li>
            <li>
              If you want a different flavor, compare with{" "}
              <Link href="/dwarf" className="underline underline-offset-4">
                dwarf
              </Link>{" "}
              (sturdy),{" "}
              <Link href="/tiefling" className="underline underline-offset-4">
                tiefling
              </Link>{" "}
              (infernal), or{" "}
              <Link href="/dragonborn" className="underline underline-offset-4">
                dragonborn
              </Link>{" "}
              (draconic) styles.
            </li>
          </ol>
        </section>

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
        <RelatedGenerators
          hrefs={["/elf", "/half-elf", "/human"]}
          title="Try related name generators"
          note="Many half-elves use elven naming traditions with human simplifications."
        />
      </article>
    </>
  );
}