"use client";

import Link from "next/link";
import { useState } from "react";
import type { MemberId } from "@/data/types";
import { useDemo } from "@/lib/demo-context";
import { dayMonth, naira, ordinal, shortDate } from "@/lib/format";
import { memberStreak, paymentStatus, payoutTurns, potCollected, potTarget, suggestedAction } from "@/lib/selectors";
import { DetailPanel } from "../DetailPanel";
import { EmptyState } from "../EmptyState";
import { HealthLead } from "../HealthLead";
import { AnimatedNumber } from "../AnimatedNumber";
import { Avatar, Disclaimer, PageHead } from "../ui";

export function CircleScreen() {
  const { profile, circle, cycle, health, pay, profileKey, announce } = useDemo();
  const [open, setOpen] = useState<MemberId | null>(null);
  const [reminded, setReminded] = useState(false);

  if (profileKey === "new" || !cycle || !health) {
    return (
      <>
        <PageHead eyebrow={`${circle.name} · ${circle.roundLabel}`} title="No members yet." lede={`It's just you in the ${circle.name}. Add five more to start saving together.`} aside={<HealthLead />} />
        <EmptyState
          page="Circle"
          title="Invite your circle."
          body={`Share the invite link with five friends or coworkers. Each puts in ${naira(circle.contribution)} a month once the round starts.`}
          action={
            <button type="button" className="btn btn-primary" onClick={() => announce("Invite link ready. This is a demo, so nothing was copied.")}>
              Copy invite link (demo)
            </button>
          }
        />
        <Disclaimer />
      </>
    );
  }

  const turns = payoutTurns(circle);
  const action = suggestedAction(circle, cycle);
  const collected = potCollected(circle, cycle);
  const paidN = health.paid;
  const dueN = health.members - health.paid;

  const rows = circle.members.map((m) => {
    const status = paymentStatus(cycle, m.id);
    const paid = status === "on-time" || status === "after-due";
    const turn = turns.find((t) => t.member.id === m.id)!;
    const turnText =
      turn.status === "collected" ? `collected ${dayMonth(turn.collected!)}` : turn.status === "next" ? `collects ${shortDate(turn.due)}` : `collects ${shortDate(turn.due)}`;
    return { m, paid, turn, turnText, paidOn: cycle.payments[m.id] ?? null, streak: memberStreak(circle, m.id) };
  });
  const sel = rows.find((r) => r.m.id === open) ?? null;

  return (
    <>
      <PageHead
        eyebrow={`Circle · ${cycle.label} cycle`}
        title={circle.name}
        lede={
          <>
            {circle.description} · {naira(circle.contribution)} each a month · due {shortDate(cycle.due)}
            <span className="mt-4 flex gap-2">
              <span className="chip chip-dot chip-paid">{paidN} paid</span>
              {dueN ? <span className="chip chip-dot chip-due">{dueN} due Fri</span> : null}
            </span>
          </>
        }
        aside={<HealthLead />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section aria-labelledby="mem-h" className="card flex min-w-0 flex-col lg:col-span-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3">
            <h2 id="mem-h" className="section-title">
              Members, in payout order
            </h2>
            <span className="text-[13px] font-medium text-muted">Choose a member for detail</span>
          </div>
          <ul className="m-0 list-none p-0">
            {rows.map(({ m, paid, turn, turnText, paidOn }) => (
              <li key={m.id}>
                <button type="button" aria-haspopup="dialog" onClick={() => setOpen(m.id)} className="row-button grid-cols-[44px_minmax(0,1fr)_auto] sm:grid-cols-[44px_minmax(0,1fr)_auto_96px]">
                  <Avatar initials={m.initials} state={paid ? "paid" : "due"} you={m.id === profile.viewerId} />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-base font-semibold">
                      {m.name}
                      {m.id === profile.viewerId ? " (you)" : ""}
                    </span>
                    <span className="text-[13px] font-medium text-muted">
                      {ordinal(turn.turn)} in payout order · {turnText}
                    </span>
                  </span>
                  <span className={`chip chip-dot ${paid ? "chip-paid" : "chip-due"}`}>{paid ? `Paid ${dayMonth(paidOn!)}` : `Due ${shortDate(cycle.due)}`}</span>
                  <span className={`num hidden text-right text-base font-bold sm:block ${paid ? "text-teal-ink" : "text-saffron-ink"}`}>{naira(circle.contribution)}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
            <span className="text-base font-bold text-indigo">The Pot</span>
            <span className="num text-base font-extrabold text-indigo">
              <AnimatedNumber value={collected} format={naira} step={1000} /> <span className="font-medium text-muted">of {naira(potTarget(circle))}</span>
            </span>
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-6 lg:col-span-4">
          <section aria-label="Suggested action" className="flex flex-col gap-3 rounded-lg bg-sunken p-6">
            <span className="text-[13px] font-semibold text-muted">Suggested action</span>
            <p className="m-0 text-xl font-bold leading-snug text-indigo">{action.text}</p>
            {action.unpaid.length ? (
              <>
                <p className="m-0 text-[15px] leading-normal text-muted">
                  {action.unpaid.map((m) => m.first).join(" and ")} get a short note that the Pot closes Friday.
                </p>
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={() => {
                    setReminded(true);
                    announce("Reminder ready. This is a demo, so nothing was sent.");
                  }}
                >
                  Send reminder
                </button>
                {reminded ? (
                  <p role="status" className="m-0 text-sm font-semibold text-teal-ink">
                    Reminder ready. Demo only: nothing was sent.
                  </p>
                ) : null}
              </>
            ) : null}
          </section>
          <section aria-labelledby="how-h" className="card flex flex-col gap-2.5">
            <h2 id="how-h" className="card-title">
              How the circle works
            </h2>
            <p className="m-0 text-[15px] leading-relaxed">
              Each month all six members put in {naira(circle.contribution)}. The full Pot of {naira(potTarget(circle))} goes to one member, in payout order, until everyone has had a turn.
            </p>
            <Link href="/app/payouts" className="text-[15px] font-bold text-indigo">
              See the payout order
            </Link>
          </section>
        </div>
      </div>
      <Disclaimer />

      <DetailPanel
        open={sel !== null}
        onClose={() => setOpen(null)}
        eyebrow={sel ? `${ordinal(sel.turn.turn)} in the payout order` : undefined}
        title={sel ? `${sel.m.name}${sel.m.id === profile.viewerId ? " (you)" : ""}` : ""}
        media={sel ? <Avatar initials={sel.m.initials} state={sel.paid ? "paid" : "due"} you={sel.m.id === profile.viewerId} size={64} /> : null}
      >
        {sel ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-sm bg-ivory p-3">
                <span className="block text-[13px] text-muted">This cycle</span>
                <b className={sel.paid ? "text-teal-ink" : "text-saffron-ink"}>{sel.paid ? `Paid ${dayMonth(sel.paidOn!)}` : `Due ${shortDate(cycle.due)}`}</b>
              </div>
              <div className="rounded-sm bg-ivory p-3">
                <span className="block text-[13px] text-muted">Payout turn</span>
                <b className="text-indigo">{sel.turnText.replace(/^./, (c) => c.toUpperCase())}</b>
              </div>
              <div className="col-span-2 rounded-sm bg-ivory p-3">
                <span className="block text-[13px] text-muted">Streak</span>
                <b className="text-indigo">{sel.streak > 0 ? `${sel.streak} on time in a row` : "Starts again with the next payment"}</b>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="m-0 mb-1 text-[15px] font-bold text-indigo">Six months</h3>
              <ul className="m-0 list-none p-0">
                {circle.cycles.map((c) => {
                  const st = paymentStatus(c, sel.m.id);
                  const d = c.payments[sel.m.id];
                  const text = st === "due" ? `Due ${shortDate(c.due)}` : st === "after-due" ? `Paid ${dayMonth(d!)}, after the ${dayMonth(c.due)} due date` : `Paid ${dayMonth(d!)}, on time`;
                  return (
                    <li key={c.id} className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b border-stone-soft py-2">
                      <span className="text-sm font-bold text-indigo">{c.short}</span>
                      <span className="text-sm">{text}</span>
                      <span
                        aria-hidden="true"
                        className="size-3.5 rounded-full"
                        style={
                          st === "on-time"
                            ? { background: "#0f8b8d" }
                            : st === "after-due"
                              ? { background: "#f2a93b" }
                              : { border: "2px dashed #8f887c" }
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            {!sel.paid ? (
              <div className="flex flex-col gap-2.5 rounded-md bg-sunken p-4">
                <p className="m-0 text-[15px] leading-normal">
                  {sel.m.first}&rsquo;s {naira(circle.contribution)} is due {shortDate(cycle.due)}. Kolo sends a friendly reminder, never a warning.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => pay(sel.m.id)}>
                  Mark {sel.m.first} paid (demo)
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </DetailPanel>
    </>
  );
}
