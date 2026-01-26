"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type RaceTabsProps = {
	current?: string;
	className?: string;
};

type RaceItem = { slug: string; label: string; href: string };

const RACES: RaceItem[] = [
	{ slug: "human", label: "Human", href: "/human" },
	{ slug: "elf", label: "Elf", href: "/elf" },
	{ slug: "dwarf", label: "Dwarf", href: "/dwarf" },
	{ slug: "halfling", label: "Halfling", href: "/halfling" },
	{ slug: "gnome", label: "Gnome", href: "/gnome" },
	{ slug: "half-elf", label: "Half-Elf", href: "/half-elf" },
	{ slug: "half-orc", label: "Half-Orc", href: "/half-orc" },
	{ slug: "dragonborn", label: "Dragonborn", href: "/dragonborn" },
	{ slug: "tiefling", label: "Tiefling", href: "/tiefling" },
	{ slug: "orc", label: "Orc", href: "/orc" },
	{ slug: "aasimar", label: "Aasimar", href: "/aasimar" },
	{ slug: "goliath", label: "Goliath", href: "/goliath" },
];

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

	const primaryRaces = RACES.filter(r => PRIMARY_SLUGS.includes(r.slug));
	const moreRaces = RACES.filter(r => !PRIMARY_SLUGS.includes(r.slug));

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
