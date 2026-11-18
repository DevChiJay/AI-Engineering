import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { K } from "@/lib/tokens";
import type { CarryRefs } from "./Carry";
import { memberSegs } from "./geometry";

/** Kinetic type: words rise through a line mask. Returns the split so callers can reuse its parts. */
export function rise(tl: gsap.core.Timeline, el: Element, at: number, { stagger = 0.045, duration = 0.8 } = {}) {
  const split = SplitText.create(el, { type: "lines,words", mask: "lines" });
  // Room for descenders (g, y, p) inside each line's clipping mask.
  gsap.set(split.masks, { paddingBottom: "0.16em", marginBottom: "-0.16em" });
  tl.from(split.words, { yPercent: 118, duration, stagger, ease: "power4.out" }, at);
  return split;
}

/** Soft rise for small labels, tiles and buttons. */
export function fadeUp(tl: gsap.core.Timeline, els: gsap.TweenTarget, at: number, { y = 28, stagger = 0.08, duration = 0.7 } = {}) {
  tl.from(els, { y, autoAlpha: 0, duration, stagger, ease: "power3.out" }, at);
}

/** Fade an element out at the end of a scene. */
export function fadeOut(tl: gsap.core.Timeline, els: gsap.TweenTarget, at: number, duration = 0.6) {
  tl.to(els, { autoAlpha: 0, duration, ease: "power2.in" }, at);
}

/** Count a number element from → to, writing formatted text on every frame (values stay readable). */
export function count(tl: gsap.core.Timeline, el: Element, from: number, to: number, at: number, format: (n: number) => string, duration = 1.2, step = 1) {
  const o = { v: from };
  tl.fromTo(
    o,
    { v: from },
    {
      v: to,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = format(Math.round(o.v / step) * step);
      },
    },
    at,
  );
}

/** Light one member's four segments teal, one after another. */
export function lightMember(tl: gsap.core.Timeline, carry: CarryRefs, k: number, at: number, glow: boolean) {
  const segs = memberSegs(k).map((j) => carry.segs[j]);
  tl.to(segs, { attr: { fill: K.teal }, opacity: 1, duration: 0.28, stagger: 0.12, ease: "power1.out" }, at);
  if (glow) tl.set(segs, { attr: { filter: "url(#deck-glow)" } }, at);
}

/** Set every segment to one fill and opacity (used to establish a scene's starting state). */
export function setSegs(tl: gsap.core.Timeline, carry: CarryRefs, at: number, fill: string, opacity: number, glow = false) {
  tl.set(carry.segs, { attr: { fill, filter: glow ? "url(#deck-glow)" : "none" }, opacity }, at);
}

export { gsap };
