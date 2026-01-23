import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";
import { getRelatedGeneratorHrefs } from "@/lib/related";

export const metadata = createPageMetadata({
  title: "Angel Name Generator for D&D | Celestial Fantasy Names",
  description: "Generate celestial angel names for D&D campaigns and fantasy worlds. Fast, free, and easy to use.",
  path: "/angel",
});

export default function AngelPage() {
  const title = "Angel Name Generator";
  const description =
    "Generate celestial angel names for D&D campaigns and fantasy worlds.";
  const path = "/angel";

  

  const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });
const faq = [
    {
      q: "What is an angel name generator?",
      a: "An angel name generator creates celestial-style names you can use for angels, devas, heralds, and holy NPCs in D&D and fantasy settings.",
    },
    {
      q: "How do I use this angel name generator?",
      a: "Click Generate to create a fresh list of angel names, then use Copy to copy your favorites for your campaign notes or character sheet.",
    },
    {
      q: "What makes a name feel angelic or celestial?",
      a: "Celestial names often sound melodic and dignified, with flowing syllables and bright, uplifting themes. Titles like “Herald”, “Warden”, or “Lightbearer” can add weight.",
    },
    {
      q: "Are these names official D&D names?",
      a: "They are randomly generated fantasy-style names intended for inspiration and are not official D&D canon content.",
    },
  ];

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq,
  });

  return (
    <div className="space-y-10">
      <JsonLd data={jsonLd} />

      {/* Top intro */}
      <header className="space-y-3">
<h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

        <p className="text-zinc-700 leading-7">
          Use this angel name generator to create celestial, uplifting names for
          angels, heralds, and holy NPCs in D&amp;D. Angelic names often sound
          melodic and dignified—perfect for guardians, messengers, and beings of
          radiant purpose. Generate a shortlist, then refine spellings or add a
          title to match your world’s cosmology.
        </p>

        <p className="text-zinc-700 leading-7">
          Want darker opposites? Compare with{" "}
          <Link href="/demon" className="underline underline-offset-4">
            demon names
          </Link>{" "}
          or infernal-flavored{" "}
          <Link href="/tiefling" className="underline underline-offset-4">
            tiefling names
          </Link>
          .
        </p>
      </header>

      {/* Generator */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <NameGenerator
            hideHeader
            title={title}
            description={description}
            parts={{
              first: ["Ael", "Ser", "Ely", "Aur", "Lumi", "Cael", "Ori", "Iri", "Thael", "Vae"],
              second: ["riel", "aph", "anor", "iel", "vion", "thiel", "liel", "siel", "miel", "diel"],
              lastA: ["Radiant", "Dawn", "Sun", "Light", "Silver", "Star", "Sky", "Grace", "Halo", "Golden"],
              lastB: ["wing", "ward", "bearer", "song", "watcher", "spear", "crown", "shield", "voice", "keeper"],
            }}
            initialCount={10}
            examples={[
              "Aelriel Radiantwing",
              "Elyanor Dawnwatcher",
              "Auriel Lightbearer",
              "Caelvion Starward",
              "Lumisiel Gracekeeper",
            ]}
          />
        </div>

        <p className="text-xs text-zinc-500">
          Tip: Celestial names feel more “mythic” when you add a title: “Herald of
          Dawn”, “Warden of the Gate”, or “Lightbearer”.
        </p>
      </section>

      {/* ✅ Generator → Guide internal links (闭环) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Make celestial names memorable</h2>
        <p className="text-zinc-700 leading-7">
          Celestial NPCs often appear as major story beats. These guides help you
          create names that are easy to say, consistent with your world, and
          instantly recognizable at the table.
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/guides/how-to-name-a-dnd-character"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            How to Name a D&amp;D Character (Guide)
          </Link>
          <Link
            href="/guides/dnd-name-generator-guide"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            What Is a D&amp;D Name Generator? (Guide)
          </Link>
        </div>
      </section>

      {/* ✅ Related generators */}
      <RelatedGenerators
        hrefs={relatedHrefs}
        title="Try related name generators"
        note="Tip: Give angels longer, ceremonial titles, but keep a short nickname for table play if they appear frequently."
      />

      {/* Visible FAQ */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">FAQ</h2>

        <div className="space-y-3">
          {faq.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="font-medium">{f.q}</div>
              <p className="text-zinc-700 leading-7 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-2 text-sm text-zinc-600">
        Explore more:{" "}
        <Link className="underline" href="/demon">
          Demon
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/tiefling">
          Tiefling
        </Link>{" "}
        ·{" "}
        <Link className="underline" href="/elf">
          Elf
        </Link>
      </footer>
    </div>
  );
}