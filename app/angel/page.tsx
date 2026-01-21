import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function AngelPage() {
  const title = "Angel Name Generator";
  const description = "Generate celestial angel names for D&D campaigns and fantasy worlds.";
  const path = "/angel";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is an angel name generator?",
        a: "An angel name generator creates celestial, fantasy-style names suitable for divine NPCs, holy warriors, and messengers.",
      },
      {
        q: "Can I use these names in a D&D campaign?",
        a: "Yes. These names are designed for D&D and fantasy settings and can be adapted to your pantheon, alignment, or lore.",
      },
      {
        q: "Do angel names have to sound 'holy'?",
        a: "Not necessarily. Some can be serene and graceful, while others can be stern and authoritative—choose what fits your character.",
      },
      {
        q: "Are these names from real-world religions?",
        a: "No. The generator outputs original fantasy-style names intended for inspiration in fictional worlds.",
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
            Angels in fantasy settings often represent divine power, judgment, and
            celestial order. Whether they appear as messengers, guardians, or
            radiant warriors, angelic characters benefit from names that feel
            ancient, graceful, and otherworldly.
          </p>

          <p className="text-zinc-700 leading-7">
            Looking for a darker counterpart? Try{" "}
            <Link href="/demon" className="underline underline-offset-4">
              demon names
            </Link>{" "}
            — or browse the full{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            collection.
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/demon" className="underline underline-offset-4">
                Demon Name Generator
              </Link>{" "}
              — sinister names for fiends and infernal villains.
            </li>
            <li>
              <Link href="/tiefling" className="underline underline-offset-4">
                Tiefling Name Generator
              </Link>{" "}
              — infernal-flavored names with a mysterious edge.
            </li>
            <li>
              <Link href="/human" className="underline underline-offset-4">
                Human Name Generator
              </Link>{" "}
              — flexible names for clerics, paladins, and NPCs.
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
          first: ["Aza", "Eli", "Ser", "Uri", "Rafa", "Cae", "Theo", "Lumi", "Aure", "Vera"],
          second: ["el", "iel", "aph", "ion", "ara", "ora", "eth", "ira", "eus", "ina"],
          lastA: ["Dawn", "Light", "Silver", "Star", "Halo", "Sun", "Radiant", "Sky", "Grace", "Heaven"],
          lastB: ["keeper", "wing", "warden", "song", "bearer", "shield", "glory", "seer", "blade", "watcher"],
        }}
        initialCount={10}
        examples={[
          "Azaiel Dawnkeeper",
          "Seraph Starwarden",
          "Uriara Lightshield",
          "Aureion Halowatcher",
          "Veraeth Radiantwing",
        ]}
      />
    </>
  );
}
