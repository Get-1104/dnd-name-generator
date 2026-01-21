// lib/site.ts

/**
 * 站点级 SEO / 结构化数据的单一事实源（SSOT）
 * 后续所有 Json-LD / canonical / sitemap 都应从这里取
 */

/**
 * ⚠️ 权威生产域名（唯一 Canonical）
 * ⚠️ 生产环境强制使用这个值
 */
const PROD_SITE_URL = "https://www.dnd-name-generator.net";
const DEV_SITE_URL = "http://localhost:3000";

/** 规范化 URL（去掉末尾 /） */
function normalizeUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * 解析站点 URL（最终保险逻辑）
 *
 * 优先级规则：
 * 1️⃣ 生产环境（NODE_ENV === "production"） → 强制 PROD_SITE_URL
 * 2️⃣ 非生产环境 + NEXT_PUBLIC_SITE_URL → 使用它
 * 3️⃣ 本地开发 → localhost
 */
function resolveSiteUrl() {
  if (process.env.NODE_ENV === "production") {
    return normalizeUrl(PROD_SITE_URL);
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  return normalizeUrl(DEV_SITE_URL);
}

const SITE_URL = resolveSiteUrl();

export const SITE = {
  /** 站点名称 */
  name: "D&D Name Generators",

  /** 站点基础 URL（全站唯一权威来源） */
  url: SITE_URL,

  /** 站点简介（WebSite / 首页 WebPage 使用） */
  description:
    "Generate unique names for Dungeons & Dragons characters, including elves, dwarves, tieflings, dragonborn, and more.",

  /**
   * 站点 Logo（可选）
   * 若有 logo：
   * - 放在 public/logo.png
   * - 改为 `${SITE_URL}/logo.png`
   */
  logo: "",

  /** 默认语言 */
  language: "en",

  /** 项目分类（帮助搜索引擎理解站点类型） */
  category: "Game Tools",

  /** 默认发布者 / 组织 */
  publisher: {
    name: "D&D Name Generators",
    url: SITE_URL,
  },
};

/* ------------------------------
 * Helper functions（全站统一使用）
 * ------------------------------ */

/** 获取站点 Base URL */
export function getBaseUrl() {
  return SITE.url;
}

/** 拼接完整页面 URL（安全处理 path） */
export function getPageUrl(path: string) {
  if (!path) return SITE.url;
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
