// app/sitemap.ts
import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";

/**
 * ⚠️ Sitemap 专用权威域名
 * 不依赖任何 env / NODE_ENV
 * 防止在 Vercel / Preview / Edge 环境被污染
 */
const SITEMAP_BASE_URL = "https://www.dnd-name-generator.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = ["/", "/en"];

  const toolPaths = (TOOLS ?? [])
    .map((t: any) => t.path || t.href || t.slug)
    .filter(Boolean)
    .map((p: string) => (p.startsWith("/") ? p : `/${p}`));

  const allPaths = Array.from(new Set([...staticPaths, ...toolPaths]));

  return allPaths.map((path) => {
    const url =
      path === "/"
        ? SITEMAP_BASE_URL
        : `${SITEMAP_BASE_URL}${path}`;

    const isHome = path === "/" || path === "/en";

    return {
      url,
      lastModified: now,
      changeFrequency: isHome ? "weekly" : "monthly",
      priority: isHome ? 1.0 : 0.8,
    };
  });
}
