# Kolo motion story · storyboard

Version 1 · 18 Nov 2026 · Built at `/story` in `kolo_site` (source: `kolo_site/src/kolo_deck/`)

A 86-second browser story that turns the approved launch page, the new web app and the Pot renders into one cinematic sequence. It follows a circle of friends, the Kolo Pot, contributions arriving, Circle Health's inputs, the app and payout day.

**Concept and data.** Kolo is a concept. Every member, amount and date is demo data from `kolo_site/src/data/kolo-demo.json`: Adaeze Nwosu and the Friday Circle, six coworkers paying ₦50,000 a month. The story labels the demo data, promises no returns and gives no financial advice.

## Visual rules

- **Stage:** 1920 × 1080 design units, scaled to fit any window and letterboxed in the chapter colour.
- **Palette:** the Kolo design system only. Light chapters use ivory `#fbf7f0` or soft stone `#f3ede2`; dark chapters use indigo `#1e1b4b`. Teal means paid and saffron means still due, and each always appears with a word. No red or green.
- **Type:** Plus Jakarta Sans. Display lines are 800 weight with tight tracking (as on the landing page), and figures use tabular numerals.
- **Carried objects:**
  - The **coin ring** (outer ring and inner rim, from the Kolo mark) opens the story, becomes the circle the friends stand on, then the Pot's inner rim, and closes the story in the end card.
  - The **light ring** (24 segments, 4 per member) appears in scene 3. It lights in scenes 4 and 8, morphs into the bar chart in scene 5, wraps the Circle Health score in scene 6, and breathes on payout day in scene 9.
- **Pace:** alternating chapters (dark → light → light → dark → stone → light → stone → light → dark → light). Short punchy cuts sit between long holds.
- **Reading holds:** every key message stays still for at least 2.5 seconds. In presenter mode the story pauses on each hold until you advance.

## Timeline at a glance

| # | Scene | Chapter | In | Length | Key message (held) |
| --- | --- | --- | --- | --- | --- |
| 1 | The coin ring | Dark | 0:00 | 7 s | "Saving together is older than banks." |
| 2 | Six friends | Ivory | 0:07 | 8 s | "₦50,000 each, every month. One of them collects ₦300,000." |
| 3 | The Kolo Pot | Ivory | 0:15 | 8 s | "Tap the top. The light ring shows how much of this cycle's Pot is in." |
| 4 | Contributions arrive | Dark | 0:23 | 10 s | "4 of 6 paid · ₦200,000 of ₦300,000" |
| 5 | January | Stone | 0:33 | 8 s | "Two payments came in after the due date. The circle still closed." |
| 6 | Circle Health | Ivory | 0:41 | 9 s | "Circle Health 86. Healthy." |
| 7 | The app | Stone | 0:50 | 13 s | Four screens, one line each |
| 8 | One nudge | Ivory | 1:03 | 6 s | "Two members still to pay. Send a friendly reminder." |
| 9 | Payout day | Dark | 1:09 | 9 s | "It's your turn, Adaeze. ₦300,000 · Fri 27 Feb" |
| 10 | End card | Ivory | 1:18 | 8 s | "Save together. Watch the Pot fill." plus the concept and no-returns line |

Total: 86 seconds.

## Scenes

Times are seconds from the start of each scene. "Hold" marks where presenter mode pauses.

### 1 · The coin ring (dark, 7 s)

- **Composition:** indigo field. The coin ring (ivory strokes) starts as a macro close-up filling the frame, so only a curve of the outer ring shows. It ends centred at 240 px above the wordmark and the headline.
- **Keyframes:**
  - 0.0: ring scaled 9×, offset so one arc crosses the frame; grain of light along the stroke.
  - 0.0–2.4: macro-to-wide pull-out to scale 1 (`expo.inOut`).
  - 1.8–2.8: the inner rim draws on (DrawSVG); the wordmark "kolo" draws on below.
  - 2.6–3.6: kinetic type, characters rising through a mask: "Saving together is older than banks."
  - 3.6: **hold** (2.6 s).
  - 6.2–7.0: the ring grows and the frame cuts to ivory through a circle mask centred on the ring (masked match cut).
- **Carries out:** the coin ring.

