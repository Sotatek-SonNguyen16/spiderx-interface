import type { Metadata } from "next";
import { config } from "./index";

export function buildSiteMetadata(overrides?: Partial<Metadata>): Metadata {
  const title: Metadata["title"] = {
    template: config.seo.titleTemplate || "%s",
    default: config.seo.defaultTitle,
  };

  const description = config.seo.defaultDescription;

  const images = config.seo.ogImage ? [config.seo.ogImage] : undefined;

  const baseUrl = new URL(config.urls.site);

  return {
    title,
    description,
    metadataBase: baseUrl,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: config.seo.defaultTitle,
      description,
      siteName: config.branding.name,
      url: config.urls.site,
      images,
      type: "website",
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      site: config.seo.twitterHandle,
      title: config.seo.defaultTitle,
      description,
    },
    keywords: config.seo.keywords,
    ...overrides,
  };
}

export const metadata: Metadata = buildSiteMetadata({
  icons: "logo.svg",
});
