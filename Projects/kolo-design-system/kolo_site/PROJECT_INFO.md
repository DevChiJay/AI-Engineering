# kolo_site · project info

Kolo is a fictional savings-circle (ajo / esusu) app with a companion object, the Kolo Pot. This site is a **static export**: `pnpm build` writes plain files to `out/`. The approved launch page sits at the root and the member web app demo under `app/`. Any static host can serve `out/` as is. All members, amounts and dates are invented. Kolo gives no financial advice and promises no returns.

## Deliverables

| Output | Where |
| --- | --- |
| Spec | `../kolo_web_app_spec.md` (written first; acceptance checklist A1–A18) |
| Claude Design prototype | `kolo_app` canvas: https://claude.ai/artifact/36P3VqqwS8H4yVeDoGCg7i (private until shared) |
| Dummy dataset | `src/data/kolo-demo.json`, typed by `src/data/types.ts` |
| Site | this folder (`kolo_site`); deployable build in `out/` |
| Launch page | `public/index.html`, `styles.css`, `main.js`, `assets/` (served at the site root; this is now the only copy) |
| Live site | https://kolopot.web.app (Firebase Hosting, `firebase.json` serves `out/`) |
| Motion story | `../kolo_storyboard.md` (10 scenes), source in `src/kolo_deck/`, served at `/story/` |

The prototype holds 11 boards built on the Kolo design system, whose tokens are installed on the canvas:
- the five screens at 1440 px
- three detail states: Funmi's member panel, the January chart zoom and Ibrahim's payout panel
- the empty-states board
- two shared parts: the app header and the Circle Health lead

## Stack

| Package | Version | Use |
| --- | --- | --- |
| Next.js (App Router) | 15.5.29 | routes, metadata, `output: "export"` |
| React | 19.1.10 | UI |
| TypeScript | 5.9.3 | types (`pnpm typecheck`) |
| Tailwind CSS | 4.1.18 | styling; Kolo tokens in `@theme`, default palette cleared |
| Recharts | 2.15.4 | Circle Health line, monthly contribution bars |
| GSAP | 3.13.0 | tab transitions, chart zoom, number and ring tweens, panels; in the story also SplitText, MorphSVG and DrawSVG (all included in 3.13) |
| Vitest | 3.2.7 | dataset and selector tests |

Package manager: pnpm. Node 24. Font: Plus Jakarta Sans through `next/font`.

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3000  ( / = launch page, /app/ = demo )
pnpm test       # 13 checks of the spec's numbers
pnpm typecheck
pnpm build      # static export to out/ (stop `pnpm dev` first: both use .next)
pnpm preview    # serve out/ as plain files at http://localhost:4173
```

In the Claude desktop app, `../.claude/launch.json` has two entries for the preview pane: `kolo-site` runs the dev server and `kolo-static` serves `out/`.

## Static export

```
out/
  index.html  styles.css  main.js  assets/   approved launch page (from public/)
  icon.svg
  app/index.html                              Overview
  story/index.html  story/app-*.jpg           motion story and its app screenshots
  app/circle/index.html  app/contributions/index.html  app/payouts/index.html  app/goal/index.html
  _next/                                      the app's scripts, styles and fonts
  404.html
