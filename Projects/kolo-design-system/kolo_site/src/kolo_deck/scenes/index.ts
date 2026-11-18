import type { SceneModule } from "../types";
import { ring } from "./01-ring";
import { friends } from "./02-friends";
import { pot } from "./03-pot";
import { contributions } from "./04-contributions";
import { january } from "./05-january";
import { health } from "./06-health";
import { app } from "./07-app";
import { nudge } from "./08-nudge";
import { payout } from "./09-payout";
import { end } from "./10-end";

/** Scene id (from scenes.ts) → markup and motion. */
export const MODULES: Record<string, SceneModule> = { ring, friends, pot, contributions, january, health, app, nudge, payout, end };
