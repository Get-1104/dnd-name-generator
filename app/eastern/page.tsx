import Link from "next/link";
import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "东方国风名字生成器 | 仙侠武侠风格中文名字",
  description:
    "生成仙侠、武侠、国风风格的中文名字灵感，适用于角色设定、小说创作与世界观构建。",
};

export default function EasternPage() {
  const title = "东方国风名字生成器";
  const description =
    "生成仙侠、武侠、古风风格的中文名字灵感，可用于 D&D 角色、NPC 或小说人物命名。";
  const path = "/eastern";

  const jsonLd = buildGeneratorPageJsonLd({
    path,
    title,
    description,
    language: "zh-CN",
    faq: [
      {
        q: "这个东方国风名字生成器是什么？",
        a: "这是一个用于生成仙侠、武侠、古风风格名字的工具，可用于 D&D 角色、NPC、小说角色或游戏角色命名灵感。",
      },
      {
        q: "怎么使用这个名字生成器？",
        a: "点击“生成”即可得到一组名字；点击“复制”可以把整组名字复制到剪贴板，方便粘贴到角色卡或笔记中。",
      },
      {
        q: "名字会带空格吗？可以生成纯中文姓名吗？",
        a: "本页面用于中文姓名风格，名字中不会包含空格，适合直接作为中文角色姓名使用。",
      },
      {
        q: "这些名字是固定的吗？能多生成几次吗？",
        a: "名字是随机组合生成的，你可以无限次点击“生成”获取不同风格的名字，并自行微调字词以贴合世界观。",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ✅ 可见 Intro + 内链（可收录） */}
      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-6">
        {/* ✅ Back：统一回 /en */}
        <Link
          href="/en"
          className="inline-block text-sm text-blue-600 underline underline-offset-4"
        >
          ← Back to all D&amp;D name generators
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

          <p className="text-zinc-700 leading-7">
            这个东方国风名字生成器用于生成仙侠、武侠、古风世界观下的中文姓名。名字通常由姓氏（含复姓）
            与富有意境的名字组合而成，适合用于 D&amp;D 角色、NPC、门派人物，或小说与游戏角色命名灵感。
          </p>

          <p className="text-zinc-700 leading-7">
            想要更多风格？你可以浏览完整的{" "}
            <Link href="/en" className="underline underline-offset-4">
              D&amp;D Name Generators（English）
            </Link>{" "}
            列表，或对比其他种族的命名风格，例如{" "}
            <Link href="/elf" className="underline underline-offset-4">
              Elf Name Generator
            </Link>{" "}
            与{" "}
            <Link href="/dwarf" className="underline underline-offset-4">
              Dwarf Name Generator
            </Link>
            。
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Related generators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-700">
            <li>
              <Link href="/elf" className="underline underline-offset-4">
                Elf Name Generator
              </Link>{" "}
              — 西方奇幻风格的优雅精灵英文名。
            </li>
            <li>
              <Link href="/dwarf" className="underline underline-offset-4">
                Dwarf Name Generator
              </Link>{" "}
              — 偏重氏族与传统感的矮人英文名。
            </li>
            <li>
              <Link href="/tiefling" className="underline underline-offset-4">
                Tiefling Name Generator
              </Link>{" "}
              — 更黑暗、异界感更强的西方奇幻命名风格。
            </li>
          </ul>
        </div>
      </section>

      {/* ✅ 生成器部分：隐藏 header，避免重复 H1/Back */}
      <NameGenerator
        hideHeader
        title={title}
        description={description}
        generateLabel="生成"
        copyLabel="复制"
        separator="" // ✅ 中文姓名不加空格
        parts={{
          first: [
            "赵",
            "钱",
            "孙",
            "李",
            "周",
            "吴",
            "郑",
            "王",
            "欧阳",
            "司徒",
            "诸葛",
            "上官",
            "南宫",
            "慕容",
          ],
          second: [""],
          lastA: ["清", "寒", "星", "若", "云", "明", "青", "昭", "玄", "玉", "夜", "霜"],
          lastB: ["风", "月", "尘", "霜", "雪", "岚", "衡", "远", "秋", "行", "川", "影"],
        }}
        initialCount={10}
        examples={["李清云", "欧阳雪霜", "诸葛星尘", "南宫秋衡", "慕容青岚"]}
      />
    </>
  );
}