```

- `trailingSlash: true`, so each screen is a folder with an `index.html`. Links point to `/app/`, and hosts serve `/app` by redirecting to `/app/`.
- The landing page keeps its original relative paths (`styles.css`, `assets/…`), which resolve from the root. Edit `public/index.html` directly; it is the only copy. (The earlier `launch/kolo_launch_page` source and its sync script were removed.)
- Each app page's HTML is prerendered with Adaeze's full data, so it reads before any JavaScript runs. `?demo=new` is read in the browser and swaps in the empty profile after load.
- The wordmark in the app links to `/` with a plain `<a>`, not a Next.js `<Link>`, because `/` is a static page rather than a Next route.
- In dev only, Next maps `/` to `public/index.html`. The build uses no rewrites, redirects or server code.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Approved launch page (`out/index.html`) with three Explore demo links to `/app/` and two links to `/story/` |
| `/app` | Overview: Circle Health, Pot light ring (indigo panel), suggested action, next payout, six-month health chart with zoom, streak, goal |
| `/app/circle` | Members in payout order; each row opens the member panel |
| `/app/contributions` | Streak, totals, monthly stacked bars with zoom, payment history, the January note |
| `/app/payouts` | Coin track and turn list; each opens the payout panel |
| `/app/goal` | Rent deposit coverage and the three steps |
| any `/app` route `?demo=new` | Empty-state profile (Saturday Circle, just created) |
| `/story/` | 86-second motion story with autoplay and presenter modes |

## Structure

```
src/data/kolo-demo.json     the only source of figures (two profiles: adaeze, new)
src/lib/selectors.ts        everything derived: Circle Health, Pot, streaks, turns, chart data
src/lib/format.ts           naira(), date formats
src/lib/demo-context.tsx    DemoProvider (default profile, prerendered) and DemoFromSearch (?demo= in the browser), demo payments, announcements
src/lib/motion.ts           reduced-motion helpers
src/components/             AppShell, HealthLead, PotRing, DetailPanel, ZoomCard, EmptyState, charts/, screens/
src/app/app/template.tsx    tab-change enter animation
src/styles/globals.css      Kolo tokens (@theme), component classes
src/lib/seo.ts              SITE_URL, the Devchi Digital credit and pageMeta() for canonical, Open Graph and X tags
public/og/                  1200 × 630 share images: kolo-share.jpg (landing), kolo-app.jpg (app), kolo-story.jpg (story)
public/                     the launch page: index.html, styles.css, main.js, assets/
tests/selectors.test.ts     spec numbers
```

## Design decisions

- **Look:** the approved launch page leads, with an ivory sticky header, a concept bar, large editorial headings and asymmetric 12-column layouts. The design system leads the components: card style, 52px buttons, 44px avatars, chips and ring strokes. Overview is the only page with an indigo panel.
- **Colour:** Tailwind's default palette is cleared, so only Kolo colours exist and no red or green can be used. Teal means paid, saffron means due, and every saffron mark sits beside a word.
- **Circle Health:** an invented, documented formula (spec §4): `0.65 × on-time rate + 0.25 × paid % + 0.10 × readiness`. It gives 86 today, 90 when Funmi pays and 96 when Emeka pays too, and reproduces the six-month history: 90, 94, 90, 86, 81, 86.
- **Data consistency:** names, dates and January's story match the earlier kolo_web designs. Funmi paid 2 Feb and Emeka 3 Feb, after the 30 Jan due date, and Ibrahim collected 3 Feb.
- **Demo actions:** "Mark Funmi/Emeka paid (demo)", Reset, "Send reminder" and "Copy invite link" change only in-page state. They send nothing and say so.
- **Landing page:** served unchanged apart from the full-document wrapper, the Explore demo links and two links to the story (a "Story" nav item and "Watch the story" in the demo section). Its asset paths are untouched, and its CSS and JS are byte-identical to the source.
- **Motion:** GSAP for the tab reveal and sliding indicator, the chart-to-detail zoom (a clip-path grows out of the month's column) and the Pot and Circle Health updates (count-up, ring arc, segments lighting). Each runs 0.35–0.7 s and never blocks input. With reduced motion, or when the page isn't visible, values change at once.

## Spec check (18 Nov 2026)

Verified with `pnpm test` and `pnpm build`, and in a real browser through Playwright and the Claude preview pane. After the switch to static export, the flows were re-run against `out/` served as plain files: launch page → Explore demo → `/app/`, demo payment, tab changes, `?demo=new` and the wordmark back to `/`. No console errors.

| ID | Result | Notes |
| --- | --- | --- |
| A1 | Pass | `out/index.html` is the approved page; only the document wrapper, Explore demo links and story links differ; CSS and JS identical |
| A2 | Pass | 3 links to `/app/` (nav, hero, demo section); on the static build, clicking the hero link opened `/app/` |
| A3 | Pass | Five routes; each leads with the Circle Health card |
| A4 | Pass | 86, 94%, 4 of 6, 4 days, ₦200,000 of ₦300,000, ₦300,000 on Fri 27 Feb, streak 9, 75% (tests and rendered page) |
| A5 | Pass | Exact suggested-action and nudge text |
| A6 | Pass | Sep–Feb history agrees across pages; all derived from one dataset |
| A7 | Pass | January bars and panels show Funmi 2 Feb and Emeka 3 Feb after the due date; Ibrahim collected 3 Feb |
| A8 | Pass | 86 → 90 → 96 and ₦200,000 → ₦250,000 → ₦300,000; mid-tween values stay in round thousands (e.g. ₦237,000); Reset restores today |
| A9 | Pass | Tab indicator slides and blocks reveal in sequence; January zoom grows from its column and Esc closes it |
| A10 | Pass | Panels open as modal `<dialog>`, focus moves inside, Esc closes, focus returns to the opener |
| A11 | Pass | `?demo=new` shows designed empty states on all five pages and carries across tabs |
| A12 | Pass | All on-screen amounts use `naira()`; the only other ₦ literals are in metadata descriptions |
| A13 | Pass | Source scan: every hex is a Kolo token; no red or green |
| A14 | Pass | Reduced motion: full opacity at once; values jump to the final number; zoom and panels open without animating |
| A15 | Pass | Skip link, visible 3px teal focus ring, Enter and Space open rows, coins, months and panels |
| A16 | Pass | Per-route title ("Circle · Kolo demo"), description, Open Graph, `noindex`, theme colour, icon |
| A17 | Pass | Demo bar and no-advice, no-returns statement on every app page |
| A18 | Pass | 1440, 768 and 375: no horizontal page scroll; tables and the coin track scroll inside their own boxes |

## Known limits

- Deploy with `pnpm build` then `firebase deploy --only hosting:KoloPot`. `metadataBase` is https://kolopot.web.app, so every share URL is absolute.
- `/app/` and `/story/` are `noindex` (demo pages); share previews still work, since LinkedIn and X read the tags regardless.
- Demo state lives in memory and resets on reload.
- `kolo-design-system/` is in the repo's `.gitignore`, so this folder isn't committed.
- No ESLint config is set up; `next build` type-checks.

## Motion story (`/story/`)

An 86-second React and GSAP story in ten scenes: the coin ring, six friends, the Kolo Pot, contributions arriving, January (the Pot-to-chart morph), Circle Health, the app walkthrough, one nudge, payout day and the end card. The storyboard (`../kolo_storyboard.md`) gives each scene's composition, timing and keyframes.

```
src/kolo_deck/
  scenes.ts            copy, length, hold and chapter colour for every scene (edit text and timing here)
  scenes/01-ring.tsx … 10-end.tsx   one file per scene: its markup (View) and its keyframes (build)
  Carry.tsx            objects carried across scenes: coin ring, Pot body, 24-segment light ring, health arc, chart blocks
  geometry.ts          stage size (1920 × 1080), ring and chart geometry
  motion.ts            helpers: kinetic type (SplitText), counters, lighting a member's segments
  Player.tsx           master timeline, autoplay and presenter modes, seek bar, keyboard, reduced motion, live region
  deck.css             stage, type scale and controls
