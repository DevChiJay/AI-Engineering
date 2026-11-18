# Kolo: a savings circle you can see

**A product concept by Devchi Digital: brand, app, hardware and launch, designed and built end to end.**

- **Live site:** https://kolopot.web.app
- **Try the app:** https://kolopot.web.app/app/
- **Watch the 86-second story:** https://kolopot.web.app/story/
- **Studio:** https://devchi.me

![Kolo launch page](https://kolopot.web.app/og/kolo-share.jpg)

> Kolo is a concept. Every member, amount and date is demo data, and no real money moves. Kolo gives no financial advice and promises no returns.

---

## The problem

Across Nigeria and West Africa, millions of people save in rotating circles called **ajo** or **esusu**. A small group of friends, coworkers or family each put in the same amount on a fixed day, and each cycle one member collects the whole pot. It works because people trust each other. "Kolo" is Nigerian Pidgin for a piggy bank.

The tools behind it haven't kept up. Most circles run on a WhatsApp group, a notebook and one patient organiser, and that causes the same problems again and again:

- **Nobody can see the state of the circle.** Who has paid? How much is in? Whose turn is next? The answer lives in one person's head or a scrolling chat.
- **Chasing payments strains friendships.** Reminders feel personal, and a late payment can turn into public shame in the group chat.
- **Not everyone uses an app.** Parents, aunties and older relatives belong to circles too, and many won't open an app to check a number.
- **Health is invisible until it's a problem.** A circle drifts when payments slip, and there's no early signal that it's happening.

Most banking apps don't fit this. They're built for individuals, accounts and returns, not for a group of people keeping a promise to each other.

## The idea

Kolo makes the circle visible to everyone in it, in two ways:

1. **The Kolo app.** Every screen leads with one number, **Circle Health**, a 0–100 score built from three inputs everyone can understand: the on-time rate, how many members have paid this cycle, and the days to payout. Beside it sit the Pot, your payout turn and one suggested action, such as "Two members still to pay. Send a friendly reminder."
2. **The Kolo Pot.** A screenless object for the shelf or the office desk. Tap the top and a ring of 24 lights shows how much of this cycle's Pot is in: four segments per member, teal when paid, saffron when still due. On payout day the full ring breathes. People who never open the app can still see how the circle is doing.

The tone is warm and communal: **saving with friends, not a bank**. Kolo nudges and never shames. It says "Due Fri", never "late", and it never uses red.

---

## What I made

| Deliverable | What it is |
| --- | --- |
| **Kolo design system** | Colour tokens, type scale, spacing, components (score card, Pot ring, member row, payout timeline, buttons) and a monoline wordmark whose two o's are coin rings |
| **Kolo Pot product design** | A spec sheet (Ø110 × 72 mm, 250 g, 24 LEDs, tap sensor, 2,000 mAh, USB-C), 3D renders, three editions (Home, Desk, Owambe) and paper-only packaging |
| **Launch page** | A cinematic one-page launch for the app and the Pot, with a pinned hero where the light ring fills as members pay |
| **Web app spec** | Screens, data model, Circle Health formula, motion rules, accessibility and an 18-point acceptance checklist, written before any app code |
| **Clickable prototype** | Eleven boards in Claude Design: five screens, three detail states, empty states and shared parts |
| **Working web app** | Five screens at `/app/` in Next.js, driven by one consistent six-month dataset |
| **Motion story** | An 86-second, ten-scene browser story at `/story/` with autoplay and presenter modes, for pitches and portfolios |
| **Live, shareable site** | Static export on Firebase Hosting, with proper share previews for LinkedIn and X |

---

## The screens

### Launch page · https://kolopot.web.app

A warm, editorial launch page: ivory and soft stone, one indigo chapter, large type and asymmetric layouts.

- **Pinned hero:** as you scroll, the camera moves over the Pot, six members pay ₦50,000 each, four light segments turn teal per payment, and the Pot fills to ₦300,000.
- **App bento:** Circle Health, the Pot and the payout turn as live components that expand on click.
- **The Pot chapter (indigo):** an interactive Pot. Tap shows this cycle, double tap shows Circle Health, and payout day shows the full ring breathing.
- **Editions, specs, FAQ and a demo request form.** The FAQ answers the hard questions plainly: no advice, no returns, no interest.

### The app · https://kolopot.web.app/app/

![Kolo app Overview](https://kolopot.web.app/og/kolo-app.jpg)

Adaeze Nwosu, 29, is saving for a rent deposit with the Friday Circle: six coworkers, ₦50,000 each a month, ₦300,000 per turn. Today is Monday 23 February. Four of six have paid, and Adaeze collects 4th, on Friday.

| Screen | What you see |
| --- | --- |
| **Overview** | Circle Health 86 with its three inputs; the Pot's light ring (₦200,000 of ₦300,000); your turn; the suggested action; a six-month health chart that zooms into any month; your streak (9 on time); your goal (75% covered) |
| **Circle** | All six members in payout order, who has paid and when. Each row opens a member panel with their six-month history and a friendly reminder |
| **Contributions** | Your streak and totals, a month-by-month chart of the whole circle that zooms into a month's detail, and your payment history. January shows two payments after the due date, after the holidays |
| **Payouts** | The Round 2 order as coins: three collected, yours next. Each turn opens a panel, including why Ibrahim collected on 3 Feb instead of 30 Jan |
| **Goal** | Your ₦300,000 payout covers 75% of a ₦400,000 rent deposit. It describes the numbers and gives no advice |

**Try it:**
- Press "Mark Funmi paid (demo)" on the Overview. Circle Health counts from 86 to 90, the Pot rises to ₦250,000 and four more segments light.
- Switch the header to "New circle" to see the designed empty states on every page.

| | |
| --- | --- |
| ![Circle with member panel](https://kolopot.web.app/story/app-circle.jpg) | ![Contributions, January detail](https://kolopot.web.app/story/app-contributions.jpg) |
| **Circle** · Funmi's member panel | **Contributions** · January zoom |

### The motion story · https://kolopot.web.app/story/

![Kolo motion story, payout day](https://kolopot.web.app/og/kolo-story.jpg)

Eighty-six seconds that tell the whole product: who it's for, what the Pot does, how contributions arrive, what Circle Health means, the app, and payout day. Two objects carry through every scene: the coin ring from the logo, and the Pot's light ring.

| # | Scene | What happens |
| --- | --- | --- |
| 1 | The coin ring | A close-up of the logo's ring pulls out to the wordmark: "Saving together is older than banks." |
| 2 | Six friends | The ring becomes the circle six coworkers stand on |
| 3 | The Kolo Pot | A close-up of the light segments pulls back to the Pot; the render opens through a circle mask |
| 4 | Contributions arrive | Four payments travel into the Pot; ₦0 counts to ₦200,000 |
| 5 | January | The ring's 24 segments morph into a six-month bar chart |
| 6 | Circle Health | Three inputs pour into the score ring: 86, Healthy |
| 7 | The app | A walkthrough of the real app screens |
| 8 | One nudge | A reminder, the last two payments, the Pot full |
| 9 | Payout day | The camera starts close on Adaeze and pulls back to the full ring breathing |
| 10 | End card | "Save together. Watch the Pot fill." |

It runs in two modes. Autoplay plays straight through. Presenter mode pauses on each key message, so you can talk over it in a pitch. Press Space to play or pause, ← → to change scene, and P to switch modes.

---

## How I built it

### Process

1. **Taste brief and reference.** I set the feeling first: warm, trustworthy, communal. A reference fintech's layout and money presentation gave a starting point, and then I replaced every choice that still looked borrowed.
2. **Design system.** I picked six colours with fixed meanings, one typeface (Plus Jakarta Sans) and soft, rounded components, and drew a wordmark where the o's are coin rings.
3. **The Pot.** I wrote the spec sheet, then made 3D renders, three editions for three kinds of circle, and paper-only packaging.
4. **Launch page.** I art-directed the launch with a pinned product hero, expanding cards, masked reveals and a live Pot ring.
5. **Spec before code.** I wrote one document setting screens, data, the Circle Health formula, motion rules, accessibility and an 18-point acceptance checklist.
6. **Prototype, then product.** I designed the screens in Claude Design, then built them in Next.js against the spec and checked every item off.
7. **Story.** I storyboarded ten scenes with timings and keyframes, then built them as editable code.
8. **Ship.** The site is a static export on Firebase Hosting, with share previews, credits and absolute URLs.

### Tools and stack

- **Design:** Claude Design for the design system, Pot boards and app prototype.
- **Build:** Claude Code, Next.js 15 (static export), React 19, TypeScript, Tailwind CSS 4.
- **Charts and motion:** Recharts; GSAP 3.13 with SplitText (kinetic type), MorphSVG (the Pot-to-chart morph) and DrawSVG (the logo and score rings).
- **Quality:** Vitest for the data and Playwright for browser checks.
- **Hosting:** Firebase Hosting.

### Design decisions that matter

- **No red, no green.** Teal means paid and saffron means still due, and saffron always comes with a word. A late payer is never shamed by colour.
- **One number first.** Circle Health leads every page, and its formula is written down and visible. Today's score: 0.65 × the on-time rate (94%) + 0.25 × the share paid this cycle (4 of 6) + 0.10 × readiness (4 days to payout) = 86.
- **One dataset, everywhere.** Six months of demo data (September to February, including January's late payments) drive every screen, chart, panel and scene, so the numbers always agree.
- **Money that reads.** Naira is always shown as ₦ with comma thousands, in tabular figures. Counting animations step in whole thousands, so a value is readable mid-motion.
- **Motion with manners.**
  - Tab changes, chart zooms and Pot updates all animate, but never block a click.
  - With reduced motion, everything appears at once and the story becomes still slides.
- **Accessible by default.** Keyboard access throughout, focus that returns where it started, screen-reader announcements for live changes, and a transcript of the story.
- **Honest labelling.** Concept and demo-data labels sit on every page, with no advice and no promised returns.

### Quality

- 13 automated tests confirm the spec's numbers: Circle Health 86 → 90 → 96, the Pot, the streak, January's late payments.
- All 18 acceptance checks passed, recorded in `kolo_site/PROJECT_INFO.md`.
- Checked at 1440, 768 and 375 px wide, with keyboard only and with reduced motion.
- The live site serves every route with no console errors.

---

## What this means for clients

If you're building something where **trust between people** matters as much as the money itself (community savings, cooperatives, group payments, a bank's group product, a fintech going after the informal market), this is the work I can do for you.

- **From brief to live product, in one pass.** Brand, design system, product, hardware story, web app, launch page and pitch film, all consistent because they share one source of truth.
- **A prototype that actually works.** Not static mockups. Investors, users and stakeholders can click through real flows with realistic data, on a link you can send today.
- **Design for your real users.** Research-led choices, like not shaming late payers and serving members who never open an app, make adoption more likely in communities built on trust.
- **A pitch asset that does the talking.** The motion story runs on its own at events or pauses on each point in presenter mode. It's built in code, so you can change the words and timing without a video editor.
- **Built to hand over.** Clear specs, typed code, tests, documented decisions, and a static site that costs almost nothing to host.
- **Fast.** Kolo went from taste brief to a live site with a working app and a motion story in about a week.

---

## Let's build yours

- **Explore the live demo:** https://kolopot.web.app/app/
- **Watch the 86-second story:** https://kolopot.web.app/story/
- **See the launch page:** https://kolopot.web.app

**Have a product people need to trust?** I design and build it end to end, from the first brief to the launch.

**Start a project with Devchi Digital → https://devchi.me**

---

<sub>Kolo is a fictional product made as a design and engineering case study. All members, amounts and dates are invented. No real money moves and no accounts connect. Kolo gives no financial advice and promises no returns. Designed and built by Devchi Digital.</sub>
