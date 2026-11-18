import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { DemoFromSearch, DemoProvider } from "@/lib/demo-context";

export const metadata: Metadata = {
  title: { default: "Overview", template: "%s · Kolo demo" },
  description: "Kolo member web app demo: Circle Health, the Pot and your payout turn for Adaeze in the Friday Circle. Invented data.",
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // The fallback is what the static export writes to HTML: the full app for Adaeze's Friday Circle.
    // In the browser, DemoFromSearch takes over and switches to the empty profile when the URL has ?demo=new.
    <Suspense
      fallback={
        <DemoProvider>
          <AppShell>{children}</AppShell>
        </DemoProvider>
      }
    >
      <DemoFromSearch>
        <AppShell>{children}</AppShell>
      </DemoFromSearch>
    </Suspense>
  );
}
