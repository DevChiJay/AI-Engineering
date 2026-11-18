"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Circle, Cycle } from "@/data/types";
import { ringSegments, SEGMENTS, TODAY } from "@/lib/selectors";
import { prefersReducedMotion } from "@/lib/motion";
import { Avatar } from "./ui";

function pt(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [200 + r * Math.sin(a), 200 - r * Math.cos(a)];
}
function arc(a0: number, a1: number) {
  const [x0, y0] = pt(104, a0);
  const [x1, y1] = pt(104, a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A104 104 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}
const PATHS = Array.from({ length: SEGMENTS }, (_, j) => arc(j * 15 + 1.6, j * 15 + 13.4));

/** Top view of the Kolo Pot (Desk edition) with its 24-segment light ring and members around it. */
export function PotRing({ circle, cycle }: { circle: Circle; cycle: Cycle }) {
  const segs = ringSegments(circle, cycle);
  const paidCount = segs.filter((s) => s === "paid").length;
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const prev = useRef(segs);
  const key = segs.join("");

  // Newly paid segments light one after another.
  useEffect(() => {
    const changed = segs.map((s, j) => (s === "paid" && prev.current[j] !== "paid" ? j : -1)).filter((j) => j >= 0);
    prev.current = segs;
    if (!changed.length || prefersReducedMotion()) return;
    const els = changed.map((j) => refs.current[j]).filter(Boolean);
    gsap.fromTo(els, { opacity: 0.25 }, { opacity: 1, duration: 0.35, stagger: 0.09, ease: "power2.out" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <svg viewBox="0 0 400 400" className="absolute inset-[8%] h-[84%] w-[84%] overflow-visible" role="img" aria-label={`Pot light ring: ${paidCount} of ${SEGMENTS} segments lit teal for paid, the rest saffron for still due`}>
        <defs>
          <radialGradient id="pot-body" cx="42%" cy="36%" r="72%">
            <stop offset="0%" stopColor="#2b2766" />
            <stop offset="60%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#141136" />
          </radialGradient>
          <filter id="seg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="200" cy="200" r="186" fill="url(#pot-body)" />
        <circle cx="200" cy="200" r="185" fill="none" stroke="rgb(251 247 240 / 0.12)" strokeWidth="2" />
        <circle cx="200" cy="200" r="168" fill="none" stroke="rgb(251 247 240 / 0.12)" strokeWidth="1.5" />
        {PATHS.map((d, j) => (
          <path
            key={j}
            ref={(el) => {
              refs.current[j] = el;
            }}
            d={d}
            fill="none"
            strokeWidth="14"
            stroke={segs[j] === "paid" ? "#0f8b8d" : "#f2a93b"}
            opacity={segs[j] === "paid" ? 1 : 0.8}
            filter={segs[j] === "paid" ? "url(#seg-glow)" : undefined}
            style={{ transition: "stroke .4s" }}
          />
        ))}
        <circle cx="200" cy="200" r="57" fill="none" stroke="#fbf7f0" strokeWidth="13" />
      </svg>
      {circle.members.map((m, k) => {
        const a = (k * (360 / circle.members.length) * Math.PI) / 180;
        const paid = cycle.payments[m.id] != null && (cycle.payments[m.id] as string) <= TODAY;
        return (
          <span
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(50 + 47 * Math.sin(a)).toFixed(2)}%`, top: `${(50 - 47 * Math.cos(a)).toFixed(2)}%` }}
            title={`${m.first}${m.id === "an" ? " (you)" : ""} · ${paid ? "Paid" : "Due Fri"}`}
          >
            <Avatar initials={m.initials} state={paid ? "paid" : "due"} you={m.id === "an"} onIndigo />
          </span>
        );
      })}
    </div>
  );
}
