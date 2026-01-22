import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageUrl } from "@/lib/site";
import type { Metadata } from "next";
import RelatedGenerators from "@/components/RelatedGenerators";

export const metadata: Metadata = {
  title: "Dwarf Clan Names in D&D | Traditions, Surname Rules + Examples",
  description:
    "Learn D&D dwarf clan naming traditions: common structures, strong sounds, honor-titles, and 70+ surname examples. Includes tips and a dwarf name generator link.",
};

export default function DwarfClanNamesAndTraditionsPage() {
  const path = "/guides/dwarf-clan-names-and-traditions";
  const pageUrl = getPageUrl(path);

  const faq = [
    {
      q: "How do dwarf clan names work in D&D?",
      a: "Dwarf names often use a sturdy given name plus a clan surname that reflects craft, geography, an ancestor, or a legendary deed. Clan identity and honor are central themes, so surnames and titles matter a lot.",
    },
    {
      q: "Do dwarves always use a clan name?",
      a: "In many tables, yes—especially for traditional clans. But a dwarf raised outside dwarven society might use a nickname, an adopted family name, or a title earned through deeds instead.",
    },
    {
      q: "What sounds make a name feel dwarven?",
      a: "Dwarven names often use strong consonants and compact syllables—sounds like b, d, g, k, r, t, and hard clusters such as gr, br, dr, and th. The rhythm is usually short and punchy.",
    },
    {
      q: "Can I invent a dwarf clan name without strict lore?",
      a: "Absolutely. A simple formula—[Stone/Forge/Iron] + [hammer/beard/guard]—will feel “dwarven” at most tables. Keep it pronounceable and consistent with your setting’s tone.",
    },
    {
      q: "Can I use a generator for dwarf clan names?",
      a: "Yes. Use a generator to brainstorm quickly, then customize by swapping one word, adding a place-name, or tying the surname to your character’s backstory or craft.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Dwarf Clan Names in D&D",
      url: pageUrl,
      inLanguage: "en",
      description:
        "A practical guide to dwarf clan naming traditions in D&D: surname structures, phonetics, honor-titles, examples, and FAQs—with links to dwarf and related name generators.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "D&D Name Generators", item: getPageUrl("/en") },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: getPageUrl("/guides/dnd-name-generator-guide"),
        },
        { "@type": "ListItem", position: 3, name: "Dwarf Clan Names", item: pageUrl },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="mx-auto max-w-3xl px-4 mt-10 space-y-10">
        {/* Top nav */}
        <nav className="space-y-3">
          <Link
            href="/en"
            className="inline-block text-sm text-blue-600 underline underline-offset-4"
          >
            ← Back to all D&amp;D name generators
          </Link>

          <div className="text-sm text-zinc-600">
            <Link href="/en" className="underline underline-offset-4">
              Home
            </Link>{" "}
            / <span className="text-zinc-800 font-medium">Guides</span>
          </div>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Dwarf Clan Names in D&amp;D (Traditions + Examples)
          </h1>

          <p className="text-zinc-700 leading-7">
            Dwarf names in D&amp;D often carry the weight of <strong>craft</strong>,{" "}
            <strong>heritage</strong>, and <strong>honor</strong>. A dwarf’s clan name can hint at
            what their ancestors built, where they carved their halls, or which legendary deed their
            family is remembered for. This guide gives you repeatable rules for dwarf surnames,
            common structures, and ready-to-use examples.
          </p>

          {/* TL;DR for AI */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">In Short</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>Dwarf names are compact and punchy—strong consonants, clear rhythm.</li>
              <li>Common structure: given name + clan surname (often craft/place/deed-based).</li>
              <li>Honor titles and epithets are common and make great roleplay hooks.</li>
              <li>Use a generator to brainstorm, then customize one word to make it unique.</li>
            </ul>
          </section>

          {/* Quick links */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Quick links</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
              <li>
                Need instant names? Use the{" "}
                <Link href="/dwarf" className="underline underline-offset-4">
                  Dwarf Name Generator
                </Link>
                .
              </li>
              <li>
                Compare styles:{" "}
                <Link href="/elf" className="underline underline-offset-4">
                  elf
                </Link>
                ,{" "}
                <Link href="/orc" className="underline underline-offset-4">
                  orc
                </Link>{" "}
                and{" "}
                <Link href="/goblin" className="underline underline-offset-4">
                  goblin
                </Link>{" "}
                generators.
              </li>
              <li>
                Browse all tools on the{" "}
                <Link href="/en" className="underline underline-offset-4">
                  generator hub
                </Link>
                .
              </li>
            </ul>
          </section>
        </header>

        {/* Section: Phonetics */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1) The “dwarven sound” (phonetics)</h2>
          <p className="text-zinc-700 leading-7">
            Dwarven names tend to feel <strong>sturdy</strong> and <strong>grounded</strong>.
            You can get the vibe right with a few sound choices.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-medium">Fast sound checklist</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                Strong consonants: <em>b, d, g, k, r, t</em> (plus <em>th</em> and <em>kh</em> if you
                want extra grit).
              </li>
              <li>
                Common clusters: <em>gr, br, dr, kr, th</em>.
              </li>
              <li>
                Compact rhythm: aim for 1–3 syllables for the given name (e.g., “Borin”, “Thrain”).
              </li>
              <li>
                “Table test”: say it 3 times. If it’s awkward, shorten or simplify spelling.
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Structures */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2) Common dwarf surname structures</h2>
          <p className="text-zinc-700 leading-7">
            Dwarf clan names frequently point to <strong>craft</strong>, <strong>stonework</strong>,
            <strong> metals</strong>, or <strong>guardianship</strong>. Pick one structure and you’ll
            sound consistent immediately.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-medium">Copy-paste structures</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                <span className="font-medium text-zinc-900">[Material] + [Craft/Tool]:</span>{" "}
                Ironhammer, Stoneforge, Goldsmith
              </li>
              <li>
                <span className="font-medium text-zinc-900">[Place] + [Guard/Keep]:</span>{" "}
                Deepdelve, Gatewarden, Mountainkeep
              </li>
              <li>
                <span className="font-medium text-zinc-900">[Trait] + [Beard/Shield]:</span>{" "}
                Strongbeard, Broadshield
              </li>
              <li>
                <span className="font-medium text-zinc-900">[Deed] + [Breaker/Bane]:</span>{" "}
                Orcbane, Oathbreaker (villain), Wyrmbreaker
              </li>
              <li>
                <span className="font-medium text-zinc-900">Given + “son/dottir”:</span>{" "}
                Borinson, Thraindottir (table/setting dependent)
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Traditions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3) Traditions: honor, craft, and ancestors</h2>
          <p className="text-zinc-700 leading-7">
            Dwarven culture is often portrayed as tradition-heavy. Use these traditions to add
            instant depth without writing a novel of backstory.
          </p>

          <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
            <li>
              <strong>Craft-first identity:</strong> a surname that signals trade (forge, smith,
              mason, brewer) feels authentic.
            </li>
            <li>
              <strong>Ancestor reverence:</strong> clan lines may preserve founder names in titles
              (e.g., “Heir of Durgrim”).
            </li>
            <li>
              <strong>Oaths and grudges:</strong> epithets like “Oathkeeper” or “Grudgebearer” create
              immediate hooks.
            </li>
            <li>
              <strong>Hall and hold names:</strong> some dwarves reference their stronghold (“of
              Stonegate”, “of Deepdelve”).
            </li>
          </ul>
        </section>

        {/* Section: Titles */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4) Honor-titles and epithets</h2>
          <p className="text-zinc-700 leading-7">
            Titles are a fast way to give your dwarf story weight. They also help at the table: even
            if people forget the surname, they remember “the Anvilbearer.”
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-medium">Title ideas</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 leading-7">
              <li>
                <strong>Craft:</strong> Anvilbearer, Runecarver, Forgewarden
              </li>
              <li>
                <strong>Defense:</strong> Gatekeeper, Shieldthane, Hallguard
              </li>
              <li>
                <strong>Oath:</strong> Oathkeeper, Grudgebearer, Stonebound
              </li>
              <li>
                <strong>Deed:</strong> Wyrmbreaker, Orcbane, Tunnelrunner
              </li>
            </ul>
          </div>
        </section>

        {/* Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Dwarf clan name examples (ready to use)</h2>
          <p className="text-zinc-700 leading-7">
            Pick a given name you like, then choose a clan surname that matches the character’s
            craft or history. Swap one word to make it uniquely yours.
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-6">
            <div>
              <h3 className="font-medium">Classic craft &amp; stone</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                <li>Thrain Ironhammer</li>
                <li>Borin Stoneforge</li>
                <li>Durgrim Granitebeard</li>
                <li>Brokk Goldsmith</li>
                <li>Helja Deepdelve</li>
                <li>Rurik Stonewarden</li>
                <li>Hilda Coppermantle</li>
                <li>Gromli Anvilson</li>
                <li>Brunna Shieldthane</li>
                <li>Torin Runecarver</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Hall / hold / guardians</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                <li>Krag Gatewarden</li>
                <li>Thora Mountainkeep</li>
                <li>Dagna Hallguard</li>
                <li>Vigdis Stonegate</li>
                <li>Brom Deepvault</li>
                <li>Sigrid Tunnelwatch</li>
                <li>Hjori Ironhold</li>
                <li>Runa Keepwarden</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Oaths, grudges, and deeds</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
                <li>Thrain Oathkeeper</li>
                <li>Brunna Grudgebearer</li>
                <li>Durgrim Wyrmbreaker</li>
                <li>Helja Orcbane</li>
                <li>Rurik Stonebound</li>
                <li>Dagna Forgewarden</li>
                <li>Brokk Anvilbearer</li>
                <li>Torin Hammerfall</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Fast workflow: generator → clan identity</h2>
          <p className="text-zinc-700 leading-7">
            The fastest way to build a dwarven-feeling full name is to generate a shortlist, then
            lock in a clan theme (craft, place, or deed).
          </p>

          <ol className="list-decimal pl-5 space-y-2 text-zinc-700 leading-7">
            <li>
              Generate 10–20 names on the{" "}
              <Link href="/dwarf" className="underline underline-offset-4">
                Dwarf Name Generator
              </Link>
              .
            </li>
            <li>Pick a given name that’s easy to say at the table.</li>
            <li>Choose a clan theme: craft, hold, or deed—then select a matching surname.</li>
            <li>
              For different vibes, compare{" "}
              <Link href="/elf" className="underline underline-offset-4">
                elf
              </Link>{" "}
              (melodic),{" "}
              <Link href="/orc" className="underline underline-offset-4">
                orc
              </Link>{" "}
              (harsh), and{" "}
              <Link href="/goblin" className="underline underline-offset-4">
                goblin
              </Link>{" "}
              (punchy) styles.
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
        <RelatedGenerators hrefs={["/dwarf", "/human", "/orc"]} />

      </article>
    </>
  );
}
