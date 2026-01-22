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

  // 首页 & 入口页
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getPageUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getPageUrl("/en"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // 工具页（generators）
  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: getPageUrl(t.href),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 指南页（guides）
  const guidePages: MetadataRoute.Sitemap = GUIDE_PATHS.map((p) => ({
    url: getPageUrl(p),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...guidePages, ...toolPages];
}