### 2 · Six friends (ivory, 8 s)

- **Composition:** asymmetric. The ring becomes a large stone guide circle on the right (radius 330), with six avatars around it in payout order (TB, CE, IM, AN, FA, EO). The kinetic type sits on the left. Three parallax layers: an oversized "ajo · esusu · kolo" word band (slowest), the guide circle (middle), and the avatars and names (fastest).
- **Keyframes:**
  - 0.0–0.8: ivory circle mask opens from the ring's centre.
  - 0.4–1.6: the ring expands and thins into the guide circle.
  - 1.0–2.4: avatars pop on in turn (`back.out`), each with a first name.
  - 1.6–3.0: lines rise: "Six coworkers." / "₦50,000 each, every month." / "One of them collects ₦300,000."
  - 3.0: **hold** (3.6 s), with a slow parallax drift through it.
  - 6.6–8.0: the guide circle shrinks towards the Pot's ring position; avatars fade back.

### 3 · The Kolo Pot (ivory, 8 s)

- **Composition:** the Pot top view centred left. The 24 light segments appear around the inner rim (the coin ring's inner circle). On the right: the title and one sentence.
- **Keyframes:**
  - 0.0–1.2: macro on three segments (scale 3.4) as the segments fade in.
  - 1.2–3.0: macro-to-wide pull-back. The 3/4 Pot render (`pot-34.jpg`) is revealed through a circle mask matching the light ring (masked match cut from graphic to photo).
  - 2.4–3.4: "The Kolo Pot." Then: "Tap the top. The light ring shows how much of this cycle's Pot is in."
  - 3.4: **hold** (3.4 s).
  - 6.8–8.0: the photo fades and the top-view SVG ring stays. The chapter dims to indigo.

### 4 · Contributions arrive (dark, 10 s)

- **Composition:** the Desk Pot (indigo body) centred, with six avatars on the ring and a counter on the right. A "Demo data" tag sits in the corner.
- **Keyframes:**
  - 0.0–0.8: indigo chapter; the segments turn saffron at 70% ("still due").
  - 1.0–6.2: four payments, one every 1.3 s (Tunde, Chioma, Ibrahim, Adaeze). For each, a coin travels from the avatar to the centre, four segments turn teal one by one, the avatar ring turns solid teal, and the counter steps up by ₦50,000.
  - 6.4: **hold** "4 of 6 paid · ₦200,000 of ₦300,000" (3.0 s).
  - 9.4–10.0: cut to stone.

### 5 · January (stone, 8 s) · Pot-to-chart morph

- **Composition:** the ring sits centre, then becomes a six-month bar chart (Sep–Feb) on a baseline in the lower half. The headline sits top left.
- **Keyframes:**
  - 0.0–1.6: MorphSVG. The 24 ring segments morph into the first 24 blocks of the chart (6 months × 6 blocks); the other 12 blocks fade in.
  - Block colours: Sep–Dec all teal. In January, 4 teal and 2 saffron with the label "after the due date". In February, 4 teal and 2 dashed outlines labelled "due Fri".
  - 1.6–2.6: month labels and totals rise.
  - 2.4–3.4: "January, after the holidays." / "Two payments came in after the due date. The circle still closed, and Ibrahim collected on 3 Feb."
  - 3.4: **hold** (3.6 s).
  - 7.0–8.0: blocks morph back into the ring.

### 6 · Circle Health (ivory, 9 s)

- **Composition:** three input tiles on the left at different depths, converging into the health ring on the right.
- **Keyframes:**
  - 0.0–1.2: tiles fly in with layered parallax: "94% on-time rate", "4 of 6 paid this cycle", "4 days to payout".
  - 1.2–2.8: tiles slide into the ring; the teal arc draws to 86%; the number counts 0 → 86.
  - 2.8–3.4: "Circle Health 86. Healthy." and a small line: "Demo formula: 0.65 × on-time + 0.25 × paid + 0.10 × readiness."
  - 3.4: **hold** (4.4 s).
  - 7.8–9.0: the ring and tiles slide off; a browser frame slides in.

### 7 · The app (stone, 13 s) · walkthrough

- **Composition:** a large browser frame (rounded card, `kolo · demo app` label) holding the captured app screens, with a phone (mobile Home) in the foreground for parallax. Captions sit on the left.
- **Keyframes:**
  - 0.0–1.0: the frame rises in.
  - Overview, 1.0–3.6: the screenshot scrolls slowly. "Overview: today's number first."
  - 3.6–4.2: masked wipe to Circle, Funmi's panel open. "Circle: who has paid, without chasing." Held until 6.6.
  - 6.6–7.2: wipe to Contributions, January zoom. "Contributions: six months, January included." Held until 9.6.
  - 9.6–10.2: wipe to Payouts. "Payouts: whose turn, and when." Held until 12.4.
  - The phone drifts against the frame throughout.
  - 12.4–13.0: the frame shrinks into the suggested-action card.

### 8 · One nudge (ivory, 6 s)

- **Composition:** the suggested-action card centred, with the light ring behind it.
- **Keyframes:**
  - 0.0–0.8: the card settles: "Two members still to pay. Send a friendly reminder."
  - 1.2: the button presses.
  - 1.6–3.4: Funmi's and Emeka's segments turn teal. Health counts 86 → 96, the Pot ₦200,000 → ₦300,000.
  - 3.4: **hold** "Everyone has paid. The Pot is full." (2.0 s).
  - 5.4–6.0: the circle mask closes to indigo.

### 9 · Payout day (dark, 9 s)

- **Composition:** macro-to-wide. Start close on Adaeze's avatar, pull back to the full teal ring breathing with all six around it. Big type below.
- **Keyframes:**
  - 0.0–2.2: macro on AN (scale 4) pulls back to wide.
  - 1.0 onward: the ring breathes (opacity 1 → 0.55 → 1, 3.2 s loop).
  - 2.2–3.2: "It's your turn, Adaeze." / "₦300,000 · Fri 27 Feb".
  - 3.2: **hold** (5.0 s).
  - 8.2–9.0: the ring shrinks and the circle mask opens to ivory.

### 10 · End card (ivory, 8 s)

- **Composition:** the coin ring returns to the Kolo mark above the wordmark; the closing line, then the call to action and the disclaimer.
- **Keyframes:**
  - 0.0–1.2: the ring settles into the mark.
  - 1.0–2.2: "Save together. Watch the Pot fill."
  - 2.2–2.8: the "Explore the demo" button (link to `/app/`) and the line: "Concept with demo data. Kolo gives no financial advice and promises no returns."
  - 2.8: **hold** to the end.

## Player

- **Autoplay** (default): plays straight through, with holds built into the timing. Stops on the end card.
- **Presenter:** plays each scene to its hold and waits. → or Space continues.
- **Controls:**
  - Play/pause
  - A seek bar with scene markers (click a marker to jump)
  - Previous and next scene
  - Replay
  - Mode switch
  - Fullscreen
  - The controls fade while playing and return on mouse movement or focus.
- **Keyboard:**

| Key | Action |
| --- | --- |
| Space / K | Play, pause, or continue in presenter mode |
| ← / → | Previous / next scene |
| J / L | Back / forward 5 s |
| Home / R | Replay from the start |
| P | Toggle autoplay / presenter |
| F | Fullscreen |
| 1–9, 0 | Jump to scene 1–10 |

- **Reduced motion:** no movement. Each scene shows its held frame as a still, and the story steps between stills like slides (on a timer in autoplay, by key in presenter). Seeking still works.
- **Accessibility:**
  - A polite live region announces each scene's title and message.
  - A visually hidden transcript lists every scene's text.
  - All controls are labelled buttons with a visible focus ring.

## Editing

- **Copy and timing:** `src/kolo_deck/scenes.ts`, one entry per scene (title, chapter, length, hold, lines).
- **Motion:** `src/kolo_deck/scenes/<NN-name>.tsx`, one file per scene. Each exports its markup and a `build()` that adds its keyframes to the master timeline.
- **Carried objects:** `src/kolo_deck/Carry.tsx` (coin ring and light ring).
- **Player:** `src/kolo_deck/Player.tsx`.
- **App screenshots:** `public/story/` (re-capture with the steps in `PROJECT_INFO.md`).
