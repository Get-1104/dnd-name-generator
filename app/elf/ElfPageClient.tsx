"use client";

import { Suspense, useState } from "react";
import JsonLd from "@/components/JsonLd";
import NameGenerator from "@/components/NameGenerator";
import RelatedGenerators from "@/components/RelatedGenerators";
import NamingRules from "@/components/NamingRules";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import { getRelatedGeneratorHrefs } from "@/lib/related";

export default function ElfPageClient() {
	const [isAdvanced, setIsAdvanced] = useState(false);
	const title = "Elf Name Generator";
	const description = "Generate elegant elven names for D&D characters and NPCs.";
	const path = "/elf";

	const relatedHrefs = getRelatedGeneratorHrefs(path, { max: 4 });

	const faq = [
		{
			q: "What is an elf name generator?",
			a: "An elf name generator creates lore-friendly elven names for D&D characters and NPCs.",
		},
		{
			q: "Can I generate elf names with surnames?",
			a: "Yes. You can include a surname or enter a custom surname in Advanced options.",
		},
		{
			q: "How do I get more variety?",
			a: "Open Advanced options and select fewer tags for broader mixing, or reset to defaults.",
		},
	];

	const jsonLd = buildGeneratorPageJsonLd({
		title,
		description,
		path,
		faq,
	});
	return (
		<>
			<JsonLd data={jsonLd} />
			<div className="bg-white rounded-[32px] p-2 md:p-3">
				<div className="max-w-5xl mx-auto px-2">
					<div className="mx-auto max-w-3xl space-y-3">
						{/* Top hero: title/description */}
						<header className="pt-0">
							<div className="mx-auto max-w-3xl text-center">
								<div className="mx-auto h-px w-12 bg-zinc-200/60 -mt-2" aria-hidden />
								<h1 className="text-5xl tracking-tight leading-tight font-semibold max-w-2xl mx-auto mt-2">
									{title}
								</h1>
							</div>
						</header>

						{/* Promoted main generator stage — centered and focused */}
						<div className="mt-6 flex justify-center">
							<div className="w-full max-w-3xl mx-auto">
								{/* NameGenerator remains unchanged; the container centers the work area */}
								<Suspense fallback={<div className="h-40" />}>
								<NameGenerator
									hideHeader
									title={title}
									description={description}
									isAdvanced={isAdvanced}
									onAdvancedToggle={() => setIsAdvanced(!isAdvanced)}
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
								</Suspense>
							</div>
						</div>

						<div className="mt-10 space-y-10">
							<NamingRules race="elf" isAdvanced={isAdvanced} />
							{/* FAQ */}
							<div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
								<h2 className="text-2xl font-semibold">FAQ</h2>
								<div className="mt-4 space-y-4">
									{faq.map((f) => (
										<div key={f.q} className="rounded-xl border border-zinc-100 p-4">
											<p className="font-medium">{f.q}</p>
											<p className="mt-2 text-zinc-700">{f.a}</p>
										</div>
									))}
								</div>
							</div>
							<RelatedGenerators hrefs={relatedHrefs} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}