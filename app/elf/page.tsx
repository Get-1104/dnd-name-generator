import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";
import { getRelatedGeneratorHrefs } from "@/lib/related";
import RaceSwitcher from "@/components/RaceSwitcher";

export const metadata = createPageMetadata({
	title: "Elf Name Generator for D&D | Fantasy Character Names",
	description: "Generate elegant elf names for Dungeons & Dragons characters, NPCs, and fantasy campaigns. Fast, free, and easy to use.",
	path: "/elf",
});

export default function ElfPage() {
	const title = "Elf Name Generator";
	const description = "Generate elegant elven names for D&D characters and NPCs.";
	const path = "/elf";

	const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });
	const faq = [
		{
			q: "What is an elf name generator?",
			a: "An elf name generator creates fantasy elven-style names you can use for D&D characters, NPCs, and stories.",
		},
		{
			q: "How do I use this elf name generator?",
			a: "Click Generate to create a fresh list of elf names, then use Copy to copy your favorites for your character sheet or notes.",
		},
		{
			q: "Can I customize the elf names?",
			a: "Yes. Use the generated names as a base and tweak spelling, syllables, or add a surname to match your setting and character background.",
		},
		{
			q: "Are these names official D&D names?",
			a: "They are randomly generated fantasy-style names. They are intended for inspiration and are not official D&D canon.",
		},
	];

	const jsonLd = buildGeneratorPageJsonLd({
		path,
		title,
		description,
		faq,
	});

	return (
		<div className="bg-zinc-50/40 rounded-[32px] p-4 md:p-6">
			<div className="max-w-5xl mx-auto px-4">
				<div className="mx-auto max-w-3xl space-y-10">
					<JsonLd data={jsonLd} />

					{/* Top hero: RaceSwitcher above title (polished spacing/typography) */}
					<header className="pt-6">
						<div className="mx-auto max-w-3xl text-center">
							<div className="mx-auto h-px w-12 bg-zinc-200/60 -mt-2" aria-hidden />

							{/* RaceSwitcher (now borderless and soft) */}
							<div className="mx-auto max-w-5xl px-2">
								<RaceSwitcher current="elf" />
							</div>

							{/* spacing: RaceSwitcher → H1 = mt-4 (more compact, editorial) */}
							<h1 className="text-4xl sm:text-5xl tracking-tight leading-tight font-semibold max-w-2xl mx-auto mt-4">
								{title}
							</h1>

							{/* spacing: H1 → description = mt-4 */}
							<p className="max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed text-zinc-600">
								Use this elf name generator to quickly create elegant, melodic names for
								elves in D&amp;D. Whether you&apos;re naming a new player character,
								improvising an NPC, or drafting ancient family lineages, generate a
								shortlist and tweak spelling or syllables to match your setting’s tone.
							</p>
						</div>
					</header>

					{/* Promoted main generator stage — centered and focused */}
					<div className="mt-6 flex justify-center">
						<div className="w-full max-w-3xl mx-auto">
							{/* NameGenerator remains unchanged; the container centers the work area */}
							<NameGenerator
								hideHeader
								title={title}
								description={description}
								parts={{
									first: ["Ae", "Eli", "Lia", "Syl", "Fa", "Tha", "Ari", "Ili", "Ely", "Nae"],
									second: [
										"rin",
										"lith",
										"syl",
										"vyr",
										"thas",
										"riel",
										"nor",
										"wen",
										"lian",
										"mir",
									],
									lastA: [
										"Moon",
										"Star",
										"Silver",
										"Dawn",
										"Night",
										"Sun",
										"Leaf",
										"Wind",
										"Mist",
										"Song",
									],
									lastB: [
										"whisper",
										"bloom",
										"runner",
										"shade",
										"weaver",
										"song",
										"glade",
										"dancer",
										"brook",
										"watcher",
									],
								}}
								initialCount={10}
							/>
						</div>
					</div>

					{/* combined Supporting / Related area — reduced prominence */}
					<section className="space-y-4 mt-10 border-t border-zinc-200/40 pt-6 text-sm text-zinc-600">
						<div>
							<h2 className="text-lg font-semibold text-zinc-900">Learn elf naming rules</h2>
							<p className="text-sm text-zinc-600 mt-1">
								Want names that feel consistent with your world’s lore? Use these guides
								to learn common elf naming patterns, family-name styles, and practical
								tips for creating names your table will actually use.
							</p>
						</div>

						<div className="flex flex-wrap gap-2 text-sm">
							<Link
								href="/guides/elf-naming-conventions"
								className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm hover:bg-zinc-50"
							>
								Elf Naming Conventions (Guide)
							</Link>
							<Link
								href="/guides/how-to-name-a-dnd-character"
								className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm hover:bg-zinc-50"
							>
								How to Name a D&amp;D Character (Guide)
							</Link>
							<Link
								href="/guides/dnd-name-generator-guide"
								className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm hover:bg-zinc-50"
							>
								What Is a D&amp;D Name Generator? (Guide)
							</Link>
						</div>

						{/* RelatedGenerators (moved inside supporting, visually lighter) */}
						<div className="mt-4">
							<details className="mt-2">
								<summary className="cursor-pointer list-none text-sm font-medium text-zinc-900/80 hover:text-zinc-900 outline-none [&::-webkit-details-marker]:hidden">
									Try related name generators
								</summary>
								<div className="mt-4">
									<RelatedGenerators
										hrefs={relatedHrefs}
										title="Try related name generators"
										note="Tip: If you like an elf first name, try pairing it with a sturdier dwarf-style surname—or the reverse—for mixed-heritage characters."
										extraLinks={[{ href: "/guides/elf-naming-conventions", title: "Elf naming conventions (guide)", description: "Learn common elf naming patterns and sounds for believable elven names." }]}
									/>
								</div>
							</details>
						</div>
					</section>

					<section aria-labelledby="faq" className="mt-10 max-w-3xl mx-auto w-full">
						<h2 id="faq" className="text-xl font-semibold text-zinc-900">FAQ</h2>
						<div className="mt-4 space-y-3">
							{faq.map((item) => (
								<details
									key={item.q}
									className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
								>
									<summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
										{item.q}
									</summary>
									<div className="mt-2">
										<p className="text-zinc-700 leading-7">{item.a}</p>
									</div>
								</details>
							))}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}