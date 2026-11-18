import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Static export: `pnpm build` writes a plain static site to `out/`.
 *   out/index.html, styles.css, main.js, assets/   the approved launch page (copied from public/)
 *   out/app/…/index.html                           the demo app
 * Any static host can serve `out/` as is. No Node server is needed.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Export on build. In dev, Next serves normally so the "/" rewrite below works without a warning.
  output: isDev ? undefined : "export",
  // /app/circle/ → out/app/circle/index.html, which static hosts serve without rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
  // `next dev` doesn't serve public/index.html at "/", so dev maps it. Static export doesn't need (or support) rewrites.
  ...(isDev
    ? {
        async rewrites() {
          return { beforeFiles: [{ source: "/", destination: "/index.html" }] };
        },
      }
    : {}),
};

export default nextConfig;
