"use client";

import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { naira, ordinal, shortDate } from "@/lib/format";
import { goalCoverage, memberStreak, memberTotals, payoutTurns } from "@/lib/selectors";
import { EmptyState } from "../EmptyState";
import { HealthLead } from "../HealthLead";
import { Disclaimer, PageHead } from "../ui";

export function GoalScreen() {
  const { profile, circle, profileKey, announce } = useDemo();
  const goal = goalCoverage(profile);

  if (profileKey === "new" || !goal || !profile.goal) {
    return (
      <>
        <PageHead eyebrow="What you're saving for" title="No goal yet." lede="Name what you're saving for and Kolo shows how your payout covers it." aside={<HealthLead />} />
        <EmptyState
          page="Goal"
          title="Give your savings a name."
          body="A rent deposit, school fees, a wedding outfit. Kolo describes the numbers; it doesn't give advice."
          action={
            <button type="button" className="btn btn-primary" onClick={() => announce("Goal setup opens here in the full app. This is a demo.")}>
              Set a goal (demo)
            </button>
          }
        />
        <Disclaimer />
      </>
    );
  }

  const viewer = profile.viewerId;
  const mine = payoutTurns(circle).find((t) => t.member.id === viewer)!;
  const totals = memberTotals(circle, viewer);
  const afterTurn = circle.upcoming.length * circle.contribution;
  const later = circle.upcoming.map((u) => circle.members.find((m) => m.id === u.collectorId)!.first);

  return (
    <>
      <PageHead eyebrow="What you're saving for" title={profile.goal.title} lede={profile.goal.detail} aside={<HealthLead />} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section aria-labelledby="cov-h" className="card flex min-w-0 flex-col gap-5 p-6 md:p-8 lg:col-span-7">
          <h2 id="cov-h" className="section-title">
            How your payout covers it
          </h2>
          <p className="m-0 text-[clamp(48px,6vw,72px)] font-extrabold leading-none tracking-[-0.04em] text-indigo">
            {Math.round(goal.percent)}% <span className="text-lg font-semibold tracking-normal text-muted">covered</span>
          </p>
          <div role="img" aria-label={`Payout ${naira(goal.payout)} of ${naira(goal.target)}; ${naira(goal.remaining)} still to cover`} className="h-5 overflow-hidden rounded-full bg-sunken">
            <div className="h-full bg-teal" style={{ width: `${goal.percent}%` }} />
          </div>
          <div className="num flex justify-between text-[13px] text-muted">
            <span>{naira(0)}</span>
            <span>{naira(goal.payout)} · your payout</span>
            <span>{naira(goal.target)}</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-sm bg-ivory p-4">
              <span className="block text-[13px] text-muted">From your payout on {shortDate(mine.due)}</span>
              <b className="num text-[28px] text-indigo">{naira(goal.covered)}</b>
            </div>
            <div className="rounded-sm bg-ivory p-4">
              <span className="block text-[13px] text-muted">Still to cover</span>
              <b className="num text-[28px] text-indigo">{naira(goal.remaining)}</b>
            </div>
          </div>
          <p className="m-0 text-sm text-muted">Kolo shows what your circle collects. It doesn&rsquo;t add interest or returns, and it doesn&rsquo;t give financial advice.</p>
        </section>

        <section aria-labelledby="path-h" className="card flex min-w-0 flex-col gap-5 p-6 md:p-8 lg:col-span-5">
          <h2 id="path-h" className="section-title">
            How you get there
          </h2>
          <ol className="m-0 flex list-none flex-col gap-4 p-0">
            <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-teal-ink text-sm font-extrabold text-ivory">1</span>
              <span className="flex flex-col gap-0.5">
                <b className="text-indigo">You put in {naira(circle.contribution)} a month</b>
                <span className="num text-sm text-muted">
                  {totals.roundPaidCount} paid this round, {naira(totals.roundPaid)} so far. {memberStreak(circle, viewer)} on time in a row.
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-indigo text-sm font-extrabold text-ivory">2</span>
              <span className="flex flex-col gap-0.5">
                <b className="text-indigo">
                  You collect {naira(goal.payout)} on {shortDate(mine.due)}
                </b>
                <span className="text-sm text-muted">{ordinal(mine.turn)} in the payout order, once the Pot is full.</span>
              </span>
            </li>
            <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3.5">
              <span className="flex size-8 items-center justify-center rounded-full border-2 border-stone-strong text-sm font-extrabold text-muted">3</span>
              <span className="flex flex-col gap-0.5">
                <b className="text-indigo">You keep paying in March and April</b>
                <span className="num text-sm text-muted">
                  {naira(afterTurn)} more, so {later.join(" and ")} get their turns.
                </span>
              </span>
            </li>
          </ol>
          <Link href="/app/payouts" className="text-[15px] font-bold text-indigo">
            See the payout schedule
          </Link>
        </section>
      </div>
      <Disclaimer />
    </>
  );
}
