import type { Metadata } from "next";
import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Goblin Name Generator for D&D | Fantasy Character Names",
  description:
    "Generate mischievous goblin names for Dungeons & Dragons NPCs, villains, and fantasy campaigns. Fast, free, and easy to use.",
};

export default function GoblinPage() {
  const title = "Goblin Name Generator";
  const description = "Generate mischievous goblin names for D&D characters and NPCs.";
  const path = "/goblin";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    faq: [
      {
        q: "What is a goblin name generator?",
        a: "A goblin name generator creates fantasy goblin-style names you can use for D&D NPCs, enemies, and worldbuilding.",
      },
      {
        q: "How do I use this goblin name generator?",
        a: "Click Generate to create a fresh list of goblin names, then use Copy to save them for your campaign notes or stat blocks.",
      },
      {
        q: "What makes a goblin name sound goblin-like?",
        a: "Goblin names often feel short, sharp, and playful—sometimes with crude humor or nicknames based on habits, gear, or personality.",
      },
      {
        q: "Are these names official D&D names?",
        a: "No. They are randomly generated fantasy-style names intended for inspiration and are not official D&D canon.",
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
            Goblins are a classic source of chaos in D&amp;D—crafty raiders, tunnel
            scavengers, and loud troublemakers with big opinions and sharp knives.
            A good goblin name can be quick, punchy, and a little ridiculous, perfect
            for memorable NPCs, rival gangs, and one-shot villains.
          </p>

          <p className="text-zinc-700 leading-7">
            Want a tougher vibe? Compare with{" "}
            <Link href="/orc" className="underline underline-offset-4">
              orc names
            </Link>{" "}
            or a darker theme like{" "}
            <Link href="/demon" className="underline underline-offset-4">
              demon names
            </Link>
            . You can also browse the full{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D name generators
            </Link>{" "}
            hub.
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/orc" className="underline underline-offset-4">
                Orc Name Generator
              </Link>{" "}
              — harsh, powerful names for warbands and raiders.
            </li>
            <li>
              <Link href="/demon" className="underline underline-offset-4">
                Demon Name Generator
              </Link>{" "}
              — sinister names for fiends and dark fantasy villains.
            </li>
            <li>
              <Link href="/human" className="underline underline-offset-4">
                Human Name Generator
              </Link>{" "}
              — useful for townsfolk, bandits, and bounty hunters.
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
          first: ["Sn", "Gr", "Kr", "Z", "R", "B", "Sk", "T", "M", "N"],
          second: ["ik", "ok", "ag", "it", "ug", "ip", "ez", "az", "ob", "uk"],
          lastA: ["Mud", "Rat", "Rust", "Stink", "Worm", "Scrap", "Soot", "Mush", "Bone", "Skull"],
          lastB: ["snout", "picker", "nibbler", "claw", "tongue", "runner", "snatcher", "gutter", "biter", "sneak"],
        }}
        initialCount={10}
        examples={[
          "Snik Mudsnout",
          "Krag Rustpicker",
          "Zug Stinktongue",
          "Gruk Wormrunner",
          "Skaz Bonesneak",
        ]}
      />
    </>
  );
}
