/**
 * Kolo motion story: copy and timing for every scene.
 * Edit lines, lengths and holds here. Motion lives in ./scenes/<NN-name>.tsx, and the storyboard is ../../../kolo_storyboard.md.
 * `hold` is seconds from the scene start where the key message is fully on screen; presenter mode pauses there.
 * `wipeFrom` is where the chapter-colour mask opens from, in % of the stage.
 */
export type Chapter = "dark" | "ivory" | "stone";

export interface SceneDef {
  id: string;
  title: string;
  chapter: Chapter;
  duration: number;
  hold: number;
  wipeFrom: [number, number];
  /** Read aloud by the live region and listed in the transcript. */
  message: string;
  lines: Record<string, string>;
}

export const CHAPTER_BG: Record<Chapter, string> = { dark: "#1e1b4b", ivory: "#fbf7f0", stone: "#f3ede2" };

export const SCENES: SceneDef[] = [
  {
    id: "ring",
    title: "The coin ring",
    chapter: "dark",
    duration: 7,
    hold: 3.6,
    wipeFrom: [50, 39],
    message: "Saving together is older than banks.",
    lines: { headline: "Saving together is older than banks." },
  },
  {
    id: "friends",
    title: "Six friends",
    chapter: "ivory",
    duration: 8,
    hold: 3.0,
    wipeFrom: [50, 39],
    message: "Six coworkers. ₦50,000 each, every month. One of them collects ₦300,000.",
    lines: { eyebrow: "Ajo · Esusu · Kolo", l1: "Six coworkers.", l2: "₦50,000 each, every month.", l3: "One of them collects ₦300,000." },
  },
  {
    id: "pot",
    title: "The Kolo Pot",
    chapter: "ivory",
    duration: 8,
    hold: 3.4,
    wipeFrom: [37, 52],
    message: "The Kolo Pot. Tap the top. The light ring shows how much of this cycle's Pot is in.",
    lines: { title: "The Kolo Pot.", body: "Tap the top. The light ring shows how much of this cycle's Pot is in." },
  },
  {
    id: "contributions",
    title: "Contributions arrive",
    chapter: "dark",
    duration: 10,
    hold: 6.4,
    wipeFrom: [40, 50],
    message: "Contributions arrive. 4 of 6 paid, ₦200,000 of ₦300,000.",
    lines: { eyebrow: "February cycle · Friday Circle", title: "Contributions arrive.", held: "4 of 6 paid", note: "Each payment lights four of the 24 segments." },
  },
  {
    id: "january",
    title: "January",
    chapter: "stone",
    duration: 8,
    hold: 3.4,
    wipeFrom: [50, 50],
    message: "January, after the holidays. Two payments came in after the due date. The circle still closed, and Ibrahim collected on 3 Feb.",
    lines: {
      title: "January, after the holidays.",
      body: "Two payments came in after the due date. The circle still closed, and Ibrahim collected on 3 Feb.",
    },
  },
  {
    id: "health",
    title: "Circle Health",
    chapter: "ivory",
    duration: 9,
    hold: 3.4,
    wipeFrom: [68, 50],
    message: "Circle Health 86. Healthy. Built from a 94% on-time rate, 4 of 6 paid and 4 days to payout.",
    lines: {
      title: "Circle Health 86.",
      band: "Healthy",
      formula: "Demo formula: 0.65 × on-time rate + 0.25 × paid this cycle + 0.10 × readiness",
    },
  },
  {
    id: "app",
    title: "The app",
    chapter: "stone",
    duration: 13,
    hold: 1.6,
    wipeFrom: [50, 100],
    message: "The app. Overview: today's number first. Circle: who has paid, without chasing. Contributions: six months, January included. Payouts: whose turn, and when.",
    lines: {
      eyebrow: "The Kolo app",
      c1: "Overview: today's number first.",
      c2: "Circle: who has paid, without chasing.",
      c3: "Contributions: six months, January included.",
      c4: "Payouts: whose turn, and when.",
    },
  },
  {
    id: "nudge",
    title: "One nudge",
    chapter: "ivory",
    duration: 6,
    hold: 3.4,
    wipeFrom: [50, 50],
    message: "Two members still to pay. Send a friendly reminder. Everyone has paid. The Pot is full.",
    lines: { label: "Suggested action", action: "Two members still to pay. Send a friendly reminder.", button: "Send reminder", done: "Everyone has paid. The Pot is full." },
  },
  {
    id: "payout",
    title: "Payout day",
    chapter: "dark",
    duration: 9,
    hold: 3.2,
    wipeFrom: [50, 50],
    message: "Payout day. It's your turn, Adaeze. ₦300,000 on Friday 27 February.",
    lines: { eyebrow: "Payout day · 4th of 6", title: "It's your turn, Adaeze.", amount: "₦300,000 · Fri 27 Feb" },
  },
  {
    id: "end",
    title: "End card",
    chapter: "ivory",
    duration: 8,
    hold: 2.8,
    wipeFrom: [50, 40],
    message: "Save together. Watch the Pot fill. Concept with demo data. Kolo gives no financial advice and promises no returns.",
    lines: {
      title: "Save together. Watch the Pot fill.",
      cta: "Explore the demo",
      legal: "Concept with demo data. Kolo gives no financial advice and promises no returns.",
      credit: "Designed and built by Devchi Digital",
    },
  },
];

/** Start time of each scene in the master timeline. */
export const STARTS = SCENES.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].duration], []);
export const TOTAL = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].duration;
