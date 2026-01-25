import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Suspense } from "react";
import { buildGeneratorPageJsonLd } from "@/lib/seo";

// ✅ 用相对路径导入，避免路径别名在某些环境下出问题
import EasternGeneratorClient from "../../components/EasternGeneratorClient";
import ExampleNamesCard from "@/components/ExampleNamesCard";
import { createPageMetadata } from "@/lib/metadata";

import ClassGenderControls from "@/components/ClassGenderControls";
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
    "沈若岚 ·