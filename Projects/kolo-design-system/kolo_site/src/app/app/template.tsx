"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Remounts on every tab change: the page's blocks rise through a mask, one after another. */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    // Skip when reduced motion is on, or the page isn't visible (no animation frames would run).
    if (!el || prefersReducedMotion() || document.visibilityState !== "visible") return;
    const blocks = el.querySelectorAll<HTMLElement>(":scope > *");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        blocks,
        { y: 16, autoAlpha: 0, clipPath: "inset(0% 0% 12% 0% round 24px)" },
        {
          y: 0,
          autoAlpha: 1,
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          clearProps: "transform,opacity,visibility,clipPath",
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-8">
      {children}
    </div>
  );
}
