// lib/site.ts

/**
 * 站点级 SEO / 结构化数据的单一事实源（SSOT）
 * 后续所有 Json-LD 都从这里取
 */

export const SITE = {
  /** 站点名称 */
  name: "D&D Name Generators",

  /** 站点基础 URL（没域名时自动回退 localhost） */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  /** 站点简介（用于 WebSite / 首页 WebPage） */
  description: "Pick a generator, generate names, and copy your favorites.",

  /**
   * 站点 Logo（可选）
   * 如果你有 logo：
   * 1. 放在 public/logo.png
   * 2. 改成 `${SITE.url}/logo.png`
   */
  logo: "",

  /** 默认语言 */
  language: "en",

  /** 品牌 / 项目类型（对搜索引擎理解有帮助） */
  category: "Game Tools",

  /** 默认作者 / 组织（可选） */
  publisher: {
    name: "D&D Name Generators",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
};

/* ------------------------------
 * Helper functions（强烈推荐使用）
 * ------------------------------ */

/** 获取站点 URL（避免在页面里直接读 env） */
export function getBaseUrl() {
  return SITE.url;
}

/** 拼接完整页面 URL */
export function getPageUrl(path: string) {
  if (!path.startsWith("/")) return `${SITE.url}/${path}`;
  return `${SITE.url}${path}`;
}

/** WebSite 的 @id（全站唯一） */
export function getWebSiteId() {
  return `${SITE.url}#website`;
}

/** WebPage 的 @id（每页唯一） */
export function getWebPageId(path: string) {
  return `${getPageUrl(path)}#webpage`;
}

/** BreadcrumbList 的 @id */
export function getBreadcrumbId(path: string) {
  return `${getPageUrl(path)}#breadcrumb`;
}
