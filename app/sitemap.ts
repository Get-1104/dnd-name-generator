// app/sitemap.ts
import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";

/**
 * ⚠️ Sitemap 权威域名（唯一 Canonical）
 * 不依赖 env，防止 Vercel / Preview / Edge 污染
 */
const SITEMAP_BASE_URL = "https://www.dnd-name-generator.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /** 固定页面 */
  const staticPaths = ["/", "/en"];

  /** 工具页（来自 SSOT） */
  const toolPaths = (TOOLS ?? [])
    .map((t: any) => t.path || t.href || t.slug)
    .filter(Boolean)
    .map((p: string) => (p.startsWith("/") ? p : `/${p}`));

  /** 合并去重 */
  const allPaths = Array.from(new Set([...staticPaths, ...toolPaths]));

  return allPaths.map((path) => {
    const isHome = path === "/" || path === "/en";

    /**
     * ✅ 关键修复点：
     * 首页必须是 https://www.xxx.com/
     */
    const url =
      path === "/"
        ? `${SITEMAP_BASE_URL}/`
        : `${SITEMAP_BASE_URL}${path}`;

    return {
      url,
      lastModified: now,
      changeFrequency: isHome ? "weekly" : "monthly",
      priority: isHome ? 1.0 : 0.8,
    };
  });
}
