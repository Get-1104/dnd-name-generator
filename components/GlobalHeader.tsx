"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RaceTabs from "@/components/RaceTabs";

function getCurrentFromPath(pathname: string | null) {
	// "/elf" -> "elf"
	if (!pathname) return "";
	const parts = pathname.split("/").filter(Boolean);
	return parts[0] || "";
}

export default function GlobalHeader() {
	const pathname = usePathname();
	const current = getCurrentFromPath(pathname);

	return (
		<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 border-b border-zinc-200/80 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
			<div className="max-w-6xl mx-auto px-4">
				{/* Brand row (compact) */}
				<div className="flex items-center justify-between py-3">
					<Link href="/" className="flex items-center gap-3">
						<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white">
							D
						</span>
						<div>
							<div className="text-base font-semibold leading-tight text-zinc-900">D&amp;D Name Generators</div>
							<div className="text-xs text-zinc-500 leading-tight hidden sm:block">Free, lore-friendly names for DMs &amp; players</div>
						</div>
					</Link>

					{/* subtle right-side tagline (optional) */}
					<div className="text-xs text-zinc-500 hidden sm:block">Free, lore-friendly names for DMs &amp; players</div>
				</div>

				{/* Tabs row (centered inside same container) */}
				<div className="pb-3">
					<div className="mx-auto w-fit max-w-full rounded-2xl bg-zinc-50/80 border border-zinc-200/80 px-3 py-2">
						<div className="flex justify-center">
							<RaceTabs current={current} />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
