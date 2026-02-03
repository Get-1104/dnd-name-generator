export const metadata = {
  title: "D&D Name Generator",
  description:
    "Generate lore-friendly D&D character names for elves, dwarves, humans, and more.",
};

export default function HomePage() {
  return (
    <main style={{ padding: "48px", maxWidth: 900, margin: "0 auto" }}>
      <h1>D&D Name Generator</h1>

      <p style={{ marginTop: 16, fontSize: 18 }}>
        Generate lore-friendly names for Dungeons & Dragons characters, NPCs,
        and fantasy worlds.
      </p>

      <ul style={{ marginTop: 24, lineHeight: 1.8 }}>
        <li>
          <a href="/elf">Elf Name Generator</a>
        </li>
        <li>
          <a href="/dwarf">Dwarf Name Generator</a>
        </li>
        <li>
          <a href="/human">Human Name Generator</a>
        </li>
        <li>
          <a href="/orc">Orc Name Generator</a>
        </li>
        <li>
          <a href="/tiefling">Tiefling Name Generator</a>
        </li>
      </ul>

      <p style={{ marginTop: 32, color: "#666" }}>
        More races and advanced generators are available inside each page.
      </p>
    </main>
  );
}
