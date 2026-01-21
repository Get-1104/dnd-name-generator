// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getPageUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",        // 中文/默认首页
    "/en",      // 英文首页
    "/dwarf",
    "/elf",
    "/tiefling",
    "/dragonborn",
    "/eastern",
  ];

  const now = new Date();

  return routes.map((path) => ({
    url: getPageUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
