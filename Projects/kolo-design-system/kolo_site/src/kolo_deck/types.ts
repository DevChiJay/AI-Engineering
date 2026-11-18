import type { FC } from "react";
import type { CarryRefs } from "./Carry";
import type { SceneDef } from "./scenes";

export interface BuildCtx {
  /** The master timeline. Add this scene's keyframes at `at + offset`. */
  tl: gsap.core.Timeline;
  /** Scene start, in seconds on the master timeline. */
  at: number;
  root: HTMLElement;
  /** querySelectorAll scoped to this scene's root. */
  q: <T extends Element = HTMLElement>(selector: string) => T[];
  /** querySelector scoped to this scene's root; throws if missing so typos surface early. */
  one: <T extends Element = HTMLElement>(selector: string) => T;
  carry: CarryRefs;
  def: SceneDef;
}

export interface SceneModule {
  View: FC<{ def: SceneDef }>;
  build: (ctx: BuildCtx) => void;
}
