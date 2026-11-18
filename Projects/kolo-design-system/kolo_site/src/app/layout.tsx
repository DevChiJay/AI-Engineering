import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { CREDIT, SITE_URL } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Kolo", template: "%s · Kolo demo" },
  description: "Kolo is a concept savings-circle app and companion Pot. All members, amounts and dates are invented.",
  applicationName: "Kolo",
  authors: [{ name: CREDIT.name, url: CREDIT.url }],
  creator: CREDIT.name,
};

export const viewport: Viewport = {
  themeColor: "#fbf7f0",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
