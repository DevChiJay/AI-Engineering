"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useDemo } from "@/lib/demo-context";
import { nudgeLine } from "@/lib/selectors";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion";
import { AnimatedNumber } from "./AnimatedNumber";
import { StatTile } from "./ui";

const R = 50;
const C = 2 * Math.PI * R;

/** Today's Circle Health: score in a coin ring, its band word and the three inputs. Leads every page. */
export function HealthLead() {
  const { health, cycle } = useDemo();
  const arc = useRef<SVGCircleElement>(null);
  const len = health ? (health.score / 100) * C : 0;
  const high = (health?.score ?? 0) >= 60;
  const first = useRef(true);

  useEffect(() => {
    const el = arc.current;
    if (!el) return;
    const dash = `${len.toFixed(1)} ${C.toFixed(1)}`;
    if (first.current || prefersReducedMotion()) {
      el.setAttribute("stroke-dasharray", dash);
      first.current = false;
      return;
    }
    gsap.to(el, { attr: { "stroke-dasharray": dash }, duration: DUR.slow, ease: EASE });
  }, [len]);

  return (
    <section aria-label="Today's Circle Health" className="card flex flex-col gap-4">
      <div className="flex items-center gap-5">
        <div className="relative size-[120px] shrink-0">
          <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={health ? `Circle Health ${health.score} out of 100, ${health.band}` : "Circle Health not scored yet"}>
            <circle cx="60" cy="60" r={R} fill="none" stroke="#f3ede2" strokeWidth="10" />
            <circle
              ref={arc}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={high ? "#0f8b8d" : "#f2a93b"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${len.toFixed(1)} ${C.toFixed(1)}`}
              transform="rotate(-90 60 60)"
            />
            <circle cx="60" cy="60" r="38" fill="none" stroke="#e8e1d4" strokeWidth="2" />
          </svg>
          <span aria-hidden="true" className="num absolute inset-0 flex items-center justify-center text-[46px] font-extrabold leading-none tracking-[-1.5px] text-indigo">
            {health ? <AnimatedNumber value={health.score} /> : "–"}
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <span className="eyebrow">Circle Health today</span>
          <span className={`chip chip-dot self-start ${!health ? "chip-neutral" : high ? "chip-paid" : "chip-due"}`}>
            {health ? health.band : "Not scored yet"}
          </span>
          <p className="m-0 text-[15px] leading-snug">{health && cycle ? nudgeLine(health, cycle) : "Scored once the first cycle starts."}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatTile value={health ? `${Math.round(health.onTimeRate)}%` : "–"} label="On-time rate" />
        <StatTile value={health ? `${health.paid} of ${health.members}` : "–"} label="Paid this cycle" />
        <StatTile value={health ? health.daysToPayout : "–"} label="Days to payout" />
      </div>
    </section>
  );
}
