import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { getPageUrl } from "@/lib/site";

const GUIDE_PATHS = [
  "/guides/dnd-name-generator-guide",
  "/guides/how-to-name-a-dnd-character",
];

function isoNow() {
  return new Date().toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = isoNow();

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

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: getPageUrl(t.href),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = GUIDE_PATHS.map((p) => ({
    url: getPageUrl(p),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...guidePages, ...toolPages];
}
