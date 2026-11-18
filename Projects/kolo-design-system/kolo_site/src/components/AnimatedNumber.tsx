"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion";

interface Props {
  value: number;
  format?: (n: number) => string;
  /** Round intermediate frames to this step so values stay readable while counting. */
  step?: number;
  className?: string;
}

/** Counts from the previous value to the new one. Reduced motion: changes at once. */
export function AnimatedNumber({ value, format = (n) => String(Math.round(n)), step = 1, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const fmt = useRef(format);
  fmt.current = format;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = prev.current;
    prev.current = value;
    if (from === value || prefersReducedMotion()) {
      el.textContent = fmt.current(value);
      return;
    }
    const o = { v: from };
    const tween = gsap.to(o, {
      v: value,
      duration: DUR.slow,
      ease: EASE,
      onUpdate: () => {
        el.textContent = fmt.current(Math.round(o.v / step) * step);
      },
      onComplete: () => {
        el.textContent = fmt.current(value);
      },
    });
    return () => {
      tween.kill();
      el.textContent = fmt.current(value);
    };
  }, [value, step]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
