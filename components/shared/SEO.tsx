import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: Partial<OpenGraph>;
  noIndex?: boolean;
}

/**
 * Generate metadata for Next.js pages
 * @param props SEO properties
 * @returns Metadata object for Next.js
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  openGraph,
  noIndex = false,
}: SEOProps): Metadata {
  // Default keywords for the entire site
  const defaultKeywords = [
    "spor",
    "salon",
    "fitness",
    "egzersiz",
    "dijital platform",
    "rezervasyon",
    "analiz",
    "üyelik",
    "eğitmen",
    "yeni nesil spor",
  ];

  // Combine default and page-specific keywords
  const combinedKeywords = [...defaultKeywords, ...keywords];

  // Default OpenGraph properties
  const defaultOpenGraph: OpenGraph = {
    title: title,
    description: description,
    url: "https://sportiva.com",
    siteName: "Sportiva",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Sportiva Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  };

  // Combine default and page-specific OpenGraph properties
  const combinedOpenGraph = {
    ...defaultOpenGraph,
    ...openGraph,
  };

  return {
    title: `${title} | Sportiva`,
    description,
    keywords: combinedKeywords,
    openGraph: combinedOpenGraph,
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      site: "@sportiva",
      creator: "@sportiva",
      images: ["/icon-512x512.png"],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            "max-video-preview": -1,
            "max-image-preview": "none",
            "max-snippet": -1,
          },
        }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
