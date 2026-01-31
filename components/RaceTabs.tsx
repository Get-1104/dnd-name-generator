"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RACES } from "@/lib/races";

export type RaceTabsProps = {
	current?: string;
	className?: string;
};

type RaceItem = { slug: string; label: string; href: string };

function labelFromTitle(title: string, slug: string) {
	const base = title.replace(/\s*Name Generator\s*$/i, "").trim();
	if (base) return base;
	return slug
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

const RACE_ITEMS: RaceItem[] = RACES.map((race) => ({
	slug: race.slug,
	label: race.label || labelFromTitle(race.title, race.slug),
	href: `/${race.slug}`,
}));

const PRIMARY_SLUGS = ["human", "elf", "dwarf", "halfling", "gnome", "dragonborn", "tiefling", "orc"];

function activeFromPath(pathname: string) {
	const seg = (pathname || "/")
		.split("?")[0]
		.split("#")[0]
		.split("/")[1] || "";
	return seg;
}

export default function RaceTabs({ current, className }: RaceTabsProps) {
	const pathname = usePathname();
	const active = current || activeFromPath(pathname || "/");
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const primaryRaces = RACE_ITEMS.filter(r => PRIMARY_SLUGS.includes(r.slug));
	const moreRaces = RACE_ITEMS.filter(r => !PRIMARY_SLUGS.includes(r.slug));

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsMoreOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<nav aria-label="Races" className={className || ""}>
			<div ref={ref}>
				<div className="flex flex-wrap items-center justify-center gap-2">
					{primaryRaces.map((r) => {
						const isActive = active === r.slug;
						const base =
							"rounded-full border px-3 py-1 text-sm transition whitespace-nowrap";
						const activeCls = "bg-zinc-900 text-white border-zinc-900";
						const idleCls =
							"bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50";
						return (
							<Link
								key={r.slug}
								href={r.href}
								scroll={false}
								className={`${base} ${
									isActive ? activeCls : idleCls
								}`}
							>
								{r.label}
							</Link>
						);
					})}
					<button
						type="button"
						className={`rounded-full border px-3 py-1 text-sm transition whitespace-nowrap ${
							isMoreOpen
								? "bg-zinc-900 text-white border-zinc-900"
								: "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50"
						}`}
						onClick={() => setIsMoreOpen(!isMoreOpen)}
						aria-expanded={isMoreOpen}
						aria-haspopup="menu"
					>
						More {isMoreOpen ? "▴" : "▾"}
					</button>
				</div>

				{isMoreOpen && (
					<div className="mt-2 flex flex-wrap gap-2 justify-center">
						{moreRaces.map((r) => {
							const isActive = active === r.slug;
							const base =
								"rounded-full border px-2 py-1 text-xs transition whitespace-nowrap";
							const activeCls = "bg-zinc-900 text-white border-zinc-900";
							const idleCls =
								"bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50";
							return (
								<Link
									key={r.slug}
									href={r.href}
									scroll={false}
									className={`${base} ${
										isActive ? activeCls : idleCls
									}`}
									onClick={() => setIsMoreOpen(false)}
								>
									{r.label}
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</nav>
	);
}
