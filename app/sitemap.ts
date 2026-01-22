// app/sitemap.ts
import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { getPageUrl } from "@/lib/site";

/**
 * 所有 Guide 页面路径（手动维护）
 * 新增 Guide 时，只需要往这里加一行
 */
const GUIDE_PATHS = [
  "/guides/dnd-name-generator-guide",
  "/guides/how-to-name-a-dnd-character",
  "/guides/elf-naming-conventions",
  "/guides/dwarf-clan-names-and-traditions",
];

function isoNow() {
  return new Date().toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = isoNow();

  /* --------------------
   * 核心入口页
   * ------------------ */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getPageUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: getPageUrl("/en"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  /* --------------------
   * 工具页（Generators）
   * ------------------ */
  const toolPages: MetadataRoute.Sitemap = [...TOOLS]
    .sort((a, b) => a.href.localeCompare(b.href))
    .map((t) => ({
      url: getPageUrl(t.href),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  /* --------------------
   * 指南页（Guides）
   * ------------------ */
  const guidePages: MetadataRoute.Sitemap = GUIDE_PATHS.map((p) => ({
    url: getPageUrl(p),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...guidePages];
}
