// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE, getPageUrl } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

/**
 * 生成全站 sitemap.xml
 * - 所有 URL 必须使用权威域名（SITE.url）
 * - 页面列表来自：固定页 + lib/tools.ts（SSOT）
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 固定页面（按你项目当前结构：/ 为中文默认首页，/en 为英文 SEO 首页）
  const staticPaths = ["/", "/en"];

  // 工具页路径来自 SSOT：TOOLS
  // 兼容 TOOLS 里可能出现的 path/slug/href 等字段（尽量不要求你改 tools.ts）
  const toolPaths = (TOOLS ?? [])
    .map((t: any) => t.path || t.href || t.slug)
    .filter(Boolean)
    .map((p: string) => (p.startsWith("/") ? p : `/${p}`));

  // 合并 + 去重
  const allPaths = Array.from(new Set([...staticPaths, ...toolPaths]));

  // 生成 sitemap entries
  const entries: MetadataRoute.Sitemap = allPaths.map((path) => {
    // 用 getPageUrl 确保统一域名 + 正确拼接
    const url = getPageUrl(path);

    // 你也可以按页面类型调整 priority / changefreq
    const isHome = path === "/en" || path === "/";
    const isTool = !isHome;

    return {
      url,
      lastModified: now,
      changeFrequency: isHome ? "weekly" : "monthly",
      priority: isHome ? 1.0 : isTool ? 0.8 : 0.5,
    };
  });

  return entries;
}
