"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Carry, type CarryRefs } from "./Carry";
import { H, W } from "./geometry";
import { CHAPTER_BG, SCENES, STARTS, TOTAL } from "./scenes";
import { MODULES } from "./scenes/index";
import { CREDIT } from "@/lib/seo";
import "./deck.css";

gsap.registerPlugin(SplitText, MorphSVGPlugin, DrawSVGPlugin);

type Mode = "autoplay" | "presenter";
const HOLDS = SCENES.map((s, i) => STARTS[i] + s.hold);
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
const sceneAt = (t: number) => {
  let i = 0;
  for (let k = 0; k < STARTS.length; k++) if (t >= STARTS[k] - 0.001) i = k;
  return i;
};

/** Every scene's markup, rendered once. Never re-rendered, because SplitText rewrites the text nodes. */
const SceneLayers = memo(function SceneLayers({ register }: { register: (i: number, el: HTMLElement | null) => void }) {
  return (
    <>
      {SCENES.map((def, i) => {
        const View = MODULES[def.id].View;
        return (
          <section key={def.id} ref={(el) => register(i, el)} className="deck-scene" data-scene={def.id} aria-hidden="true">
            <View def={def} />
          </section>
        );
      })}
    </>
  );
});

export function Player() {
  const viewport = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const carry = useRef<Partial<CarryRefs>>({});
  const scenes = useRef<(HTMLElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const range = useRef<HTMLInputElement>(null);
  const timeText = useRef<HTMLSpanElement>(null);
  const lastT = useRef(0);
  const modeRef = useRef<Mode>("autoplay");
  const reducedRef = useRef(false);
  const stillTimer = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("autoplay");
  const [scene, setScene] = useState(0);
  const [idle, setIdle] = useState(false);
  const [reduced, setReduced] = useState(false);
  const sceneRef = useRef(0);

  const register = useCallback((i: number, el: HTMLElement | null) => {
    scenes.current[i] = el;
  }, []);

  // Scale the 1920 × 1080 stage to fit the window.
  useLayoutEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / W, window.innerHeight / H);
      if (stage.current) stage.current.style.transform = `translate(-50%, -50%) scale(${s})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const onTick = useCallback((t: number) => {
    const master = tl.current;
    if (!master) return;
    // Presenter mode: stop on each scene's hold.
    if (modeRef.current === "presenter" && !reducedRef.current && master.isActive()) {
      const h = HOLDS.find((x) => lastT.current < x - 0.001 && t >= x - 0.001);
      if (h !== undefined) {
        master.pause(h, false);
        setPlaying(false);
        t = h;
      }
    }
    lastT.current = t;
    if (range.current) {
      range.current.value = String(t);
      range.current.setAttribute("aria-valuetext", `${fmt(t)} of ${fmt(TOTAL)}`);
    }
    if (timeText.current) timeText.current.textContent = `${fmt(t)} / ${fmt(TOTAL)}`;
    const i = sceneAt(t);
    if (i !== sceneRef.current) {
      sceneRef.current = i;
      setScene(i);
    }
    if (viewport.current) viewport.current.style.backgroundColor = CHAPTER_BG[SCENES[i].chapter];
  }, []);

  // Build the master timeline once fonts are ready, so SplitText measures the real lines.
  useLayoutEffect(() => {
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = isReduced;
    setReduced(isReduced);
    document.fonts.ready.then(() => {
      if (cancelled || !stage.current) return;
      ctx = gsap.context(() => {
        const c = carry.current as CarryRefs;
        const master = gsap.timeline({
          paused: true,
          onUpdate: () => onTick(master.time()),
          onComplete: () => setPlaying(false),
        });
        gsap.set(scenes.current, { autoAlpha: 0 });
        SCENES.forEach((def, i) => {
          const at = STARTS[i];
          const root = scenes.current[i]!;
          const bg = CHAPTER_BG[def.chapter];
          master.addLabel(def.id, at);
          if (i === 0) master.set(base.current, { backgroundColor: bg }, 0);
          else if (def.chapter !== SCENES[i - 1].chapter) {
            const [x, y] = def.wipeFrom;
            master.set(wipe.current, { backgroundColor: bg, autoAlpha: 1, clipPath: `circle(0% at ${x}% ${y}%)` }, at);
            master.to(wipe.current, { clipPath: `circle(150% at ${x}% ${y}%)`, duration: 0.9, ease: "power3.inOut" }, at);
            master.set(base.current, { backgroundColor: bg }, at + 0.9);
            master.set(wipe.current, { autoAlpha: 0 }, at + 0.91);
          }
          master.set(root, { autoAlpha: 1 }, at);
          if (i < SCENES.length - 1) master.set(root, { autoAlpha: 0 }, at + def.duration);
          MODULES[def.id].build({
            tl: master,
            at,
            root,
            def,
            carry: c,
            q: <T extends Element = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s)),
            one: <T extends Element = HTMLElement>(s: string) => {
              const el = root.querySelector<T>(s);
              if (!el) throw new Error(`Scene ${def.id}: missing ${s}`);
              return el;
            },
          });
        });
        master.set({}, {}, TOTAL);
        tl.current = master;
        // Dev only: inspect or scrub the master timeline from the console (window.__koloStory.seek(23)).
        if (process.env.NODE_ENV !== "production") (window as unknown as { __koloStory: gsap.core.Timeline }).__koloStory = master;
        if (isReduced) {
          master.seek(HOLDS[0], false);
          onTick(HOLDS[0]);
        } else {
          master.play(0);
          setPlaying(true);
        }
        setReady(true);
      }, stage);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [onTick]);

  // ── Transport ──────────────────────────────────────────────
  const clearStill = () => {
    if (stillTimer.current) window.clearTimeout(stillTimer.current);
    stillTimer.current = null;
  };

  /** Reduced motion: show scene i's held frame, and in autoplay schedule the next still. */
  const showStill = useCallback(
    (i: number, autoAdvance: boolean) => {
      const master = tl.current;
      if (!master) return;
      clearStill();
      master.pause().seek(HOLDS[i] + 0.05, false);
      onTick(HOLDS[i] + 0.05);
      if (autoAdvance && i < SCENES.length - 1) {
        stillTimer.current = window.setTimeout(() => showStill(i + 1, true), SCENES[i].duration * 1000);
        setPlaying(true);
      } else setPlaying(false);
    },
    [onTick],
  );

  const play = useCallback(() => {
    const master = tl.current;
    if (!master) return;
    if (reducedRef.current) return showStill(modeRef.current === "presenter" ? Math.min(sceneRef.current + 1, SCENES.length - 1) : sceneRef.current, modeRef.current === "autoplay");
    if (master.time() >= TOTAL - 0.01) master.seek(0);
    lastT.current = master.time();
    master.play();
    setPlaying(true);
  }, [showStill]);

  const pause = useCallback(() => {
    clearStill();
    tl.current?.pause();
    setPlaying(false);
  }, []);

  const goScene = useCallback(
    (i: number) => {
      const master = tl.current;
      if (!master) return;
      const k = Math.max(0, Math.min(SCENES.length - 1, i));
      if (reducedRef.current) return showStill(k, modeRef.current === "autoplay" && playing);
      clearStill();
      master.pause().seek(STARTS[k], false);
      lastT.current = STARTS[k];
      onTick(STARTS[k]);
      master.play();
      setPlaying(true);
    },
    [onTick, playing, showStill],
  );

  const replay = useCallback(() => goScene(0), [goScene]);
  const next = useCallback(() => {
    const master = tl.current;
    if (!master) return;
    const i = sceneRef.current;
    // Presenter: if paused on a hold, the next press continues the current scene into the next one.
    if (modeRef.current === "presenter" && !reducedRef.current && !master.isActive() && master.time() < STARTS[i] + SCENES[i].duration - 0.1 && Math.abs(master.time() - HOLDS[i]) < 0.05) {
      return goScene(i + 1);
    }
    goScene(i + 1);
  }, [goScene]);
  const prev = useCallback(() => {
    const master = tl.current;
    if (!master) return;
    const i = sceneRef.current;
    goScene(master.time() - STARTS[i] > 1.5 && !reducedRef.current ? i : i - 1);
  }, [goScene]);

  const nudge = useCallback(
    (d: number) => {
      const master = tl.current;
      if (!master) return;
      const t = Math.max(0, Math.min(TOTAL, master.time() + d));
      master.seek(t, false);
      lastT.current = t;
      onTick(t);
    },
    [onTick],
  );

  const toggleMode = useCallback(() => {
    const m: Mode = modeRef.current === "autoplay" ? "presenter" : "autoplay";
    modeRef.current = m;
    setMode(m);
  }, []);

  const fullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else viewport.current?.requestFullscreen?.().catch(() => undefined);
  }, []);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) return;
      const k = e.key.toLowerCase();
      const map: Record<string, () => void> = {
        " ": toggle,
        k: toggle,
        arrowright: next,
        arrowleft: prev,
        j: () => nudge(-5),
        l: () => nudge(5),
        home: replay,
        r: replay,
        p: toggleMode,
        f: fullscreen,
      };
      if (/^[0-9]$/.test(k)) {
        e.preventDefault();
        return goScene(k === "0" ? 9 : Number(k) - 1);
      }
      if (map[k]) {
        if (k === " " && target.tagName === "BUTTON") return; // let buttons handle Space themselves
        e.preventDefault();
        map[k]();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev, nudge, replay, toggleMode, fullscreen, goScene]);

  // Controls fade while playing after 2.5 s without pointer movement.
  useEffect(() => {
    let t: number | undefined;
    const wake = () => {
      setIdle(false);
      window.clearTimeout(t);
      t = window.setTimeout(() => setIdle(true), 2500);
    };
    wake();
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", wake);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  useEffect(() => () => clearStill(), []);

  const def = SCENES[scene];

  return (
    <div ref={viewport} className="deck-viewport">
      <div ref={stage} className="deck-stage" role="region" aria-roledescription="motion story" aria-label="Kolo motion story">
        <div ref={base} className="deck-bg" />
        <div ref={wipe} className="deck-wipe" />
        <Carry refs={carry} />
        <SceneLayers register={register} />
        <span className="deck-badge">Concept · demo data</span>
      </div>

      <div className="deck-controls" data-idle={idle && playing ? "true" : "false"} aria-label="Story controls" role="group">
        <div className="deck-track">
          <input
            ref={range}
            className="deck-range"
            type="range"
            min={0}
            max={TOTAL}
            step={0.1}
            defaultValue={0}
            aria-label="Seek"
            disabled={!ready}
            onInput={(e) => {
              pause();
              const t = Number((e.target as HTMLInputElement).value);
              tl.current?.seek(t, false);
              lastT.current = t;
              onTick(t);
            }}
          />
          <div className="deck-markers">
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="deck-marker"
                style={{ left: `${(STARTS[i] / TOTAL) * 100}%` }}
                aria-label={`Scene ${i + 1}: ${s.title}`}
                aria-current={i === scene ? "true" : undefined}
                onClick={() => goScene(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="deck-row">
          <button type="button" className="deck-btn" onClick={prev} aria-label="Previous scene" disabled={!ready}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M19 5 9 12l10 7Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="deck-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"} disabled={!ready} style={{ minWidth: 64 }}>
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5 19 12 7 19.5Z" fill="currentColor" /></svg>
            )}
          </button>
          <button type="button" className="deck-btn" onClick={next} aria-label="Next scene" disabled={!ready}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M5 5l10 7-10 7Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="deck-btn" onClick={replay} aria-label="Replay from the start" disabled={!ready}>
            Replay
          </button>
          <span ref={timeText} className="deck-time" aria-hidden="true">
            0:00 / {fmt(TOTAL)}
          </span>
          <div role="group" aria-label="Mode" className="deck-row" style={{ gap: 4 }}>
            <button type="button" className="deck-btn" aria-pressed={mode === "autoplay"} onClick={() => mode !== "autoplay" && toggleMode()}>
              Autoplay
            </button>
            <button type="button" className="deck-btn" aria-pressed={mode === "presenter"} onClick={() => mode !== "presenter" && toggleMode()}>
              Presenter
            </button>
          </div>
          <span className="deck-scene-title">
            {scene + 1} · {def.title}
          </span>
          <a className="deck-btn" href="/app/" style={{ textDecoration: "none" }}>
            Explore the demo app
          </a>
          <button type="button" className="deck-btn" onClick={fullscreen} aria-label="Fullscreen">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <p className="deck-help" style={{ margin: 0 }}>
          Space play/pause · ← → scenes · J L ±5 s · P presenter · R replay · F fullscreen · 1–0 jump{reduced ? " · Reduced motion: stills" : ""} · Designed and built by{" "}
          <a href={CREDIT.url} target="_blank" rel="noopener" style={{ color: "#fbf7f0" }}>
            {CREDIT.name}
          </a>
        </p>
      </div>

      <p className="deck-sr" aria-live="polite">
        {ready ? `Scene ${scene + 1} of ${SCENES.length}, ${def.title}. ${def.message}` : "Loading the story."}
      </p>
      <ol className="deck-sr" aria-label="Story transcript">
        {SCENES.map((s, i) => (
          <li key={s.id}>
            Scene {i + 1}, {s.title}: {s.message}
          </li>
        ))}
      </ol>
    </div>
  );
}
