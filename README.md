# 🐉 D&D Name Generators

A SEO-focused **Dungeons & Dragons Name Generator website** built with **Next.js App Router**.  
Generate fantasy names for D&D characters, NPCs, and campaigns — including elves, dwarves, dragonborn, and more.

🌐 Live site: https://www.dnd-name-generator.net

---

## ✨ Features

- 🎲 **Multiple D&D Name Generators**
  - Elf, Dwarf, Dragonborn, Tiefling, Orc, Goblin, Human, Halfling, Gnome, Angel, Demon…
- 🧙 **Eastern Fantasy Generator**
  - Xianxia / Wuxia / Chinese fantasy names
  - 2-character / 3-character names
  - Sect generation characters (门派辈分字)
  - Epic titles / epithets (称号)
- 🔍 **Smart Search**
  - Keyword + tag matching
  - Supports English & Chinese search (e.g. *elf*, *xianxia*, *wuxia*)
- 📈 **SEO-first Architecture**
  - One page = one keyword intent
  - JSON-LD (WebSite / WebPage / WebApplication / FAQ / Article)
  - Auto sitemap & robots.txt
- 🧱 **Scalable Structure**
  - Generators and guides are easy to add
  - Single source of truth (SSOT) for tools & SEO

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **SEO:** JSON-LD (Schema.org)
- **Analytics:** Google Analytics 4
- **Deployment:** Vercel (recommended)

---

## 📂 Project Structure

```txt
app/
├─ page.tsx                 # Main homepage (search entry)
├─ en/
│  └─ page.tsx              # English SEO hub
├─ elf/                     # /elf generator page
├─ dwarf/                   # /dwarf generator page
├─ eastern/                 # /eastern (xianxia / wuxia)
├─ guides/                  # SEO content pages
├─ sitemap.ts               # Auto-generated sitemap
├─ robots.ts                # robots.txt
│
components/
├─ NameGenerator.tsx        # Generic name generator component
├─ EasternGeneratorClient.tsx
├─ HomeSearch.tsx
├─ SmartSearch.tsx
├─ JsonLd.tsx
│
lib/
├─ site.ts                  # Site-level SEO config (SSOT)
├─ seo.ts                   # JSON-LD builders
├─ tools.ts                 # Generator registry (SSOT)
├─ searchIndex.ts           # Search index & analytics
├─ searchOpportunities.ts   # Search gap analysis
│
public/
└─ favicon.ico
