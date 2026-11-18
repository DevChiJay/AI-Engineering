"use client";

import type { MutableRefObject } from "react";
import { K } from "@/lib/tokens";
import { COIN_INNER, COIN_OUTER, COIN_STROKE, CX, CY, H, POT_R, SEG_PATHS, W, rectPath } from "./geometry";

/**
 * Objects carried between scenes: the coin ring (Kolo mark), the Pot body, the 24-segment light ring,
 * the Circle Health arc and the extra chart blocks. One SVG over the stage background, under the scene content.
 * Scenes move these through `carry` in their build() functions.
 */
export interface CarryRefs {
  svg: SVGSVGElement;
  potGroup: SVGGElement;
  potIvory: SVGCircleElement;
  potDesk: SVGCircleElement;
  potEdge: SVGCircleElement;
  potShadow: SVGCircleElement;
  segGroup: SVGGElement;
  segs: SVGPathElement[];
  coinOuter: SVGCircleElement;
  coinInner: SVGCircleElement;
  health: SVGGElement;
  healthArc: SVGCircleElement;
  extras: SVGPathElement[];
}

/** Chart blocks that fade in for January and February in scene 5 (12 blocks). */
export const EXTRA_BLOCKS = [
  ...[0, 1, 2, 3, 4, 5].map((row) => ({ month: 4, row, kind: row >= 4 ? "after" : "paid" })),
  ...[0, 1, 2, 3, 4, 5].map((row) => ({ month: 5, row, kind: row >= 4 ? "due" : "paid" })),
] as const;

export function Carry({ refs }: { refs: MutableRefObject<Partial<CarryRefs>> }) {
  const r = refs.current;
  r.segs = r.segs ?? [];
  r.extras = r.extras ?? [];
  return (
    <svg
      ref={(el) => {
        if (el) r.svg = el;
      }}
      className="deck-carry"
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="deck-pot-ivory" cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor={K.card} />
          <stop offset="58%" stopColor={K.ivory} />
          <stop offset="100%" stopColor="#e2dacb" />
        </radialGradient>
        <radialGradient id="deck-pot-desk" cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#2b2766" />
          <stop offset="60%" stopColor={K.indigo} />
          <stop offset="100%" stopColor="#141136" />
        </radialGradient>
        <filter id="deck-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="deck-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>

      <g
        ref={(el) => {
          if (el) r.potGroup = el;
        }}
      >
        <circle
          ref={(el) => {
            if (el) r.potShadow = el;
          }}
          cx={CX}
          cy={CY + 24}
          r={POT_R - 6}
          fill={K.indigo}
          opacity="0"
          filter="url(#deck-shadow)"
        />
        <circle
          ref={(el) => {
            if (el) r.potIvory = el;
          }}
          cx={CX}
          cy={CY}
          r={POT_R}
          fill="url(#deck-pot-ivory)"
          opacity="0"
        />
        <circle
          ref={(el) => {
            if (el) r.potDesk = el;
          }}
          cx={CX}
          cy={CY}
          r={POT_R}
          fill="url(#deck-pot-desk)"
          opacity="0"
        />
        <circle
          ref={(el) => {
            if (el) r.potEdge = el;
          }}
          cx={CX}
          cy={CY}
          r={POT_R - 34}
          fill="none"
          stroke={K.stoneSoft}
          strokeWidth="3"
          opacity="0"
        />
        <g
          ref={(el) => {
            if (el) r.segGroup = el;
          }}
        >
          {SEG_PATHS.map((d, j) => (
            <path
              key={j}
              ref={(el) => {
                if (el) r.segs![j] = el;
              }}
              d={d}
              fill={K.stone}
              opacity="0"
            />
          ))}
        </g>
      </g>

      {EXTRA_BLOCKS.map((b, i) => (
        <path
          key={i}
          ref={(el) => {
            if (el) r.extras![i] = el;
          }}
          d={rectPath(b.month, b.row)}
          fill={b.kind === "paid" ? K.teal : b.kind === "after" ? K.saffron : "none"}
          stroke={b.kind === "due" ? K.stoneStrong : "none"}
          strokeWidth={b.kind === "due" ? 3 : 0}
          strokeDasharray={b.kind === "due" ? "8 6" : undefined}
          opacity="0"
        />
      ))}

      <g
        ref={(el) => {
          if (el) r.health = el;
        }}
        opacity="0"
      >
        <circle cx={CX} cy={CY} r="200" fill="none" stroke={K.sunken} strokeWidth="28" />
        <circle
          ref={(el) => {
            if (el) r.healthArc = el;
          }}
          cx={CX}
          cy={CY}
          r="200"
          fill="none"
          stroke={K.teal}
          strokeWidth="28"
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        <circle cx={CX} cy={CY} r="168" fill="none" stroke={K.stoneSoft} strokeWidth="3" />
      </g>

      <circle
        ref={(el) => {
          if (el) r.coinOuter = el;
        }}
        cx={CX}
        cy={CY}
        r={COIN_OUTER}
        fill="none"
        stroke={K.ivory}
        strokeWidth={COIN_STROKE}
        opacity="0"
      />
      <circle
        ref={(el) => {
          if (el) r.coinInner = el;
        }}
        cx={CX}
        cy={CY}
        r={COIN_INNER}
        fill="none"
        stroke={K.ivory}
        strokeWidth={COIN_STROKE}
        opacity="0"
      />
    </svg>
  );
}
