// lib/seo.ts
import {
  SITE,
  getPageUrl,
  getWebSiteId,
  getWebPageId,
  getBreadcrumbId,
} from "@/lib/site";

type JsonLdNode = Record<string, unknown>;

type BreadcrumbListItem = {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
};

/* ----------------------------------------
 * Types
 * ------------------------------------- */

export type FaqItem = {
  q: string;
  a: string;
};

type BaseJsonLdInput = {
  path: string; // e.g. "/elf" or "/guides/xxx"
  title: string;
  description: string;
  language?: string; // default SITE.language
  faq?: FaqItem[];

  /**
   * ✅ 可选：Breadcrumb 的“Home”指向哪里
   * - 英文内容页建议传 "/"
   * - 默认 "/"
   */
  homePath?: string;

  /**
   * ✅ 可选：Guide hub 路径（breadcrumb 第二层）
   * 默认 "/guides"
   */
  guideHubPath?: string;

  /**
   * ✅ 可选：Breadcrumb 的 Home 展示名
   * 默认 "Home"
   */
  homeName?: string;

  /**
   * ✅ 可选：Guide hub 展示名
   * 默认 "Guides"
   */
  guideHubName?: string;
};

export type GeneratorPageJsonLdInput = BaseJsonLdInput;

export type GuidePageJsonLdInput = BaseJsonLdInput;

/* ----------------------------------------
 * Shared builders
 * ------------------------------------- */

function buildBreadcrumb(args: {
  path: string;
  title: string;
  homePath: string;
  homeName: string;
  // 可选：中间层（Guide Hub）
  middle?: { name: string; path: string };
}) {
  const { path, title, homePath, homeName, middle } = args;

  const url = getPageUrl(path);

  const items: BreadcrumbListItem[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeName,
      item: getPageUrl(homePath),
    },
  ];

  if (middle) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: middle.name,
      item: getPageUrl(middle.path),
    });

    items.push({
      "@type": "ListItem",
      position: 3,
      name: title,
      item: url,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: title,
      item: url,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": getBreadcrumbId(path),
    itemListElement: items,
  };
}

/* ----------------------------------------
 * Generator JSON-LD
 * ------------------------------------- */

export function buildGeneratorPageJsonLd(input: GeneratorPageJsonLdInput) {
  const {
    path,
    title,
    description,
    faq = [],
    language,
    homePath = "/",
    homeName = "Home",
  } = input;

  const inLanguage = language || SITE.language;
  const url = getPageUrl(path);

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": getWebPageId(path),
    name: title,
    url,
    description,
    inLanguage,
    isPartOf: { "@id": getWebSiteId() },
    breadcrumb: { "@id": getBreadcrumbId(path) },
    mainEntity: { "@id": `${url}#app` },
  };

  const breadcrumb = buildBreadcrumb({
    path,
    title,
    homePath,
    homeName,
  });

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#app`,
    name: title,
    url,
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const jsonLd: JsonLdNode[] = [webPage, breadcrumb, webApp];

  if (faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  return jsonLd;
}

/* ----------------------------------------
 * Guide JSON-LD
 * ------------------------------------- */

export function buildGuidePageJsonLd(input: GuidePageJsonLdInput) {
  const {
    path,
    title,
    description,
    faq = [],
    language,
    homePath = "/",
    homeName = "Home",
    guideHubPath = "/guides",
    guideHubName = "Guides",
  } = input;

  const inLanguage = language || SITE.language;
  const url = getPageUrl(path);

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": getWebPageId(path),
    name: title,
    url,
    description,
    inLanguage,
    isPartOf: { "@id": getWebSiteId() },
    breadcrumb: { "@id": getBreadcrumbId(path) },
    mainEntity: { "@id": `${url}#article` },
  };

  const breadcrumb = buildBreadcrumb({
    path,
    title,
    homePath,
    homeName,
    middle: { name: guideHubName, path: guideHubPath },
  });

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title,
    description,
    url,
    inLanguage,
    isPartOf: { "@id": getWebSiteId() },
    mainEntityOfPage: { "@id": getWebPageId(path) },
  };

  const jsonLd: JsonLdNode[] = [webPage, breadcrumb, article];

  if (faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  return jsonLd;
}
