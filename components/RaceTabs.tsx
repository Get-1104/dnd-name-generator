"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

	return (
		<nav aria-label="Races" className={className || ""}>
			<div className="flex flex-wrap items-center justify-center gap-2">
				{RACES.map((r) => {
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
			</div>
		</nav>
	);
}
