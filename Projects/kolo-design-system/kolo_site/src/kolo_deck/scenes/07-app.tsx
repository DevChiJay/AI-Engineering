/* eslint-disable @next/next/no-img-element */
import type { SceneModule } from "../types";
import { fadeOut, rise } from "../motion";

/** 7 · The app (stone). A walkthrough of the captured screens, with masked wipes and a phone in parallax. */
const FRAME = { left: 560, top: 150, w: 1240, h: 775 }; // 1440 × 900 screenshots at 0.861
const SHOTS = [
  { src: "/story/app-overview.jpg", key: "c1", tall: true },
  { src: "/story/app-circle.jpg", key: "c2" },
  { src: "/story/app-contributions.jpg", key: "c3" },
  { src: "/story/app-payouts.jpg", key: "c4" },
];
const SEG = 3.0; // seconds per screen

export const app: SceneModule = {
  View: ({ def }) => (
    <>
      <div className="d-abs" data-frame style={{ left: FRAME.left, top: FRAME.top, width: FRAME.w, height: FRAME.h, borderRadius: 28, overflow: "hidden", background: "#fffdf8", border: "2px solid #e8e1d4", boxShadow: "0 40px 80px -40px rgb(30 27 75 / 0.35)" }}>
        {SHOTS.map((s, i) => (
          <div key={s.key} className="d-abs" data-shot={i} style={{ inset: 0, overflow: "hidden" }}>
            <img src={s.src} alt="" className="d-shot" data-img={i} />
          </div>
        ))}
      </div>
      <span className="d-abs d-chip" data-url style={{ left: FRAME.left, top: FRAME.top - 64, background: "#fffdf8", color: "#6b655c", border: "2px solid #e8e1d4" }}>
        kolo · demo app · /app/
      </span>
      <figure className="d-abs" data-phone style={{ left: 1590, top: 470, width: 270, height: 584, margin: 0, borderRadius: 40, overflow: "hidden", border: "8px solid #1e1b4b", background: "#1e1b4b" }}>
        <img src="/assets/mobile-home.jpg" alt="" style={{ width: "100%", display: "block" }} />
      </figure>
      <div className="d-abs" style={{ left: 120, top: 220, width: 400 }}>
        <p className="d-eyebrow d-muted" data-eyebrow>
          {def.lines.eyebrow}
        </p>
        <div style={{ position: "relative", marginTop: 26 }}>
          {SHOTS.map((s, i) => (
            <h3 key={s.key} className="d-h2 d-indigo" data-cap={i} style={{ position: i === 0 ? "relative" : "absolute", top: 0, left: 0, fontSize: 52 }}>
              {def.lines[s.key]}
            </h3>
          ))}
        </div>
        <div className="d-row" data-dots style={{ display: "flex", gap: 12, marginTop: 300 }}>
          {SHOTS.map((s, i) => (
            <span key={s.key} data-dot={i} style={{ width: 14, height: 14, borderRadius: 999, background: "#b8b2a7" }} />
          ))}
        </div>
      </div>
    </>
  ),

  build({ tl, at, one, q, carry, def }) {
    tl.set([carry.coinOuter, carry.coinInner, carry.health, ...carry.segs], { opacity: 0 }, at);
    tl.from(one("[data-frame]"), { y: 160, autoAlpha: 0, scale: 0.94, duration: 1.0, ease: "expo.out" }, at);
    tl.from(one("[data-url]"), { autoAlpha: 0, y: 16, duration: 0.5 }, at + 0.4);
    tl.from(one("[data-phone]"), { y: 260, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, at + 0.5);
    tl.from(one("[data-eyebrow]"), { autoAlpha: 0, y: 14, duration: 0.5 }, at + 0.5);
    // Layered parallax: the phone drifts against the frame for the whole scene.
    tl.to(one("[data-phone]"), { y: -90, duration: def.duration - 1.6, ease: "none" }, at + 1.6);
    tl.to(one("[data-frame]"), { y: -24, duration: def.duration - 1.6, ease: "none" }, at + 1.6);

    // Screens 2–4 start hidden behind a mask.
    tl.set(q("[data-shot]").slice(1), { clipPath: "inset(0% 0% 0% 100%)" }, at);
    tl.set(q("[data-cap]").slice(1), { autoAlpha: 0 }, at);
    // Overview is taller than the frame: scroll it.
    const tall = one<HTMLImageElement>('[data-img="0"]');
    tl.fromTo(tall, { y: 0 }, { y: -(1534 * (1240 / 1425) - 775), duration: 2.2, ease: "power1.inOut" }, at + 1.2);
    rise(tl, one('[data-cap="0"]'), at + 0.9);
    tl.set(one('[data-dot="0"]'), { backgroundColor: "#1e1b4b" }, at + 0.9);

    [1, 2, 3].forEach((i) => {
      const t = at + 1.0 + i * SEG;
      tl.to(one(`[data-shot="${i}"]`), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.inOut" }, t);
      tl.fromTo(one(`[data-img="${i}"]`), { scale: 1.06 }, { scale: 1, duration: 1.2, ease: "power2.out", transformOrigin: "50% 30%" }, t);
      tl.to(one(`[data-cap="${i - 1}"]`), { autoAlpha: 0, y: -20, duration: 0.35 }, t);
      tl.fromTo(one(`[data-cap="${i}"]`), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, t + 0.25);
      tl.set(one(`[data-dot="${i - 1}"]`), { backgroundColor: "#b8b2a7" }, t);
      tl.set(one(`[data-dot="${i}"]`), { backgroundColor: "#1e1b4b" }, t);
    });

    const out = at + def.duration - 0.6;
    tl.to(one("[data-frame]"), { scale: 0.4, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, out);
    fadeOut(tl, [one("[data-phone]"), one("[data-url]"), one("[data-eyebrow]").parentElement!], out, 0.4);
  },
};
