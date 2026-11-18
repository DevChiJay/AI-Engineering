import { K } from "@/lib/tokens";
import type { SceneModule } from "../types";
import { fadeOut, rise } from "../motion";
import { Avatars } from "../parts";

/** 2 · Six friends (ivory). The coin ring becomes the circle the six members stand on. Three parallax layers. */
const C = { cx: 1290, cy: 560, r: 330 };

export const friends: SceneModule = {
  View: ({ def }) => (
    <>
      <div className="d-abs" data-band style={{ left: 0, top: 820, whiteSpace: "nowrap", fontSize: 230, fontWeight: 800, letterSpacing: "-0.04em", color: "#ece5d8" }}>
        ajo · esusu · kolo · ajo · esusu
      </div>
      <div className="d-abs" data-people style={{ inset: 0 }}>
        <Avatars cx={C.cx} cy={C.cy} r={C.r} tone="light" names />
      </div>
      <div className="d-abs" data-copy style={{ left: 140, top: 250, width: 760 }}>
        <p className="d-eyebrow d-muted" data-eyebrow>
          {def.lines.eyebrow}
        </p>
        <h2 className="d-h1 d-indigo" data-l1 style={{ marginTop: 28 }}>
          {def.lines.l1}
        </h2>
        <p className="d-h2 d-indigo d-num" data-l2 style={{ marginTop: 28, fontWeight: 700 }}>
          {def.lines.l2}
        </p>
        <p className="d-body" data-l3 style={{ marginTop: 28, color: "#0b6e70", fontWeight: 700 }}>
          {def.lines.l3}
        </p>
      </div>
    </>
  ),

  build({ tl, at, one, q, carry, def }) {
    // The coin ring grows into the circle the friends stand on.
    tl.to(carry.coinOuter, { attr: { cx: C.cx, cy: C.cy, r: C.r, "stroke-width": 4, stroke: K.stone }, duration: 1.6, ease: "expo.inOut" }, at + 0.2);

    tl.from(q("[data-k]"), { scale: 0, autoAlpha: 0, duration: 0.55, stagger: 0.16, ease: "back.out(2.2)" }, at + 1.0);
    tl.from(q("[data-name]"), { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.16 }, at + 1.2);
    tl.from(one("[data-eyebrow]"), { autoAlpha: 0, y: 16, duration: 0.5 }, at + 1.4);
    rise(tl, one("[data-l1]"), at + 1.6);
    rise(tl, one("[data-l2]"), at + 2.1);
    rise(tl, one("[data-l3]"), at + 2.5, { stagger: 0.03 });

    // Parallax: band slowest, ring middle, people fastest.
    tl.fromTo(one("[data-band]"), { x: 40 }, { x: -260, duration: def.duration, ease: "none" }, at);
    tl.fromTo(one("[data-people]"), { x: 30 }, { x: -70, duration: def.duration, ease: "none" }, at);
    tl.to(carry.coinOuter, { attr: { cx: C.cx - 40 }, duration: def.duration - 1.8, ease: "none" }, at + 1.8);

    // Out: people step back; the ring tightens into the Pot's inner rim position for scene 3.
    const out = at + def.duration - 1.4;
    fadeOut(tl, [...q("[data-k]"), ...q("[data-name]")], out, 0.5);
    fadeOut(tl, [one("[data-copy]"), one("[data-band]")], out, 0.6);
    tl.to(carry.coinOuter, { attr: { cx: 720, cy: 560, r: 110 * 3.4, "stroke-width": 24 * 3.4, stroke: K.indigo }, duration: 1.3, ease: "power3.inOut" }, out + 0.1);
  },
};