src/app/story/page.tsx route and metadata
public/story/          app screenshots used in scene 7
```

**Editing a scene:**
- Change words, lengths or hold points in `scenes.ts`; the timeline re-lays itself out.
- Change motion in that scene's `build()`. Every keyframe is at `at + offset` seconds.
- Objects that persist between scenes are changed with `set` + `to`, never `fromTo`, so seeking backwards always restores them.
- In dev, `window.__koloStory` is the master timeline (`__koloStory.seek(23, false)` jumps to scene 4). It isn't present in the production build.

**Controls:**
- Autoplay (default) or presenter mode, which stops on each scene's hold.
- Play/pause, previous and next scene, replay, a seek bar with scene markers, fullscreen, and a link to the demo app.

| Key | Action |
| --- | --- |
| Space / K | Play or pause |
| ← / → | Previous / next scene |
| J / L | Back / forward 5 s |
| R / Home | Replay |
| P | Toggle autoplay / presenter |
| F | Fullscreen |
| 1–0 | Jump to scene 1–10 |

**Reduced motion:** each scene shows its held frame as a still. Autoplay steps on a timer, presenter steps by key, and the timeline never plays.

**Re-capturing the app screens** for scene 7: run `pnpm build && pnpm preview`, turn on reduced motion, set a 1440 × 900 viewport, and save JPEGs to `public/story/`:
- `app-overview.jpg`: full page of `/app/`
- `app-circle.jpg`: `/app/circle/` with Funmi's panel open
- `app-contributions.jpg`: `/app/contributions/` with the January zoom, scrolled to the chart
- `app-payouts.jpg`: `/app/payouts/` scrolled 360 px

**Story check (18 Nov 2026):**
- **Timing:** 10 scenes, 86 s, inside the 60–90 s brief.
- **Frames:** I viewed every held frame, plus the macro opening, the mid-morph and the payout macro.
- **Presenter mode:** stops on holds (3.6 s, 10.0 s, 18.4 s); → and Space advance.
- **Keyboard:** number keys jump scenes; J/L, the seek bar and its screen-reader text work.
- **Reduced motion:** stills only; timed stepping in autoplay.
- **Static build:** plays with all images and no console errors.
- **Phone width:** letterboxes with no sideways scroll.
- Not done: no video export, and no Claude Motion sequence studies (that tool wasn't available here).

## Credit and share tags (19 Nov 2026)

- **Credit:** "Designed and built by Devchi Digital" links to https://devchi.me (new tab, `rel="noopener"`). It appears in:
  - the landing page footer
  - the footer line of every app page
  - the story's end card and its controls bar
- **Landing page head:**
  - Removed the artifact-only `claude:viewport-fit-sides` meta.
  - Added a canonical URL, `og:type`, `og:site_name`, `og:url`, `og:image` (with width, height and alt), a `twitter:card` of `summary_large_image`, and the `twitter:title`, `twitter:description` and `twitter:image` tags.
  - Every URL is absolute on https://kolopot.web.app.
- **App and story pages:** each route gets the same set from `pageMeta()` in `src/lib/seo.ts`.
- **Checked in the exported HTML:** no `localhost`, no `claude:` and no other non-standard tags remain.
- **After deploying:** check a URL with LinkedIn's Post Inspector (https://www.linkedin.com/post-inspector/). It also refreshes LinkedIn's cached preview.
