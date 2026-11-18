import type { Metadata } from "next";

/** The live site. Used as metadataBase, so canonical, og:url and og:image resolve to absolute URLs. */
export const SITE_URL = "https://kolopot.web.app";
export const CREDIT = { name: "Devchi Digital", url: "https://devchi.me" } as const;

/** Share images in public/og/, all 1200 × 630. */
const IMAGES = {
  site: { url: "/og/kolo-share.jpg", alt: "Kolo launch page: Save together. Watch the Pot fill. Beside the ivory Kolo Pot with its light ring." },
  app: { url: "/og/kolo-app.jpg", alt: "Kolo demo app Overview: Circle Health 86 and the Pot at ₦200,000 of ₦300,000." },
  story: { url: "/og/kolo-story.jpg", alt: "Kolo motion story: payout day, the full teal light ring around the Pot." },
} as const;

interface PageMetaInput {
  /** Short page name; the title template adds " · Kolo demo". */
  title: string;
  /** Use instead of the template, e.g. "Kolo · motion story". */
  absoluteTitle?: string;
  description: string;
  /** Path with trailing slash, matching the static export ("/app/circle/"). */
  path: string;
  image?: keyof typeof IMAGES;
}

/** Standard title, description, canonical, Open Graph and X card for one route. */
export function pageMeta({ title, absoluteTitle, description, path, image = "app" }: PageMetaInput): Metadata {
  const full = absoluteTitle ?? `${title} · Kolo demo`;
  const img = IMAGES[image];
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Kolo",
      locale: "en_NG",
      url: path,
      title: full,
      description,
      images: [{ url: img.url, width: 1200, height: 630, alt: img.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [{ url: img.url, alt: img.alt }],
    },
  };
}
