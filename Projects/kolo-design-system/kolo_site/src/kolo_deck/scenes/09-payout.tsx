import { K } from "@/lib/tokens";
import type { SceneModule } from "../types";
import { fadeOut, fadeUp, rise } from "../motion";
import { Avatars } from "../parts";
import { avatarAt } from "../geometry";

/** 9 · Payout day (dark). Macro on Adaeze's avatar, pull back to the full teal ring breathing. */
const C = { cx: 700, cy: 540, r: 430 };
const [AX, AY] = avatarAt(3, C.r, C.cx, C.cy); // Adaeze sits 4th, at the bottom of the ring
const ORIGIN = `${((AX / 1920) * 100).toFixed(2)}% ${((AY / 1080) * 100).toFixed(2)}%`;

export const payout: SceneModule = {
  View: ({ def }) => (
    <>
      <div className="d-abs" data-people style={{ inset: 0 }}>
        <Avatars cx={C.cx} cy={C.cy} r={C.r} tone="dark" />
      </div>
      <div className="d-abs" style={{ left: 1240, top: 300, width: 600 }}>
        <p className="d-eyebrow" data-eyebrow style={{ color: "#5fd0cf" }}>
          {def.lines.eyebrow}
        </p>
        <h2 className="d-h1 d-on-dark" data-title style={{ marginTop: 26 }}>
          {def.lines.title}
        </h2>
        <p className="d-num d-on-dark" data-amount style={{ margin: "36px 0 0", fontSize: 54, fontWeight: 800, letterSpacing: "-0.02em" }}>
          {def.lines.amount}
        </p>
        <p className="d-body d-soft" data-note style={{ marginTop: 22, fontSize: 28 }}>
          All six paid in. The full ring breathes on payout day.
        </p>
      </div>
    </>
  ),

  build({ tl, at, one, q, carry, def }) {
    // The Desk Pot, every segment teal and glowing.
    tl.set(carry.potGroup, { x: C.cx - 960, y: C.cy - 540, scale: 1, svgOrigin: "960 540" }, at);
    tl.set([carry.potIvory], { opacity: 0 }, at);
    tl.set([carry.potDesk, carry.potEdge], { opacity: 1 }, at);
    tl.set(carry.potEdge, { attr: { stroke: "#3a3672" } }, at);
    tl.set(carry.segs, { attr: { fill: K.teal, filter: "url(#deck-glow)" }, opacity: 1 }, at);
    tl.set(carry.coinOuter, { opacity: 1, attr: { cx: C.cx, cy: C.cy, r: 110, "stroke-width": 24, stroke: K.ivory } }, at);
    tl.set(q("[data-k]"), { borderColor: K.teal, borderStyle: "solid" }, at);

    // Macro to wide: one camera move shared by the ring layer and the people layer.
    tl.set([carry.svg, one("[data-people]")], { scale: 4, transformOrigin: ORIGIN }, at);
    tl.to([carry.svg, one("[data-people]")], { scale: 1, duration: 2.2, ease: "expo.inOut" }, at);

    // Breathe: three slow cycles.
    tl.to(carry.segs, { opacity: 0.5, duration: 1.1, yoyo: true, repeat: 3, ease: "sine.inOut" }, at + 2.2);

    fadeUp(tl, one("[data-eyebrow]"), at + 2.0, { y: 14 });
    rise(tl, one("[data-title]"), at + 2.2);
    fadeUp(tl, [one("[data-amount]"), one("[data-note]")], at + 2.7, { y: 18, stagger: 0.2 });

    // Out: the Pot falls away; the coin ring rises to become the mark again.
    const out = at + def.duration - 0.9;
    fadeOut(tl, [one("[data-title]").parentElement!, one("[data-people]")], out, 0.5);
    tl.to([carry.potShadow, carry.potDesk, carry.potEdge, ...carry.segs], { opacity: 0, duration: 0.5 }, out);
    tl.to(carry.coinOuter, { attr: { cx: 960, cy: 330 }, duration: 0.9, ease: "power3.inOut" }, out);
  },
};
