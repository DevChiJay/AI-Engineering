import { K } from "@/lib/tokens";
import { naira } from "@/lib/format";
import type { SceneModule } from "../types";
import { avatarAt } from "../geometry";
import { count, fadeOut, fadeUp, lightMember, rise } from "../motion";
import { Avatars } from "../parts";

/** 4 · Contributions arrive (dark). Four payments travel into the Desk Pot; each lights four segments. */
const C = { cx: 760, cy: 540, r: 440 };
const PAYERS = [0, 1, 2, 3]; // Tunde, Chioma, Ibrahim, Adaeze, in the order they paid in February
const STEP = 1.3;

export const contributions: SceneModule = {
  View: ({ def }) => (
    <>
      <Avatars cx={C.cx} cy={C.cy} r={C.r} tone="dark" />
      {PAYERS.map((k) => {
        const [x, y] = avatarAt(k, C.r, C.cx, C.cy);
        return <span key={k} className="d-abs" data-coin={k} style={{ left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 999, background: "#fbf7f0", boxShadow: "0 0 0 8px rgb(251 247 240 / 0.18)" }} />;
      })}
      <div className="d-abs" style={{ left: 1300, top: 250, width: 520 }}>
        <p className="d-eyebrow d-soft" data-eyebrow>
          {def.lines.eyebrow}
        </p>
        <h2 className="d-h2 d-on-dark" data-title style={{ marginTop: 22 }}>
          {def.lines.title}
        </h2>
        <p className="d-num d-on-dark" style={{ margin: "56px 0 0", fontSize: 120, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
          <span data-amount>₦0</span>
        </p>
        <p className="d-body d-soft d-num" data-of style={{ marginTop: 10 }}>
          of ₦300,000
        </p>
        <p className="d-num" data-paid style={{ margin: "34px 0 0", fontSize: 44, fontWeight: 800, color: "#fbf7f0" }}>
          0 of 6 paid
        </p>
        <p className="d-body d-soft" data-note style={{ marginTop: 18, fontSize: 28 }}>
          {def.lines.note}
        </p>
        <span className="d-chip" data-demo style={{ marginTop: 34, background: "rgb(251 247 240 / 0.1)", color: "#c9c4dc" }}>
          Demo data
        </span>
      </div>
    </>
  ),

  build({ tl, at, one, q, carry, def }) {
    // The Pot moves left and turns to the Desk edition; ring still due (saffron).
    tl.to(carry.potGroup, { x: C.cx - 960, y: C.cy - 540, scale: 1, duration: 1.0, ease: "power3.inOut" }, at);
    tl.to(carry.coinOuter, { attr: { cx: C.cx, cy: C.cy, stroke: K.ivory }, duration: 1.0, ease: "power3.inOut" }, at);
    tl.to(carry.potIvory, { opacity: 0, duration: 0.8 }, at + 0.2);
    tl.to(carry.potDesk, { opacity: 1, duration: 0.8 }, at + 0.2);
    tl.to(carry.potEdge, { attr: { stroke: "#3a3672" }, duration: 0.8 }, at + 0.2);
    tl.to(carry.segs, { attr: { fill: K.saffron }, opacity: 0.7, duration: 0.4 }, at + 0.4);

    tl.set(q("[data-k]"), { borderColor: K.saffron, borderStyle: "dashed" }, at);
    tl.from(q("[data-k]"), { scale: 0.6, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: "back.out(2)" }, at + 0.5);
    tl.set(q("[data-coin]"), { autoAlpha: 0 }, at);
    fadeUp(tl, [one("[data-eyebrow]")], at + 0.6, { y: 14 });
    rise(tl, one("[data-title]"), at + 0.7);
    fadeUp(tl, [one("[data-amount]").parentElement!, one("[data-of]"), one("[data-paid]")], at + 0.9, { y: 18, stagger: 0.06 });

    PAYERS.forEach((k, n) => {
      const t = at + 1.0 + n * STEP;
      const coin = one(`[data-coin="${k}"]`);
      const [x, y] = avatarAt(k, C.r, C.cx, C.cy);
      tl.fromTo(coin, { autoAlpha: 1, x: 0, y: 0, scale: 1 }, { x: C.cx - x, y: C.cy - y, scale: 0.4, duration: 0.6, ease: "power2.in" }, t);
      tl.to(coin, { autoAlpha: 0, duration: 0.15 }, t + 0.55);
      lightMember(tl, carry, k, t + 0.5, true);
      tl.to(q(`[data-k="${k}"]`), { borderColor: K.teal, duration: 0.3 }, t + 0.5);
      tl.set(q(`[data-k="${k}"]`), { borderStyle: "solid" }, t + 0.5);
      count(tl, one("[data-amount]"), n * 50000, (n + 1) * 50000, t + 0.5, naira, 0.6, 1000);
      count(tl, one("[data-paid]"), n, n + 1, t + 0.5, (v) => `${v} of 6 paid`, 0.3);
    });

    // Hold: "4 of 6 paid" in teal.
    tl.to(one("[data-paid]"), { color: "#5fd0cf", duration: 0.4 }, at + def.hold - 0.3);
    fadeUp(tl, [one("[data-note]"), one("[data-demo]")], at + def.hold - 0.6, { y: 12 });

    const out = at + def.duration - 0.8;
    fadeOut(tl, [one("[data-title]").parentElement!, ...q("[data-k]")], out, 0.5);
  },
};
