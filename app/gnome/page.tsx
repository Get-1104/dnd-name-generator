import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function GnomePage() {
  const title = "Gnome Name Generator";
  const description = "Generate clever gnome names for D&D characters and NPCs.";
  const path = "/gnome";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a gnome name generator?",
        a: "A gnome name generator creates whimsical fantasy gnome names for D&D characters, NPCs, and worldbuilding.",
      },
      {
        q: "Do these names fit rock gnomes and forest gnomes?",
        a: "Yes. The names are flexible and can work for different gnome cultures—adjust spelling or add a nickname to fit your setting.",
      },
      {
        q: "How do I get more name options?",
        a: "Click Generate again for a fresh list. You can also mix parts or combine names to create your own variants.",
      },
      {
        q: "Can I use these names in my campaign freely?",
        a: "Yes. The names are original fantasy-style results intended for inspiration and use in your projects.",
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
            Gnomes are curious, inventive, and full of personality in D&amp;D.
            Whether you&apos;re naming a clever artificer, a mischievous illusionist,
            or a scholar with a pocket full of gadgets, a gnome name should feel
            light, lively, and memorable.
          </p>

          <p className="text-zinc-700 leading-7">
            Want a different vibe? Browse the{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            hub, or try something sturdier like{" "}
            <Link href="/dwarf" className="underline underline-offset-4">
              dwarf names
            </Link>{" "}
            or more elegant like{" "}
            <Link href="/elf" className="underline underline-offset-4">
              elf names
            </Link>
            .
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/dwarf" className="underline underline-offset-4">
                Dwarf Name Generator
              </Link>{" "}
              — grounded names that work well for close-knit clans.
            </li>
            <li>
              <Link href="/elf" className="underline underline-offset-4">
                Elf Name Generator
              </Link>{" "}
              — melodic names for ancient forests and noble courts.
            </li>
            <li>
              <Link href="/human" className="underline underline-offset-4">
                Human Name Generator
              </Link>{" "}
              — flexible names for any region or background.
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
          first: ["Bil", "Fen", "Nib", "Pip", "Tink", "Wen", "Zan", "Mop", "Rin", "Quil"],
          second: ["lo", "wick", "pin", "ber", "nock", "fiz", "dle", "mop", "zin", "bim"],
          lastA: ["Copper", "Clock", "Spark", "Tangle", "Mirth", "Whistle", "Gadget", "Bristle", "Nimble", "Twinkle"],
          lastB: ["top", "maker", "whisk", "button", "gear", "bloom", "wink", "whittle", "snap", "glimmer"],
        }}
        initialCount={10}
        examples={[
          "Fenwick Coppermaker",
          "Tinkfiz Clockgear",
          "Pipnock Sparkglimmer",
          "Bilpin Whistlebloom",
          "Quilzin Gadgetwink",
        ]}
      />
    </>
  );
}
