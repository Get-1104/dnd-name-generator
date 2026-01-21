import NameGenerator from "@/components/NameGenerator";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

export default function EasternPage() {
  const title = "东方国风名字生成器";
  const description = "生成仙侠/武侠/古风风格的中文名字灵感（拼音/可改汉字）。";
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
        q: "名字会带空格吗？能生成纯中文姓名吗？",
        a: "本页面用于中文姓名风格（不需要空格）。如果你发现名字中间有空格，通常是生成器组件默认英文姓名格式导致的，可以在组件里关闭空格拼接。",
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

      <NameGenerator
        title={title}
        description={description}
        backHref="/"
        generateLabel="生成"
        copyLabel="复制"
        separator=""   // ✅ 关键：中文名不加空格
        parts={{
          // 姓（含复姓）
          first: ["赵", "钱", "孙", "李", "周", "吴", "郑", "王", "欧阳", "司徒", "诸葛", "上官", "南宫", "慕容"],
          second: [""],
          // 名（两段组合）
          lastA: ["清", "寒", "星", "若", "云", "明", "青", "昭", "玄", "玉", "夜", "霜"],
          lastB: ["风", "月", "尘", "霜", "雪", "岚", "衡", "远", "秋", "行", "川", "影"],
        }}
        initialCount={10}
        examples={["李清云", "欧阳雪霜", "诸葛星尘", "南宫问雪", "慕容青岚"]}
      />
    </>
  );
}
