"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { dayMonth, daysBetween, longDate, naira, ordinal, shortDate } from "@/lib/format";
import { paymentStatus, payoutTurns, potCollected, potTarget, TODAY, type Turn } from "@/lib/selectors";
import { AnimatedNumber } from "../AnimatedNumber";
import { DetailPanel } from "../DetailPanel";
import { EmptyState } from "../EmptyState";
import { HealthLead } from "../HealthLead";
import { Disclaimer, PageHead } from "../ui";

function coinStyle(t: Turn, viewer: string): React.CSSProperties {
  if (t.status === "collected") return { background: "#0b6e70", color: "#fbf7f0", border: "2px solid #0b6e70", boxShadow: "inset 0 0 0 5px #0b6e70, inset 0 0 0 7px #0f8b8d" };
  if (t.member.id === viewer) return { background: "#1e1b4b", color: "#fbf7f0", border: "2px solid #1e1b4b", boxShadow: "0 0 0 4px #fffdf8, 0 0 0 6px #1e1b4b" };
  return { background: "#fffdf8", color: "#6b655c", border: "2px solid #8f887c", boxShadow: "inset 0 0 0 5px #fffdf8, inset 0 0 0 7px #e8e1d4" };
}

export function PayoutsScreen() {
  const { profile, circle, cycle, health, profileKey } = useDemo();
  const [open, setOpen] = useState<number | null>(null);

  if (profileKey === "new" || !cycle || !health) {
    return (
      <>
        <PageHead eyebrow={`Payouts · ${circle.name}`} title="No payout order yet." lede={circle.roundLabel} aside={<HealthLead />} />
        <EmptyState
          page="Payouts"
          title="The payout order is set when the round starts."
          body="Once everyone has joined, you agree the order together. Each member then collects the full Pot once, on a fixed day."
          action={<Link className="btn btn-secondary" href="/app/circle?demo=new">Invite members first</Link>}
        />
        <Disclaimer />
      </>
    );
  }

  const viewer = profile.viewerId;
  const turns = payoutTurns(circle);
  const done = turns.filter((t) => t.status === "collected").length;
  const mine = turns.find((t) => t.member.id === viewer)!;
  const collected = potCollected(circle, cycle);
  const target = potTarget(circle);
  const sel = turns.find((t) => t.turn === open) ?? null;
  const progress = ((done - 0.5) / (turns.length - 1)) * 100;

  const statusText = (t: Turn) =>
    t.status === "collected" ? `Collected ${dayMonth(t.collected!)}` : t.member.id === viewer ? `Your turn · in ${daysBetween(TODAY, t.due)} days` : t.status === "next" ? "Next" : "Upcoming";

  return (
    <>
      <PageHead
        eyebrow={`Payouts · Round ${circle.round}, November to April`}
        title={
          <>
            Your turn
            <br />
            is Friday.
          </>
        }
        lede={`Six turns of ${naira(target)}. ${done === 3 ? "Three" : done} collected, yours next.`}
        aside={<HealthLead />}
      />

      <section aria-labelledby="ord-h" className="card flex flex-col gap-6 p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="ord-h" className="section-title">
            Payout order
          </h2>
          <span className="text-[13px] font-medium text-muted">Choose a turn for detail</span>
        </div>
        <div className="overflow-x-auto">
          <ol className="relative m-0 grid min-w-[640px] list-none grid-cols-6 gap-3 p-0 pt-2">
            <li aria-hidden="true" className="absolute left-[8%] right-[8%] top-[39px] border-t-2 border-dotted border-stone" />
            <li aria-hidden="true" className="absolute left-[8%] top-[38px] h-1 rounded bg-teal-ink" style={{ width: `${Math.max(0, progress) * 0.84}%` }} />
            {turns.map((t) => (
              <li key={t.turn} className="relative">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setOpen(t.turn)}
                  aria-label={`Turn ${t.turn}, ${t.member.name}${t.member.id === viewer ? " (you)" : ""}, ${t.status === "collected" ? `collected ${longDate(t.collected!)}` : shortDate(t.due)}`}
                  className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border-0 bg-transparent pb-2"
                >
                  <span className="flex size-16 items-center justify-center rounded-full text-lg font-extrabold" style={coinStyle(t, viewer)}>
                    {t.turn}
                  </span>
                  <span className={`text-base ${t.member.id === viewer ? "font-extrabold text-indigo" : "font-semibold"}`}>{t.member.id === viewer ? "You" : t.member.first}</span>
                  <span className={`num text-[13px] font-medium ${t.status === "collected" ? "text-teal-ink" : t.member.id === viewer ? "text-indigo" : "text-muted"}`}>
                    {t.status === "collected" ? `Collected ${dayMonth(t.collected!)}` : shortDate(t.due)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section aria-labelledby="ev-h" className="card flex min-w-0 flex-col lg:col-span-8">
          <h2 id="ev-h" className="section-title mb-3">
            Every turn
          </h2>
          <ul className="m-0 list-none p-0">
            {turns.map((t) => (
              <li key={t.turn}>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setOpen(t.turn)}
                  className={`row-button grid-cols-[32px_minmax(0,1fr)_auto] sm:grid-cols-[32px_minmax(0,1.6fr)_minmax(0,1fr)_auto_96px] ${t.member.id === viewer ? "bg-sunken" : ""}`}
                >
                  <span className="text-base font-extrabold text-indigo">{t.turn}</span>
                  <span className={`text-base ${t.member.id === viewer ? "font-bold" : "font-semibold"}`}>
                    {t.member.name}
                    {t.member.id === viewer ? " (you)" : ""}
                  </span>
                  <span className="hidden text-[15px] sm:block">{shortDate(t.due)}</span>
                  <span className={`chip ${t.status === "collected" ? "chip-paid" : t.member.id === viewer ? "chip-you" : "chip-neutral"}`}>{statusText(t)}</span>
                  <span className="num hidden text-right text-base font-bold text-indigo sm:block">{naira(target)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="yt-h" className="card flex min-w-0 flex-col gap-3.5 lg:col-span-4">
          <h2 id="yt-h" className="card-title">
            Your turn
          </h2>
          <p className="figure-lg m-0">{naira(target)}</p>
          <p className="m-0 text-[15px] text-muted">
            {shortDate(mine.due)} · {ordinal(mine.turn)} of {turns.length} · in {daysBetween(TODAY, mine.due)} days
          </p>
          <div className="flex justify-between gap-3 text-[15px]">
            <span>Pot so far</span>
            <span className="num font-bold text-indigo">
              <AnimatedNumber value={collected} format={naira} step={1000} /> <span className="font-medium text-muted">of {naira(target)}</span>
            </span>
          </div>
          <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-sunken">
            <div className="h-full bg-teal transition-[width] duration-700" style={{ width: `${(collected / target) * 100}%` }} />
          </div>
          {target - collected > 0 ? (
            <p className="num m-0 text-sm font-semibold text-saffron-ink">
              {naira(target - collected)} still to come in from {health.members - health.paid} {health.members - health.paid === 1 ? "member" : "members"}
            </p>
          ) : (
            <p className="m-0 text-sm font-semibold text-teal-ink">The Pot is full.</p>
          )}
          <p className="m-0 text-sm leading-normal text-muted">
            You collect once the Pot is full. After your turn you keep putting in {naira(circle.contribution)} a month until Emeka collects in April.
          </p>
          <Link className="btn btn-primary" href="/app/circle">
            See who still has to pay
          </Link>
        </section>
      </div>
      <Disclaimer />

      <DetailPanel
        open={sel !== null}
        onClose={() => setOpen(null)}
        eyebrow={sel ? `Turn ${sel.turn} of ${turns.length}` : undefined}
        title={sel ? `${sel.member.name}${sel.member.id === viewer ? " (you)" : ""}` : ""}
        media={
          sel ? (
            <span className="flex size-16 items-center justify-center rounded-full text-xl font-extrabold" style={coinStyle(sel, viewer)}>
              {sel.turn}
            </span>
          ) : null
        }
      >
        {sel ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-sm bg-ivory p-3">
                <span className="block text-[13px] text-muted">Scheduled</span>
                <b className="text-indigo">{shortDate(sel.due)}</b>
              </div>
              <div className="rounded-sm bg-ivory p-3">
                <span className="block text-[13px] text-muted">Collected</span>
                <b className="text-indigo">{sel.collected ? shortDate(sel.collected) : sel.status === "next" ? "Once the Pot is full" : "Upcoming"}</b>
              </div>
              <div className="col-span-2 rounded-sm bg-ivory p-3">
                <span className="block text-[13px] text-muted">Amount</span>
                <b className="num text-2xl text-indigo">{naira(target)}</b>
              </div>
            </div>
            {sel.moved && sel.cycle ? (
              <p className="m-0 rounded-md bg-sunken p-4 text-[15px] leading-relaxed">
                Collected {daysBetween(sel.due, sel.collected!)} days after the scheduled Friday.{" "}
                {circle.members
                  .filter((m) => paymentStatus(sel.cycle!, m.id) === "after-due")
                  .map((m) => `${m.first} paid ${dayMonth(sel.cycle!.payments[m.id]!)}`)
                  .join(" and ")}
                , after the {dayMonth(sel.due)} due date, and {sel.member.first} collected once the Pot was full.
              </p>
            ) : null}
            <div className="flex flex-col">
              <h3 className="m-0 mb-1 text-[15px] font-bold text-indigo">Paid into this Pot</h3>
              <ul className="m-0 list-none p-0">
                {circle.members.map((m) => {
                  if (!sel.cycle) {
                    return (
                      <li key={m.id} className="flex items-center justify-between gap-3 border-b border-stone-soft py-2">
                        <span className="text-[15px]">{m.first}</span>
                        <span className="chip chip-neutral">Opens in {sel.due.slice(5, 7) === "03" ? "March" : "April"}</span>
                      </li>
                    );
                  }
                  const st = paymentStatus(sel.cycle, m.id);
                  const d = sel.cycle.payments[m.id];
                  return (
                    <li key={m.id} className="flex items-center justify-between gap-3 border-b border-stone-soft py-2">
                      <span className="text-[15px]">
                        {m.first}
                        {m.id === viewer ? " (you)" : ""}
                      </span>
                      <span className={`chip ${st === "on-time" ? "chip-paid" : "chip-due"}`}>
                        {st === "on-time" ? `Paid ${dayMonth(d!)}` : st === "after-due" ? `Paid ${dayMonth(d!)}, after the due date` : `Due ${shortDate(sel.cycle.due)}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : null}
      </DetailPanel>
    </>
  );
}
