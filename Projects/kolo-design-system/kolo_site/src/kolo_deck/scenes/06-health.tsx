import type { SceneModule } from "../types";
import { count, fadeOut, fadeUp, rise } from "../motion";

/** 6 · Circle Health (ivory). Three inputs fly in at different depths and pour into the score ring. */
const RING = { cx: 1320, cy: 540 };
const TILES = [
  { value: "94%", label: "On-time rate", y: 250, depth: 1.0 },
  { value: "4 of 6", label: "Paid this cycle", y: 440, depth: 0.7 },
  { value: "4 days", label: "To payout", y: 630, depth: 1.25 },
];

export const health: SceneModule = {
  View: ({ def }) => (
    <>
      {TILES.map((t, i) => (
        <div key={t.label} className="d-abs d-tile" data-tile={i} style={{ left: 140, top: t.y, width: 420 }}>
          <div className="d-num d-indigo" style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {t.value}
          </div>
          <div className="d-muted" style={{ fontSize: 26, fontWeight: 600, marginTop: 10 }}>
            {t.label}
          </div>
        </div>
      ))}
      <div className="d-abs" style={{ left: RING.cx - 200, top: RING.cy - 110, width: 400, textAlign: "center" }}>
        <div className="d-num d-indigo" data-score style={{ fontSize: 170, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>
          0
        </div>
        <span className="d-chip" data-band style={{ marginTop: 14, background: "#dff1ef", color: "#0b6e70" }}>
          {def.lines.band}
        </span>
      </div>
      <div className="d-abs" data-copy style={{ left: 140, top: 300, width: 760 }}>
        <h2 className="d-h1 d-indigo" data-title>
          {def.lines.title}
        </h2>
        <p className="d-body d-muted" data-inputs style={{ marginTop: 26 }}>
          From a 94% on-time rate, 4 of 6 paid and 4 days to payout.
        </p>
        <p className="d-muted" data-formula style={{ marginTop: 40, fontSize: 22, fontWeight: 600, maxWidth: 700, lineHeight: 1.5 }}>
          {def.lines.formula}
        </p>
      </div>
    </>
  ),

  build({ tl, at, one, q, carry, def }) {
    tl.set(carry.health, { x: RING.cx - 960, y: RING.cy - 540, opacity: 0 }, at);
    tl.set(carry.healthArc, { drawSVG: "0%" }, at);
    tl.to(carry.health, { opacity: 1, duration: 0.6 }, at + 0.3);

    // Tiles arrive at different speeds and distances (layered parallax).
    TILES.forEach((t, i) => {
      tl.from(one(`[data-tile="${i}"]`), { x: -260 * t.depth, autoAlpha: 0, duration: 0.6 + 0.3 * t.depth, ease: "power3.out" }, at + 0.1 + i * 0.12);
    });
    // They pour into the ring as the arc draws and the score counts.
    tl.to(q("[data-tile]"), { x: (i) => RING.cx - 350 - 140 + i * 10, y: (i) => RING.cy - TILES[i].y - 60, scale: 0.35, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power3.in" }, at + 1.4);
    tl.to(carry.healthArc, { drawSVG: "0% 86%", duration: 1.5, ease: "power2.out" }, at + 1.5);
    count(tl, one("[data-score]"), 0, 86, at + 1.5, (n) => String(n), 1.5);
    fadeUp(tl, one("[data-band]"), at + 2.8, { y: 10 });
    rise(tl, one("[data-title]"), at + 2.6);
    fadeUp(tl, [one("[data-inputs]"), one("[data-formula]")], at + 3.0, { y: 14, stagger: 0.12 });

    const out = at + def.duration - 1.2;
    tl.to(carry.health, { x: "+=420", opacity: 0, duration: 0.8, ease: "power3.in" }, out);
    fadeOut(tl, [one("[data-score]").parentElement!, one("[data-copy]")], out, 0.6);
  },
};
