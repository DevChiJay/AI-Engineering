# Kolo web app spec

Version 1 · 18 Nov 2026 · For the `/app` demo inside `kolo_site`

## 1. Purpose and scope

Kolo is a fictional group savings app for running a savings circle (ajo / esusu). The web app is a **clickable demo** for one member, Adaeze Nwosu, in the Friday Circle. It shows Circle Health, the Pot and the payout turn, with one suggested action beside the numbers.

- All members, amounts and dates are invented. No real money moves and no accounts connect.
- Kolo gives no financial advice and promises no returns. It shows what the circle has paid and collected and adds no interest.
- Out of scope: real payments, bank connections, loans, interest, investing, chat and public leaderboards.

Sources: `brand/Kolo_Product_Spec.md`, `brand/taste_brief.md`, the published Kolo design system, the approved launch page (`launch/kolo_launch_page`) and the earlier kolo_web designs, whose figures this spec keeps.

## 2. Look and feel

- **The approved launch page leads the overall look.** The app uses an ivory sticky nav with the indigo wordmark, a thin concept bar, large editorial headings (Plus Jakarta Sans 800, tight tracking), asymmetric 12-column layouts and generous space.
- **The Kolo design system leads the components.** Tokens, card style (`card` fill, 1px `stone-soft` border, `radius-lg`, no shadows), 52px buttons, 44px avatars, 10px ring strokes, chips and the coin motif all come from it unchanged.
- Backgrounds are ivory and soft stone. Each page may use **at most one indigo panel**. Overview uses it for the Pot's light ring.
- Teal means paid, Pot progress and high Circle Health. Saffron means pending, due or low Circle Health, and always sits beside a word in `saffron-ink`. **No red or green anywhere.**
- Copy is sentence case, plain and kind. Say "Due Fri", never "late" or "overdue" about a person. Data about January may say "after the due date".

## 3. Routes and screens

Every page leads with today's Circle Health. The header holds the wordmark, five tabs, the demo profile switch and Adaeze's avatar.

| Route | Screen | Must show |
| --- | --- | --- |
| `/app` | Overview | Circle Health 86 with its three inputs, the Pot ₦200,000 of ₦300,000 with members around it, next payout (your turn, ₦300,000 on Fri 27 Feb, in 4 days), the suggested action, streak 9 and goal 75%, and a six-month Circle Health chart that zooms into a month |
| `/app/circle` | Circle | Six members in payout order, each with payment status this cycle, paid date, payout turn and streak. Pot total row. Suggested action. Rows open the member detail panel |
| `/app/contributions` | Contributions | Adaeze's streak, total paid over six months (₦300,000) and this round (₦200,000 of ₦300,000). Six-month chart of the circle's contributions per month (on time vs after the due date) that zooms into a month's detail. Payment history table. The January note |
| `/app/payouts` | Payouts | Round 2 payout order as coins, completed and upcoming turns marked, Ibrahim's turn collected 3 Feb. Every turn opens the payout detail panel. Your-turn card with the Pot so far |
| `/app/goal` | Goal | Rent deposit ₦400,000, payout covers ₦300,000 (75%), ₦100,000 still to cover, three steps to get there. Describes the numbers only; no advice |

### Detail panels

- **Member panel** (from Circle, Overview avatars): name, payout turn and date, this cycle's status and paid date, streak, six-month dots, and for an unpaid member a demo "Mark paid" button.
- **Payout panel** (from Payouts): turn number, member, scheduled date, collected date or "upcoming", amount ₦300,000, who has paid into that turn's Pot, and a note when the collection moved (January: collected 3 Feb because two contributions came after the due date).
- Panels are modal side drawers: they trap focus, close on Esc and the close button, return focus to what opened them, and are labelled by their heading.

### Empty states

The demo profile switch (`?demo=new`) loads a new circle, "Saturday Circle", with only its creator and nothing paid yet. Each page then shows a designed empty state with a short title, one line of explanation, the coin-ring motif and one action:

| Page | Heading · card title | Action |
| --- | --- | --- |
| Overview | "Your circle starts when everyone's in." · "The Pot fills once the round starts." Circle Health shows "Not scored yet" | Invite members |
| Circle | "No members yet." · "Invite your circle." | Copy invite link (demo) |
| Contributions | "No contributions yet." · "Your first payment opens the record." | See how rounds work |
| Payouts | "No payout order yet." · "The payout order is set when the round starts." | Invite members first |
| Goal | "No goal yet." · "Give your savings a name." | Set a goal (demo) |

## 4. Data

The dataset lives at `kolo_site/src/data/kolo-demo.json`. Every figure on screen is derived from it by `src/lib/selectors.ts`; components hard-code no figures.

