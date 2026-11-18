import { K } from "@/lib/tokens";
import { naira } from "@/lib/format";
import type { SceneModule } from "../types";
import { count, fadeOut, lightMember } from "../motion";
import { segMember } from "../geometry";

/** 8 · One nudge (ivory). The suggested action, one press, and the last two members' segments light. */
const POT = { cx: 1380, cy: 540 };

export const nudge: SceneModule = {
  View: ({ def }) => (
    <div className="d-abs d-card" data-card style={{ left: 160, top: 250, width: 760, padding: 56 }}>
      <p className="d-muted" style={{ margin: 0, fontSize: 26, fontWeight: 600 }}>
        {def.lines.label}
      </p>
      <div style={{ position: "relative", marginTop: 18, minHeight: 170 }}>
        <p className="d-h2 d-indigo" data-action style={{ fontSize: 56 }}>
          {def.lines.action}
        </p>
        <p className="d-h2" data-done style={{ fontSize: 56, position: "absolute", inset: 0, color: "#0b6e70" }}>
          {def.lines.done}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 34 }}>
        <span className="d-btn d-btn-primary" data-button>
          {def.lines.button}
        </span>
        <span className="d-muted" data-demo style={{ fontSize: 22, fontWeight: 600 }}>
          Demo: nothing is sent
        </span>
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 44 }}>
        <div style={{ flex: 1, background: "#fbf7f0", borderRadius: 22, padding: "22px 26px" }}>
          <div className="d-num d-indigo" data-health style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
            86
          </div>
          <div className="d-muted" style={{ fontSize: 22, fontWeight: 600, marginTop: 8 }}>
            Circle Health
          </div>
        </div>
        <div style={{ flex: 1.4, background: "#fbf7f0", borderRadius: 22, padding: "22px 26px" }}>
          <div className="d-num d-indigo" data-pot style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
            ₦200,000
          </div>
          <div className="d-muted d-num" style={{ fontSize: 22, fontWeight: 600, marginTop: 8 }}>
            of ₦300,000 in the Pot
          </div>
        </div>
      </div>
    </div>
  ),

  build({ tl, at, one, carry, def }) {
    // The Pot returns on the right, February as it stood: four members paid.
    tl.set(carry.potGroup, { x: POT.cx - 960, y: POT.cy - 540, scale: 0.9, svgOrigin: "960 540" }, at);
    tl.set(carry.segs, { attr: { fill: K.saffron, filter: "none" } }, at);
    carry.segs.forEach((s, j) => {
      if (segMember(j) <= 3) tl.set(s, { attr: { fill: K.teal } }, at);
    });
    tl.set(carry.coinOuter, { attr: { cx: POT.cx, cy: POT.cy, r: 99, "stroke-width": 22, stroke: K.indigo } }, at);
    const due = carry.segs.filter((_, j) => segMember(j) > 3);
    const paid = carry.segs.filter((_, j) => segMember(j) <= 3);
    tl.set([carry.potIvory, carry.potEdge, carry.coinOuter, carry.potShadow, ...carry.segs], { opacity: 0 }, at);
    tl.to([carry.potIvory, carry.potEdge, carry.coinOuter, ...paid], { opacity: 1, duration: 0.6 }, at + 0.1);
    tl.to(due, { opacity: 0.8, duration: 0.6 }, at + 0.1);
    tl.set(carry.potEdge, { attr: { stroke: K.stoneSoft } }, at);
    tl.to(carry.potShadow, { opacity: 0.12, duration: 0.6 }, at + 0.1);

    tl.from(one("[data-card]"), { scale: 0.6, autoAlpha: 0, duration: 0.8, ease: "expo.out", transformOrigin: "50% 50%" }, at);
    tl.set(one("[data-done]"), { autoAlpha: 0 }, at);

    // Press.
    tl.to(one("[data-button]"), { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }, at + 1.2);
    lightMember(tl, carry, 4, at + 1.6, false);
    lightMember(tl, carry, 5, at + 2.3, false);
    count(tl, one("[data-health]"), 86, 96, at + 1.6, (n) => String(n), 1.6);
    count(tl, one("[data-pot]"), 200000, 300000, at + 1.6, naira, 1.6, 1000);
    tl.to(one("[data-action]"), { autoAlpha: 0, y: -16, duration: 0.35 }, at + 3.0);
    tl.fromTo(one("[data-done]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, at + 3.1);
    tl.to([one("[data-button]"), one("[data-demo]")], { autoAlpha: 0.35, duration: 0.3 }, at + 3.1);

    fadeOut(tl, one("[data-card]"), at + def.duration - 0.6, 0.5);
  },
};
