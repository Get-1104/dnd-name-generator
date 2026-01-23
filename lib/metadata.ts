import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/site";

type CreatePageMetadataArgs = {
  /** Absolute path, e.g. "/", "/en", "/elf" */
  path: string;
  title: string;
  description: string;
};

/**
 * Page-level metadata helper (SSOT-ish)
 * - Always sets canonical to PROD domain (via getCanonicalUrl)
 * - Keeps metadata definitions consistent across pages
 */
export function createPageMetadata({
  path,
  title,
  description,
}: CreatePageMetadataArgs): Metadata {
  const canonical = getCanonicalUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
