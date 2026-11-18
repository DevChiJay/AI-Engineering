import { K } from "@/lib/tokens";
import type { SceneModule } from "../types";
import { fadeOut, fadeUp, rise } from "../motion";

/** 3 · The Kolo Pot (ivory). Macro on the light segments, pull back to the Pot's top view; the render opens through a circle mask. */
const POT = { x: -240, y: 20 }; // Pot centre at (720, 560)

export const pot: SceneModule = {
  View: ({ def }) => (
    <>
      <figure className="d-abs" data-photo style={{ left: 1140, top: 96, width: 640, height: 640, margin: 0, borderRadius: 40, overflow: "hidden", background: "#f3ede2" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/pot-34.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </figure>
      <div className="d-abs" style={{ left: 1140, top: 780, width: 680 }}>
        <h2 className="d-h1 d-indigo" data-title>
          {def.lines.title}
        </h2>
        <p className="d-body" data-body style={{ marginTop: 20 }}>
          {def.lines.body}
        </p>
      </div>
      <span className="d-abs d-eyebrow d-muted" data-tap style={{ left: 640, top: 960 }}>
        Tap
      </span>
    </>
  ),

  build({ tl, at, one, carry, def }) {
    // Macro: segments fill the frame around the rim, then pull back to the whole Pot.
    tl.set(carry.potGroup, { x: POT.x, y: POT.y, scale: 3.4, svgOrigin: "960 540" }, at);
    tl.set(carry.segs, { attr: { fill: K.stoneSoft, filter: "none" }, opacity: 0 }, at);
    tl.to(carry.segs, { opacity: 1, duration: 0.5, stagger: { each: 0.02, from: "start" } }, at + 0.1);
    tl.to(carry.potIvory, { opacity: 1, duration: 0.8 }, at + 0.3);
    tl.to(carry.potShadow, { opacity: 0.12, duration: 0.8 }, at + 0.3);
    tl.to(carry.potEdge, { opacity: 1, attr: { stroke: K.stoneSoft }, duration: 0.8 }, at + 0.3);
    tl.to(carry.potGroup, { scale: 1, duration: 1.8, ease: "expo.inOut" }, at + 1.2);
    tl.to(carry.coinOuter, { attr: { r: 110, "stroke-width": 24 }, duration: 1.8, ease: "expo.inOut" }, at + 1.2);

    // Masked match cut: the render opens from a circle the size of the light ring.
    tl.fromTo(one("[data-photo]"), { clipPath: "circle(12% at 50% 34%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1.4, ease: "expo.out" }, at + 1.6);
    rise(tl, one("[data-title]"), at + 2.4);
    rise(tl, one("[data-body]"), at + 2.8, { stagger: 0.03 });

    // Tap: the rim pulses and the ring lights saffron, "still due", ready for contributions.
    fadeUp(tl, one("[data-tap]"), at + 3.0, { y: 12 });
    tl.to(carry.coinOuter, { attr: { "stroke-width": 34 }, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, at + 3.2);
    tl.to(carry.segs, { attr: { fill: K.saffron }, opacity: 0.8, duration: 0.3, stagger: 0.025 }, at + 3.3);

    const out = at + def.duration - 1.2;
    fadeOut(tl, [one("[data-photo]"), one("[data-title]").parentElement!, one("[data-tap]")], out, 0.6);
  },
};
