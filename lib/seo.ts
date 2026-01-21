// lib/seo.ts
import {
  SITE,
  getBaseUrl,
  getPageUrl,
  getWebSiteId,
  getWebPageId,
  getBreadcrumbId,
} from "@/lib/site";

/* ----------------------------------------
 * Types
 * ------------------------------------- */

export type FaqItem = {
  q: string;
  a: string;
};

export type GeneratorPageJsonLdInput = {
  path: string; // e.g. "/elf"
  title: string;
  description: string;
  language?: string; // default SITE.language
  faq?: FaqItem[];
};

/* ----------------------------------------
 * Builder
 * ------------------------------------- */

export function buildGeneratorPageJsonLd(
  input: GeneratorPageJsonLdInput
) {
  const { path, title, description, faq = [] } = input;

  const inLanguage = input.language || SITE.language;
  const url = getPageUrl(path);
  const base = getBaseUrl();

  /* ---------- WebPage ---------- */
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": getWebPageId(path),
    name: title,
    url,
    description,
    inLanguage,
    isPartOf: {
      "@id": getWebSiteId(),
    },
    breadcrumb: {
      "@id": getBreadcrumbId(path),
    },
    mainEntity: {
      "@id": `${url}#app`,
    },
  };

  /* ---------- BreadcrumbList ---------- */
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": getBreadcrumbId(path),
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: url,
      },
    ],
  };

  /* ---------- WebApplication ---------- */
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

  const jsonLd: any[] = [webPage, breadcrumb, webApp];

  /* ---------- FAQPage (optional) ---------- */
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
