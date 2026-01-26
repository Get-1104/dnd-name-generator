import ElfPageClient from "./ElfPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  	title: "Elf Name Generator (D&D 5e) ",
  	description:
    	"Generate elegant male and female elf names for D&D 5e characters, NPCs, and campaigns. Perfect for players, DMs, and fantasy worlds.",
  	path: "/elf",
});

export default function ElfPage() {
	return <ElfPageClient />;
}