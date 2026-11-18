"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface Props {
  /** Which of `columns` the zoom grows out of (the chart's bar or point slot). */
  index: number;
  columns: number;
  label: string;
  onClose: () => void;
  closeLabel?: string;
  children: ReactNode;
}

/**
 * Chart-to-detail zoom: the card grows out of the chosen month's column (a clip-path FLIP),
 * and shrinks back into it on close. Esc also closes it and focus returns to the month button.
 */
export function ZoomCard({ index, columns, label, onClose, closeLabel = "Back to six months", children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const from = () => {
    const left = (index / columns) * 100;
    const right = 100 - ((index + 1) / columns) * 100;
    return `inset(0% ${right.toFixed(2)}% 0% ${left.toFixed(2)}% round 14px)`;
  };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    if (prefersReducedMotion()) return;
    gsap.fromTo(el, { clipPath: from() }, { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 0.55, ease: "power3.out" });
    gsap.fromTo(el.querySelectorAll("[data-zoom-item]"), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.04, delay: 0.18, ease: "power2.out" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const close = () => {
    const el = ref.current;
    if (!el || closing.current) return;
    if (prefersReducedMotion()) return onClose();
    closing.current = true;
    gsap.to(el, {
      clipPath: from(),
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        closing.current = false;
        onClose();
      },
    });
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
      className="flex flex-col gap-4 rounded-[20px] border border-stone-soft bg-ivory p-6 outline-none"
    >
      {children}
      <div data-zoom-item>
        <button type="button" className="btn btn-secondary btn-sm" onClick={close}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
