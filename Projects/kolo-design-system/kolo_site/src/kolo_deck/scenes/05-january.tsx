import { K } from "@/lib/tokens";
import type { SceneModule } from "../types";
import { CHART, SEG_PATHS, blockRect, rectPath } from "../geometry";
import { fadeOut, fadeUp, rise } from "../motion";

/** 5 · January (stone). Pot-to-chart morph: the 24 light segments become the first four months of a bar chart. */
const MONTHS = [
  { m: "Sep", total: "₦300,000" },
  { m: "Oct", total: "₦300,000" },
  { m: "Nov", total: "₦300,000" },
  { m: "Dec", total: "₦300,000" },
  { m: "Jan", total: "₦300,000" },
  { m: "Feb", total: "₦200,000" },
];

export const january: SceneModule = {
  View: ({ def }) => (
    <>
      <div className="d-abs" style={{ left: 140, top: 120, width: 1100 }}>
        <h2 className="d-h2 d-indigo" data-title style={{ fontSize: 72 }}>
          {def.lines.title}
        </h2>
        <p className="d-body" data-body style={{ marginTop: 22, maxWidth: 980 }}>
          {def.lines.body}
        </p>
      </div>
      {MONTHS.map((mo, i) => {
        const { x, w } = blockRect(i, 0);
        const top = blockRect(i, 5).y;
        return (
          <div key={mo.m}>
            <span className="d-abs d-indigo" data-month style={{ left: x, width: w, top: CHART.base + 18, textAlign: "center", fontSize: 28, fontWeight: 800 }}>
              {mo.m}
            </span>
            <span className="d-abs d-indigo d-num" data-total style={{ left: x - 20, width: w + 40, top: top - 46, textAlign: "center", fontSize: 22, fontWeight: 800 }}>
              {mo.total}
            </span>
          </div>
        );
      })}
      <span className="d-abs d-chip" data-after style={{ left: CHART.x0 + 6 * CHART.colW + 5 * CHART.gap + 48, top: blockRect(4, 5).y, background: "#fdebcc", color: "#8a5300" }}>
        Jan · 2 after the due date
      </span>
      <span className="d-abs d-chip" data-due style={{ left: CHART.x0 + 6 * CHART.colW + 5 * CHART.gap + 48, top: blockRect(4, 5).y + 70, background: "#ece5d8", color: "#6b655c" }}>
        Feb · 2 due Fri
      </span>
      <span className="d-abs d-muted" data-baseline style={{ left: CHART.x0, top: CHART.base, width: 6 * CHART.colW + 5 * CHART.gap, height: 3, background: "#b8b2a7" }} />
    </>
  ),

  build({ tl, at, one, q, carry, def }) {
    // Pot and rim clear; the ring returns to centre for the morph.
    tl.to([carry.potShadow, carry.potDesk, carry.potIvory, carry.potEdge, carry.coinOuter], { opacity: 0, duration: 0.5 }, at);
    tl.to(carry.potGroup, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power2.inOut" }, at);
    tl.set(carry.segs, { attr: { filter: "none" } }, at);

    // Morph: segment j → block (month floor(j/6), row j%6), all teal: Sep–Dec were paid on time.
    carry.segs.forEach((seg, j) => {
      tl.to(seg, { morphSVG: rectPath(Math.floor(j / 6), j % 6), attr: { fill: K.teal }, opacity: 1, duration: 1.1, ease: "power3.inOut" }, at + 0.6 + j * 0.018);
    });
    tl.set(carry.extras, { opacity: 0, y: 30 }, at + 1.5);
    tl.to(carry.extras, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" }, at + 1.5);
    tl.from(one("[data-baseline]"), { scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power3.out" }, at + 0.7);
    fadeUp(tl, q("[data-month]"), at + 1.6, { y: 14, stagger: 0.05 });
    fadeUp(tl, q("[data-total]"), at + 2.0, { y: 10, stagger: 0.05 });
    rise(tl, one("[data-title]"), at + 2.4);
    rise(tl, one("[data-body]"), at + 2.8, { stagger: 0.025 });
    fadeUp(tl, [one("[data-after]"), one("[data-due]")], at + 3.0, { y: 12, stagger: 0.15 });

    // Out: the bars fold back into the ring.
    const out = at + def.duration - 1.0;
    fadeOut(tl, [...q("[data-month]"), ...q("[data-total]"), one("[data-after]"), one("[data-due]"), one("[data-baseline]"), one("[data-title]").parentElement!], out - 0.2, 0.4);
    tl.to(carry.extras, { opacity: 0, duration: 0.3 }, out - 0.2);
    carry.segs.forEach((seg, j) => {
      tl.to(seg, { morphSVG: SEG_PATHS[j], duration: 0.8, ease: "power3.inOut" }, out + j * 0.008);
    });
    tl.to(carry.segs, { opacity: 0, duration: 0.3 }, out + 0.7);
  },
};
