"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { daysBetween, naira, ordinal, shortDate } from "@/lib/format";
import { goalCoverage, healthHistory, memberStreak, payoutTurns, potCollected, potTarget, suggestedAction, TODAY } from "@/lib/selectors";
import { useReducedMotion } from "@/lib/motion";
import { AnimatedNumber } from "../AnimatedNumber";
import { HealthLead } from "../HealthLead";
import { PotRing } from "../PotRing";
import { ZoomCard } from "../ZoomCard";
import { HealthTrend } from "../charts/HealthTrend";
import { EmptyState } from "../EmptyState";
import { Disclaimer, PageHead, StatTile } from "../ui";

const MONTH_NOTES: Record<string, string> = {
  "2025-09": "Emeka collected on 26 Sep, closing out Round 1's September turn.",
  "2025-10": "Five of six had paid four days out. Funmi collected on 31 Oct.",
  "2025-11": "Round 2 began. Tunde collected first, on 28 Nov.",
  "2025-12": "Christmas week: half the circle paid in the last four days, still before the due date. Chioma collected on 26 Dec.",
  "2026-01": "Payments came in slowly after the holidays. Funmi and Emeka paid after the 30 Jan due date, so Ibrahim collected on 3 Feb.",
  "2026-02": "January's two payments after the due date bring the on-time rate to 94%. Funmi and Emeka are due Fri 27 Feb.",
};

