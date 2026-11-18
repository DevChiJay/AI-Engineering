"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useDemo } from "@/lib/demo-context";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion";
import { Wordmark } from "./ui";

const TABS = [
  { path: "/app", label: "Overview" },
  { path: "/app/circle", label: "Circle" },
  { path: "/app/contributions", label: "Contributions" },
  { path: "/app/payouts", label: "Payouts" },
  { path: "/app/goal", label: "Goal" },
];

export function AppShell({ children }: { children: ReactNode }) {
  // trailingSlash is on for the static export, so "/app/circle/" and "/app/circle" are the same tab.
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const { href, profileKey, circle, message } = useDemo();
  const navRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  // Active-tab indicator slides to the current tab.
  useLayoutEffect(() => {
    const place = (animate: boolean) => {
      const nav = navRef.current;
      const bar = barRef.current;
      const active = nav?.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
      if (!nav || !bar || !active) return;
      const to = { x: active.offsetLeft, width: active.offsetWidth, top: active.offsetTop + active.offsetHeight - 3 };
      if (!animate || prefersReducedMotion()) gsap.set(bar, { ...to, opacity: 1 });
      else gsap.to(bar, { ...to, opacity: 1, duration: DUR.base, ease: EASE, overwrite: true });
    };
    place(placed.current);
    placed.current = true;
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div role="note" className="border-b border-stone-soft bg-sunken">
        <div className="wrap flex flex-wrap items-center gap-3 py-2 text-[13px] font-medium leading-snug text-muted">
          <span className="rounded-full border-[1.5px] border-indigo px-2.5 text-xs font-bold uppercase tracking-[0.12em] text-indigo">Demo</span>
          <span>Kolo is a concept with invented data. No real money moves. Kolo gives no financial advice and promises no returns.</span>
        </div>
      </div>
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-stone-soft bg-ivory/90 backdrop-blur-md">
        <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-2 py-2.5">
          {/* A plain link: "/" is the static launch page, not a Next.js route, so it mustn't be prefetched. */}
          <a href="/" aria-label="Kolo, back to the launch page" className="flex rounded-sm py-2 text-indigo">
            <Wordmark />
          </a>
          <nav aria-label="App" className="order-3 w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] lg:order-none lg:w-auto lg:flex-1">
            <div ref={navRef} className="relative flex gap-1">
              {TABS.map((t) => {
                const active = pathname === t.path;
                return (
                  <Link
                    key={t.path}
                    href={href(t.path)}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap rounded-md px-3.5 py-3.5 text-[15px] font-bold no-underline transition-colors ${active ? "text-indigo" : "text-muted hover:text-indigo"}`}
                  >
                    {t.label}
                  </Link>
                );
              })}
              <span ref={barRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[3px] rounded-full bg-indigo opacity-0" />
            </div>
          </nav>
          <div role="group" aria-label="Demo profile" className="ml-auto flex gap-1 rounded-md bg-sunken p-1 lg:ml-0">
            <Link
              href={pathname}
              aria-current={profileKey === "adaeze" ? "true" : undefined}
              className={`rounded-sm px-3.5 py-2.5 text-sm font-bold text-indigo no-underline ${profileKey === "adaeze" ? "bg-card" : ""}`}
            >
              Adaeze
            </Link>
            <Link
              href={`${pathname}?demo=new`}
              aria-current={profileKey === "new" ? "true" : undefined}
              className={`rounded-sm px-3.5 py-2.5 text-sm font-bold text-indigo no-underline ${profileKey === "new" ? "bg-card" : ""}`}
            >
              New circle
            </Link>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <div className="text-[15px] font-semibold text-indigo">Adaeze Nwosu</div>
              <div className="text-[13px] font-medium text-muted">{circle.name}</div>
            </div>
            <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-indigo text-sm font-bold text-ivory">
              AN
            </span>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="wrap flex flex-col gap-8 pb-20 pt-10 outline-none md:pt-14">
        {children}
      </main>
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </>
  );
}
