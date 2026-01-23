import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

// ✅ 用相对路径导入，避免路径别名在某些环境下出问题
import EasternGeneratorClient from "../../components/EasternGeneratorClient";
import ExampleNamesCard from "@/components/ExampleNamesCard";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "东方国风名字生成器 | 仙侠/武侠/Xianxia/Wuxia Name Generator",
  description: "生成仙侠/武侠/古风风格的中文名字灵感：支持2字/3字、门派辈分字、炫酷称号。也适配英文搜索：xianxia / wuxia name generator。",
  path: "/eastern",
});

export default function EasternPage() {
  const title = "东方国风名字生成器";
  const description =
    "生成仙侠/武侠/古风风格的中文名字灵感（支持2字/3字、门派辈分字、炫酷称号）。";
  const path = "/eastern";

  const examples = [
    "林清玄 · 霜影剑仙",
    "沈若岚 · 天游散人",
    "顾长歌 · 玄冥魔君",
    "苏轻寒 · 青莲剑客",
    "陆知行 · 天游剑尊",
    "白景刀 · 九天之怒",
  ];

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    language: "zh-CN",
    faq: [
      {
        q: "这个东方国风名字生成器能生成什么风格？",
        a: "可以生成仙侠、武侠、国风、古风等中文名字灵感，并支持2字/3字名字、门派辈分字与炫酷称号组合。",
      },
      {
        q: "2字/3字名字是什么意思？",
        a: "指完整姓名的总字数（常见为2字或3字）。你可以切换生成规则，快速得到更贴合设定的名字。",
      },
      {
        q: "什么是“门派辈分字”？",
        a: "辈分字是宗门传承中用于区分辈分的一种命名方式。打开后会把辈分字融入名字，让角色更有门派/修真味道。",
      },
      {
        q: "称号有什么用？",
        a: "称号（封号/名号）可以增强角色气质与辨识度，例如“青冥剑主”“太虚真人”等，适合主角、长老、反派或江湖高手。",
      },
      {
        q: "xianxia / wuxia name generator 是什么？",
        a: "它们是英文语境中对“仙侠/武侠名字生成器”的常见搜索词。本页在内容中也包含这些关键词，方便英文用户找到。",
      },
    ],
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <JsonLd data={jsonLd} />

      {/* Intro */}
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-zinc-700 leading-7 max-w-3xl">{description}</p>

        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            返回首页
          </Link>

          <Link
            href="/en"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            If you prefer English, go to /en
          </Link>

          <Link
            href="/elf"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Elf Name Generator
          </Link>

          <Link
            href="/dwarf"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow"
          >
            Dwarf Name Generator
          </Link>
        </div>
      </header>

      <ExampleNamesCard items={examples} />


      {/* Generator */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <EasternGeneratorClient />
        </div>

        <p className="text-xs text-zinc-500">
          小提示：想更“门派味”就开辈分字；想更“主角感/大佬感”就开称号，并试试不同的称号格式。
        </p>
      </section>

      {/* Tips */}
      <section className="space-y-3 max-w-3xl">
        <h2 className="text-xl font-semibold">命名小技巧（更像仙侠/武侠）</h2>
        <ul className="list-disc pl-5 text-zinc-700 space-y-2 leading-7">
          <li>偏“仙门正道”：多用清、玄、云、霄、澜、月等字；称号可选“真人/真君/剑尊”。</li>
          <li>偏“魔道反派”：多用幽、冥、影、烬、煞等字；称号可选“魔君/尊上”。</li>
          <li>想要更“宗门体系”：固定一个辈分字，给同门批量生成（会非常统一）。</li>
        </ul>
      </section>

      {/* Keyword block (natural) */}
      <section className="space-y-3 max-w-3xl">
        <h2 className="text-xl font-semibold">Xianxia / Wuxia name generator (English keywords)</h2>
        <p className="text-zinc-700 leading-7">
          This tool also matches common English searches such as{" "}
          <strong>xianxia name generator</strong>,{" "}
          <strong>wuxia name generator</strong>, and{" "}
          <strong>chinese fantasy name generator</strong>.
          If you browse the site in English, you can still find this generator from{" "}
          <Link className="underline" href="/en">
            /en
          </Link>
          .
        </p>
      </section>

      {/* Visible FAQ */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">FAQ</h2>

        <div className="space-y-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="font-medium">什么是门派辈分字？为什么要用？</div>
            <p className="text-zinc-700 leading-7 mt-1">
              辈分字能让同门角色名字更统一、也更有“宗门传承感”。固定辈分字后批量生成，特别适合写宗门人物谱或跑团 NPC 名单。
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="font-medium">称号应该放前面还是后面？</div>
            <p className="text-zinc-700 leading-7 mt-1">
              看你想要的“台词感”。“【青冥剑主】李玄尘”更像旁白；“青冥剑主·李玄尘”更像江湖名号；“李玄尘·青冥剑主”更像落款。
            </p>
          </div>
        </div>
      </section>

      <footer className="pt-2">
        <div className="text-sm text-zinc-600">
          Explore more:{" "}
          <Link className="underline" href="/en">
            /en
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/elf">
            Elf
          </Link>{" "}
          ·{" "}
          <Link className="underline" href="/human">
            Human
          </Link>
        </div>
      </footer>
    </main>
  );
}