- **Today:** Monday 23 February 2026.
- **Circle:** Friday Circle, six coworkers, ₦50,000 each per month, so ₦300,000 per turn. Round 2 runs November to April. September and October close Round 1 (Emeka collected 26 Sep, Funmi 31 Oct).
- **Members in Round 2 payout order:** Tunde Bakare (TB), Chioma Eze (CE), Ibrahim Musa (IM), Adaeze Nwosu (AN, you), Funmi Adeyemi (FA), Emeka Okafor (EO).
- **Due dates** (last Friday): 26 Sep, 31 Oct, 28 Nov, 26 Dec, 30 Jan, 27 Feb.
- **January:** Funmi paid Mon 2 Feb and Emeka Tue 3 Feb, after the 30 Jan due date, following the holidays. Ibrahim collected on 3 Feb.
- **February so far:** Tunde 18, Chioma 19, Adaeze 20, Ibrahim 21 Feb. Funmi and Emeka are due Fri 27 Feb.
- **Adaeze:** saving for a rent deposit of ₦400,000; on time 9 in a row (June 2025 to February 2026); ₦300,000 paid over the six months; ₦200,000 paid into Round 2 so far; collects 4th, Fri 27 Feb.

### Circle Health (demo formula)

`score = round(0.65 × on-time rate + 0.25 × paid this cycle % + 0.10 × readiness)`

- **On-time rate:** paid contributions in the last six months that arrived by their due date, divided by all paid contributions in that window.
- **Paid this cycle %:** members paid this cycle divided by members.
- **Readiness:** 100 when everyone has paid, otherwise `min(100, days to payout × 20)`.
- 60 and up is **Healthy** (teal). Below 60 is **Needs a nudge** (saffron). Never red.

| Moment | On-time | Paid | Days | Score |
| --- | --- | --- | --- | --- |
| Today | 32 of 34 = 94% | 4 of 6 | 4 | **86** |
| Funmi pays (demo) | 33 of 35 = 94% | 5 of 6 | 4 | **90** |
| Emeka pays too (demo) | 34 of 36 = 94% | 6 of 6 | 4 | **96** |

The six-month history takes the same snapshot each month, four days before the due date: Sep 90, Oct 94, Nov 90, Dec 86, Jan 81, Feb 86.

## 5. Motion

Motion uses GSAP. Durations run 0.35–0.7 s with `power3.out`. Values stay legible on every frame, and controls respond while motion runs (no input is blocked waiting for an animation).

- **Tab change:** the new page's content rises 16px through a mask and fades in. The active-tab indicator slides to the new tab.
- **Chart-to-detail zoom:** choosing a month grows a panel from that bar's or point's rectangle into the detail card (FLIP). Closing reverses it back into the bar.
- **Pot and Circle Health updates:** the score and naira amounts count to their new values, the health ring arc and Pot ring extend, four light-ring segments turn teal, and the member's avatar ring changes from dashed saffron to teal.
- **Reduced motion:** no movement. Values and states change at once; panels appear without zooming.

## 6. Accessibility and metadata

- Skip link to the main content. Tabs are links with `aria-current="page"`.
- Every interactive element is reachable by Tab and works with Enter and Space: member rows, payout coins and rows, chart month buttons, panel controls.
- Focus ring: 3px solid `teal-ink`, 3px offset.
- Charts have a text alternative: a month button list beside each chart and a table on Contributions.
- Live updates (demo payment) are announced through a polite live region.
- Text meets 4.5:1 contrast. Saffron never carries text; `saffron-ink` does.
- Each route has its own title ("Circle · Kolo demo"), description and Open Graph data. The demo is `noindex`.

## 7. Money and dates

- Always `₦` before the amount, comma thousands, no space and no decimals: `₦50,000`. One formatter, `naira()`.
- Amounts use tabular numerals.
- Dates read "Fri 27 Feb" in rows and "27 February" in sentences.

## 8. Acceptance checklist

| ID | Check |
| --- | --- |
| A1 | `/` serves the approved landing page unchanged apart from the Explore demo links |
| A2 | Explore demo links on the landing page open `/app` |
| A3 | All five screens exist at their routes and every one leads with Circle Health |
| A4 | Overview shows 86 · 94% · 4 of 6 · 4 days, ₦200,000 of ₦300,000, your turn ₦300,000 Fri 27 Feb, streak 9, goal 75% |
| A5 | Suggested action reads "Two members still to pay. Send a friendly reminder." and the nudge line "Circle Health 86. Payout is Friday." |
| A6 | Six months of history (Sep–Feb) agree across Overview, Contributions, Circle and Payouts |
| A7 | January shows Funmi and Emeka paying after the due date, and Ibrahim collecting 3 Feb |
| A8 | Demo payment updates Circle Health 86 → 90 → 96 and the Pot ₦200,000 → ₦250,000 → ₦300,000 with motion, and Reset restores today |
| A9 | Tab changes animate; chart months zoom into detail and back |
| A10 | Member and payout detail panels open, trap focus, close on Esc and return focus |
| A11 | `?demo=new` shows designed empty states on all five pages |
| A12 | Every amount uses ₦ with comma thousands |
| A13 | No red or green in the UI; saffron always paired with a word |
| A14 | Reduced motion removes movement and shows final values at once |
| A15 | Keyboard-only use reaches and operates every control with a visible focus ring |
| A16 | Each route has its own title, description and Open Graph metadata |
| A17 | Concept label and the no-advice, no-returns statement appear on every app page |
| A18 | Layout works at 1440, 768 and 375 wide with no horizontal page scroll |
