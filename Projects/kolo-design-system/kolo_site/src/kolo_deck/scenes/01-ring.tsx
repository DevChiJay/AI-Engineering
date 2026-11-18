import { K } from "@/lib/tokens";
import type { SceneModule } from "../types";
import { COIN_INNER, COIN_OUTER, COIN_STROKE } from "../geometry";
import { fadeOut, rise } from "../motion";
import { Wordmark } from "../parts";

/** 1 · The coin ring (dark). Macro on the Kolo mark's ring, pull out to the mark, wordmark and first line. */
const RING = { cx: 960, cy: 360 };

export const ring: SceneModule = {
  View: ({ def }) => (
    <>
      <div className="d-abs" data-wordmark style={{ left: 760, top: 540 }}>
        <Wordmark width={400} color={K.ivory} />
      </div>
      <h1 className="d-h1 d-on-dark d-abs" data-headline style={{ left: 260, right: 260, top: 790, textAlign: "center" }}>
        {def.lines.headline}
      </h1>
    </>
  ),

  build({ tl, at, one, q, carry, def }) {
    // Starting state for the whole story.
    tl.set([carry.potShadow, carry.potIvory, carry.potDesk, carry.potEdge, ...carry.segs, ...carry.extras, carry.health], { opacity: 0 }, at);
    tl.set(carry.svg, { scale: 1, transformOrigin: "50% 50%" }, at);
    tl.set(carry.potGroup, { x: 0, y: 0, scale: 1, svgOrigin: "960 540" }, at);
    // Macro: an enormous ring whose edge crosses the frame.
    tl.set(carry.coinOuter, { opacity: 1, attr: { cx: -900, cy: 1900, r: 2400, "stroke-width": 260, stroke: K.ivory } }, at);
    tl.set(carry.coinInner, { opacity: 0, attr: { cx: RING.cx, cy: RING.cy, r: COIN_INNER, "stroke-width": COIN_STROKE, stroke: K.ivory } }, at);

    tl.to(carry.coinOuter, { attr: { cx: RING.cx, cy: RING.cy, r: COIN_OUTER, "stroke-width": COIN_STROKE }, duration: 2.4, ease: "expo.inOut" }, at);
    tl.set(carry.coinInner, { opacity: 1, drawSVG: "0%" }, at + 1.8);
    tl.to(carry.coinInner, { drawSVG: "100%", duration: 1.0, ease: "power2.inOut" }, at + 1.8);
    tl.from(q("[data-draw]"), { drawSVG: "0%", duration: 0.9, stagger: 0.06, ease: "power2.inOut" }, at + 1.9);
    rise(tl, one("[data-headline]"), at + 2.6);

    // Out: the mark lifts and the copy clears for the ivory wipe.
    const out = at + def.duration - 0.8;
    fadeOut(tl, [one("[data-headline]"), one("[data-wordmark]")], out, 0.5);
    tl.to(carry.coinInner, { opacity: 0, duration: 0.5 }, out);
  },
};