export function OverviewScreen() {
  const demo = useDemo();
  const { profile, circle, cycle, health, unpaid, pay, reset, profileKey, demoPaid, announce } = demo;
  const reduced = useReducedMotion();
  const [zoom, setZoom] = useState<number | null>(null);
  const pills = useRef<(HTMLButtonElement | null)[]>([]);
  const [reminded, setReminded] = useState(false);

  if (profileKey === "new" || !cycle || !health) {
    return (
      <>
        <PageHead eyebrow={`${circle.name} · just created`} title="Your circle starts when everyone's in." lede="Circle Health, the Pot and your payout turn appear after the first contributions." aside={<HealthLead />} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <EmptyState
              page="Overview"
              title="The Pot fills once the round starts."
              body={`It's just you in the ${circle.name} so far. Invite five more members at ${naira(circle.contribution)} a month to begin.`}
              action={<Link className="btn btn-primary" href="/app/circle?demo=new">Invite members</Link>}
            />
          </div>
          <div className="lg:col-span-5">
            <EmptyState page="Goal" title="No goal yet." body="Name what you're saving for and Kolo shows how your payout covers it." action={<Link className="btn btn-secondary" href="/app/goal?demo=new">Set a goal</Link>} />
          </div>
        </div>
        <Disclaimer />
      </>
    );
  }

  const viewer = profile.viewerId;
  const turns = payoutTurns(circle);
  const mine = turns.find((t) => t.member.id === viewer)!;
  const collected = potCollected(circle, cycle);
  const history = healthHistory(circle);
  const points = history.map((h) => ({ month: h.cycle.short, label: h.cycle.label, score: h.score }));
  const goal = goalCoverage(profile)!;
  const action = suggestedAction(circle, cycle);
  const nextToPay = unpaid[0] ? circle.members.find((m) => m.id === unpaid[0]) : null;
  const zoomed = zoom !== null ? history[zoom] : null;

  const closeZoom = () => {
    const i = zoom;
    setZoom(null);
    requestAnimationFrame(() => (i !== null ? pills.current[i]?.focus() : undefined));
  };

  return (
    <>
      <PageHead
        eyebrow={`${shortDate(TODAY)} · ${cycle.label} cycle`}
        title={
          <>
            Good morning,
            <br />
            Adaeze.
          </>
        }
        lede="Four days to payout, and it's your turn. Here is how the Friday Circle is doing."
        aside={<HealthLead />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section aria-labelledby="pot-h" className="on-indigo grid min-w-0 grid-cols-1 items-center gap-6 rounded-xl bg-indigo p-6 text-ivory sm:grid-cols-2 md:p-8 lg:col-span-7">
          <PotRing circle={circle} cycle={cycle} />
          <div className="flex min-w-0 flex-col gap-3.5">
            <span className="eyebrow text-indigo-soft">The Pot · {cycle.label}</span>
            <h2 id="pot-h" className="num m-0 text-[44px] font-extrabold leading-none tracking-[-0.03em]">
              <AnimatedNumber value={collected} format={naira} step={1000} />
            </h2>
            <p className="num m-0 text-[15px] text-indigo-soft">
              of {naira(potTarget(circle))} · {health.paid} of {health.members} paid
            </p>
            <p className="m-0 text-[15px] leading-normal text-indigo-soft">Each member owns four of the 24 light segments. Teal is paid; saffron is still due.</p>
            <div className="flex flex-wrap gap-2">
              {nextToPay ? (
                <button type="button" className="btn btn-on-indigo" onClick={() => pay(nextToPay.id)}>
                  Mark {nextToPay.first} paid (demo)
                </button>
              ) : null}
              {demoPaid.length ? (
                <button type="button" className="btn btn-ghost-indigo" onClick={reset}>
                  Reset
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
          <section aria-label="Suggested action" className="flex flex-col gap-3 rounded-lg bg-sunken p-6">
            <span className="text-[13px] font-semibold text-muted">Suggested action</span>
            <p className="m-0 text-xl font-bold leading-snug text-indigo">{action.text}</p>
            <div className="flex flex-wrap gap-2">
              <Link className="btn btn-secondary" href="/app/circle">
                See who
              </Link>
              {action.unpaid.length ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setReminded(true);
                    announce("Reminder ready. This is a demo, so nothing was sent.");
                  }}
                >
                  Send reminder
                </button>
              ) : null}
            </div>
            {reminded && action.unpaid.length ? (
              <p role="status" className="m-0 text-sm font-semibold text-teal-ink">
                Reminder ready for {action.unpaid.map((m) => m.first).join(" and ")}. Demo only: nothing was sent.
              </p>
            ) : null}
          </section>

          <section aria-labelledby="np-h" className="card flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="np-h" className="card-title">
                Next payout
              </h2>
              <Link href="/app/payouts" className="text-[15px] font-bold text-indigo">
                Full schedule
              </Link>
            </div>
            <span className="text-[15px] font-semibold text-teal-ink">Your turn</span>
            <p className="figure-lg m-0">
              {naira(potTarget(circle))} <span className="text-[17px] font-semibold tracking-normal text-muted">on {shortDate(mine.due)}</span>
            </p>
            <p className="m-0 text-[15px] text-muted">
              {ordinal(mine.turn)} of {turns.length} in the payout order · in {daysBetween(TODAY, mine.due)} days
            </p>
            <div aria-hidden="true" className="flex items-center gap-2">
              {turns.map((t) => (
                <span
                  key={t.turn}
                  className="rounded-full"
                  style={
                    t.status === "collected"
                      ? { width: 28, height: 28, background: "#0b6e70" }
                      : t.status === "next"
                        ? { width: 34, height: 34, background: "#1e1b4b", boxShadow: "0 0 0 3px #fffdf8, 0 0 0 5px #1e1b4b" }
                        : { width: 28, height: 28, border: "2px solid #8f887c" }
                  }
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section aria-labelledby="trend-h" className="card flex min-w-0 flex-col gap-4 p-6 md:p-7 lg:col-span-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="trend-h" className="section-title">
              Circle Health, six months
            </h2>
            <span className="text-[13px] font-medium text-muted">Taken four days before each due date</span>
          </div>
          {zoomed && zoom !== null ? (
            <ZoomCard index={zoom} columns={points.length} label={`${zoomed.cycle.label} detail`} onClose={closeZoom}>
              <div data-zoom-item className="flex flex-wrap items-baseline gap-3">
                <span className="figure-xl">{zoomed.score}</span>
                <span className="text-lg font-bold text-indigo">{zoomed.cycle.label}</span>
                <span className={`chip chip-dot ${zoomed.score >= 60 ? "chip-paid" : "chip-due"}`}>{zoomed.band}</span>
              </div>
              <div data-zoom-item className="grid grid-cols-3 gap-2">
                <StatTile tone="card" value={`${Math.round(zoomed.onTimeRate)}%`} label="On-time rate" />
                <StatTile tone="card" value={`${zoomed.paid} of ${zoomed.members}`} label="Paid that day" />
                <StatTile tone="card" value={zoomed.daysToPayout} label="Days to payout" />
              </div>
              <p data-zoom-item className="m-0 text-[15px] leading-relaxed">
                {MONTH_NOTES[zoomed.cycle.id]}
              </p>
            </ZoomCard>
          ) : (
            <HealthTrend data={points} onPick={setZoom} reduced={reduced} />
          )}
          <div role="group" aria-label="Open a month" className="flex flex-wrap gap-2">
            {points.map((p, i) => (
              <button
                key={p.month}
                ref={(el) => {
                  pills.current[i] = el;
                }}
                type="button"
                className="pill num"
                aria-pressed={zoom === i}
                onClick={() => (zoom === i ? closeZoom() : setZoom(i))}
              >
                {p.month} · {p.score}
              </button>
            ))}
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-6 lg:col-span-4">
          <section aria-labelledby="st-h" className="card flex flex-col gap-2">
            <h2 id="st-h" className="card-title">
              Your streak
            </h2>
            <p className="m-0 flex items-baseline gap-2.5">
              <span className="figure-xl">{memberStreak(circle, viewer)}</span>
              <span className="text-base font-semibold text-teal-ink">on time in a row</span>
            </p>
            <Link href="/app/contributions" className="text-[15px] font-bold text-indigo">
              See history
            </Link>
          </section>
          <section aria-labelledby="gl-h" className="card flex flex-col gap-2.5">
            <h2 id="gl-h" className="card-title">
              {profile.goal!.title}
            </h2>
            <p className="figure-lg m-0">
              {Math.round(goal.percent)}% <span className="text-base font-semibold tracking-normal text-muted">covered</span>
            </p>
            <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-sunken">
              <div className="h-full bg-teal" style={{ width: `${goal.percent}%` }} />
            </div>
            <p className="num m-0 text-sm text-muted">
              {naira(goal.payout)} payout of {naira(goal.target)}
            </p>
            <Link href="/app/goal" className="text-[15px] font-bold text-indigo">
              See goal
            </Link>
          </section>
        </div>
      </div>
      <Disclaimer />
    </>
  );
}
