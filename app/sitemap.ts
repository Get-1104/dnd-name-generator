// app/sitemap.ts
import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { getPageUrl } from "@/lib/site";
import { GUIDE_PATHS } from "@/lib/guides";

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
      url: getPageUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: getPageUrl("/guides"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
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
