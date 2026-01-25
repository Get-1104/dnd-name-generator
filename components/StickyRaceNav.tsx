"use client";

import Link from "next/link";

export default function StickyRaceNav({ current }: { current: string }) {
	return (
		<div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur">
			<div className="mx-auto max-w-5xl px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center">
				{/* Left: Home */}
				<div className="flex items-center">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-700"
					>
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white">
							D
						</span>
						<span className="hidden sm:inline">D&amp;D Name Generators</span>
					</Link>
				</div>

				{/* Center: Race tabs */}
				<div className="justify-self-center"></div>

				{/* Right: spacer to keep center centered */}
				<div className="justify-self-end" aria-hidden />
			</div>
		</div>
	);
}
