"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { dayMonth, naira, shortDate } from "@/lib/format";
import { memberById, memberStreak, memberTotals, monthlyContributions, paymentStatus } from "@/lib/selectors";
import { useReducedMotion } from "@/lib/motion";
import { MonthBars } from "../charts/MonthBars";
import { EmptyState } from "../EmptyState";
import { HealthLead } from "../HealthLead";
import { ZoomCard } from "../ZoomCard";
import { Disclaimer, PageHead } from "../ui";

export function ContributionsScreen() {
  const { profile, circle, cycle, profileKey } = useDemo();
  const reduced = useReducedMotion();
  const [zoom, setZoom] = useState<number | null>(null);
  const pills = useRef<(HTMLButtonElement | null)[]>([]);

  if (profileKey === "new" || !cycle) {
    return (
      <>
        <PageHead eyebrow={`Contributions · ${circle.name}`} title="No contributions yet." lede="Your history and streak build from the first payment." aside={<HealthLead />} />
        <EmptyState
          page="Contributions"
          title="Your first payment opens the record."
          body={`Your first ${naira(circle.contribution)} is due when the round starts. Each payment shows here with its date, and on-time payments build your streak.`}
          action={<Link className="btn btn-secondary" href="/app/payouts?demo=new">See how rounds work</Link>}
        />
        <Disclaimer />
      </>
    );
  }

  const viewer = profile.viewerId;
  const streak = memberStreak(circle, viewer);
  const totals = memberTotals(circle, viewer);
  const months = monthlyContributions(circle);
  const z = zoom !== null ? months[zoom] : null;
  const history = [...circle.cycles].reverse();

  const closeZoom = () => {
    const i = zoom;
    setZoom(null);
    requestAnimationFrame(() => (i !== null ? pills.current[i]?.focus() : undefined));
  };

  return (
    <>
      <PageHead
        eyebrow={`Contributions · ${circle.cycles[0].label} to ${circle.cycles[circle.cycles.length - 1].label}`}
        title={
          <>
            {streak === 9 ? "Nine" : streak} on time,
            <br />
            in a row.
          </>
        }
        lede="Your payments and the whole circle's, month by month."
        aside={<HealthLead />}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <section aria-labelledby="sk-h" className="card flex flex-col gap-3">
          <h2 id="sk-h" className="card-title">
            Your streak
          </h2>
          <p className="m-0 flex items-baseline gap-2.5">
            <span className="figure-xl">{streak}</span>
            <span className="text-base font-semibold text-teal-ink">on time in a row</span>
          </p>
          <div aria-hidden="true" className="flex flex-wrap gap-1.5">
            {Array.from({ length: streak }, (_, i) => (
              <span key={i} className="size-[18px] rounded-full bg-teal" />
            ))}
          </div>
          <p className="m-0 text-sm text-muted">Since June 2025, every payment by its due date.</p>
        </section>
        <section aria-labelledby="six-h" className="card flex flex-col gap-3">
          <h2 id="six-h" className="card-title">
            Paid in six months
          </h2>
          <p className="figure-lg m-0">{naira(totals.sixMonths)}</p>
          <p className="m-0 text-sm text-muted">
            {totals.sixMonthsCount} contributions of {naira(circle.contribution)}, {totals.onTimeCount === totals.sixMonthsCount ? "all on time" : `${totals.onTimeCount} on time`}.
          </p>
        </section>
        <section aria-labelledby="rd-h" className="card flex flex-col gap-3">
          <h2 id="rd-h" className="card-title">
            This round so far
          </h2>
          <p className="figure-lg m-0">
            {naira(totals.roundPaid)} <span className="text-base font-semibold tracking-normal text-muted">of {naira(totals.roundTarget)}</span>
          </p>
          <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-sunken">
            <div className="h-full bg-teal" style={{ width: `${(totals.roundPaid / totals.roundTarget) * 100}%` }} />
          </div>
          <p className="m-0 text-sm text-muted">
            {totals.roundPaidCount} of {totals.roundLength} months, November to April.
          </p>
        </section>
      </div>

      <section aria-labelledby="ch-h" className="card flex flex-col gap-5 p-6 md:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="ch-h" className="section-title">
            The circle, month by month
          </h2>
          <div className="flex flex-wrap gap-4 text-[13px] font-medium text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-3 rounded-[3px] bg-teal" />
              On time
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-3 rounded-[3px] bg-saffron" />
              After the due date
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-3 rounded-[3px] border-2 border-dashed border-stone-strong" />
              Still due
            </span>
          </div>
        </div>
        {z && zoom !== null ? (
          <ZoomCard index={zoom} columns={months.length} label={`${z.label} detail`} onClose={closeZoom}>
            <div data-zoom-item className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold tracking-[-0.02em] text-indigo">{z.label}</span>
              <span className="text-[15px] text-muted">
                Due {shortDate(z.cycle.due)} · {z.cycle.collected ? `${memberById(circle, z.cycle.collectorId).first} collected ${dayMonth(z.cycle.collected)}` : `${memberById(circle, z.cycle.collectorId).id === viewer ? "you collect" : memberById(circle, z.cycle.collectorId).first + " collects"} once the Pot is full`}
              </span>
            </div>
            <ul data-zoom-item className="m-0 list-none p-0">
              {circle.members.map((m) => {
                const st = paymentStatus(z.cycle, m.id);
                const d = z.cycle.payments[m.id];
                return (
                  <li key={m.id} className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-4 border-b border-stone-soft py-2.5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.1fr)_96px]">
                    <span className="text-base font-semibold">
                      {m.name}
                      {m.id === viewer ? " (you)" : ""}
                    </span>
                    <span className="text-[15px]">{d ? `Paid ${dayMonth(d)}` : "–"}</span>
                    <span className={`chip justify-self-end ${st === "on-time" ? "chip-paid" : "chip-due"}`}>{st === "on-time" ? "On time" : st === "after-due" ? "After the due date" : `Due ${shortDate(z.cycle.due)}`}</span>
                    <span className="num hidden text-right text-base font-bold text-indigo sm:block">{naira(circle.contribution)}</span>
                  </li>
                );
              })}
            </ul>
            {z.cycle.note ? (
              <p data-zoom-item className="m-0 text-[15px] leading-relaxed">
                {z.cycle.note}
              </p>
            ) : null}
          </ZoomCard>
        ) : (
          <MonthBars data={months} onPick={setZoom} reduced={reduced} />
        )}
        <div role="group" aria-label="Open a month" className="flex flex-wrap gap-2">
          {months.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => {
                pills.current[i] = el;
              }}
              type="button"
              className="pill"
              aria-pressed={zoom === i}
              onClick={() => (zoom === i ? closeZoom() : setZoom(i))}
            >
              {m.month}
              {m.afterDueCount ? ` · ${m.afterDueCount} after due date` : m.dueCount ? ` · ${m.dueCount} due` : ""}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="hist-h" className="card flex flex-col gap-2 p-6 md:p-7">
        <h2 id="hist-h" className="section-title mb-2">
          Your payment history
        </h2>
        <div className="overflow-x-auto">
          <table className="num w-full min-w-[640px] border-collapse text-[15px]">
            <thead>
              <tr className="text-left text-[13px] text-muted">
                <th className="pb-2.5 font-semibold">Month</th>
                <th className="pb-2.5 font-semibold">Due</th>
                <th className="pb-2.5 font-semibold">You paid</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 font-semibold">Collected by</th>
                <th className="pb-2.5 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((c) => {
                const d = c.payments[viewer];
                const st = paymentStatus(c, viewer);
                const who = memberById(circle, c.collectorId);
                return (
                  <tr key={c.id} className="border-t border-stone-soft">
                    <td className="py-3.5 font-semibold text-indigo">{c.label}</td>
                    <td className="py-3.5">{shortDate(c.due)}</td>
                    <td className="py-3.5">{d ? shortDate(d) : "–"}</td>
                    <td className="py-3.5">
                      <span className={`chip ${st === "on-time" ? "chip-paid" : "chip-due"}`}>{st === "on-time" ? "On time" : st === "after-due" ? "After the due date" : "Due"}</span>
                    </td>
                    <td className="py-3.5">
                      {who.id === viewer ? "You" : who.first} · {c.collected ? dayMonth(c.collected) : shortDate(c.due)}
                    </td>
                    <td className="py-3.5 text-right font-bold text-indigo">{naira(circle.contribution)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-col gap-1 rounded-md bg-sunken px-5 py-4">
          <span className="text-[15px] font-bold text-indigo">About January</span>
          <p className="m-0 text-[15px] leading-relaxed">{circle.cycles.find((c) => c.id === "2026-01")?.note}</p>
        </div>
      </section>
      <Disclaimer />
    </>
  );
}
