import { K } from "@/lib/tokens";
import type { SceneModule } from "../types";
import { COIN_INNER, COIN_OUTER, COIN_STROKE } from "../geometry";
import { fadeUp, rise } from "../motion";
import { Wordmark } from "../parts";

/** 10 · End card (ivory). The coin ring settles back into the Kolo mark; the closing line, the call to action and the concept line. */
export const end: SceneModule = {
  View: ({ def }) => (
    <>
      <div className="d-abs" data-wordmark style={{ left: 810, top: 470 }}>
        <Wordmark width={300} color={K.indigo} />
      </div>
      <h2 className="d-h1 d-indigo d-abs" data-title style={{ left: 200, right: 200, top: 650, textAlign: "center" }}>
        {def.lines.title}
      </h2>
      <div className="d-abs" data-cta style={{ left: 0, right: 0, top: 820, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <a className="d-btn d-btn-primary" href="/app/" tabIndex={-1} data-link>
          {def.lines.cta}
        </a>
        <p className="d-muted" data-legal style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          {def.lines.legal}
        </p>
        <p className="d-indigo" data-credit style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
          {def.lines.credit}
        </p>
      </div>
    </>
  ),

  build({ tl, at, one, q, carry }) {
    tl.set(carry.svg, { scale: 1 }, at);
    tl.to(carry.coinOuter, { opacity: 1, attr: { cx: 960, cy: 330, r: COIN_OUTER, "stroke-width": COIN_STROKE, stroke: K.indigo }, duration: 1.0, ease: "power3.out" }, at);
    tl.set(carry.coinInner, { attr: { cx: 960, cy: 330, r: COIN_INNER, "stroke-width": COIN_STROKE, stroke: K.indigo } }, at);
    tl.set(carry.coinInner, { opacity: 1, drawSVG: "0%" }, at + 0.5);
    tl.to(carry.coinInner, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, at + 0.5);
    tl.from(q("[data-draw]"), { drawSVG: "0%", duration: 0.8, stagger: 0.05, ease: "power2.inOut" }, at + 0.6);
    rise(tl, one("[data-title]"), at + 1.0);
    fadeUp(tl, [one("[data-link]"), one("[data-legal]"), one("[data-credit]")], at + 2.2, { y: 18, stagger: 0.15 });
  },
};
