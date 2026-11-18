import raw from "@/data/kolo-demo.json";
import type { Circle, Cycle, Dataset, ISODate, Member, MemberId, Profile, ProfileKey } from "@/data/types";
import { addDays, daysBetween } from "./format";

export const dataset = raw as Dataset;
export const TODAY: ISODate = dataset.meta.today;
export const SEGMENTS = 24;

export function getProfile(key: ProfileKey): Profile {
  return dataset.profiles[key];
}

/** Apply demo payments (made "today") to the open cycle without mutating the dataset. */
export function withDemoPayments(circle: Circle, paidIds: MemberId[], today: ISODate = TODAY): Circle {
  if (!paidIds.length) return circle;
  return {
    ...circle,
    cycles: circle.cycles.map((c) =>
      c.collected !== null
        ? c
        : { ...c, payments: Object.fromEntries(Object.entries(c.payments).map(([id, d]) => [id, d ?? (paidIds.includes(id) ? today : null)])) },
    ),
  };
}

export function memberById(circle: Circle, id: MemberId): Member {
  const m = circle.members.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown member ${id}`);
  return m;
}

/** The open cycle, or the latest one when everything is collected. */
export function currentCycle(circle: Circle): Cycle | null {
  if (!circle.cycles.length) return null;
  return circle.cycles.find((c) => c.collected === null) ?? circle.cycles[circle.cycles.length - 1];
}

const paidBy = (date: ISODate | null, asOf: ISODate) => date !== null && date <= asOf;
const onTime = (date: ISODate | null, due: ISODate) => date !== null && date <= due;

export function paidCount(circle: Circle, cycle: Cycle, asOf: ISODate = TODAY): number {
  return circle.members.filter((m) => paidBy(cycle.payments[m.id] ?? null, asOf)).length;
}

/** Paid contributions in the last six cycles that arrived by their due date. */
export function onTimeStats(circle: Circle, asOf: ISODate = TODAY) {
  const window = circle.cycles.filter((c) => c.due <= addDays(asOf, 31)).slice(-6);
  let paid = 0;
  let timely = 0;
  for (const c of window) {
    for (const m of circle.members) {
      const d = c.payments[m.id] ?? null;
      if (!paidBy(d, asOf)) continue;
      paid += 1;
      if (onTime(d, c.due)) timely += 1;
    }
  }
  return { paid, onTime: timely, rate: paid ? (timely / paid) * 100 : 100 };
}

export interface HealthBreakdown {
  score: number;
  onTimeRate: number;
  onTimePaid: number;
  onTimeCount: number;
  paid: number;
  members: number;
  daysToPayout: number;
  readiness: number;
  band: "Healthy" | "Needs a nudge";
}

/** Circle Health, demo formula from the spec: 0.65 on-time + 0.25 paid % + 0.10 readiness. */
export function circleHealth(circle: Circle, cycle: Cycle, asOf: ISODate = TODAY): HealthBreakdown {
  const stats = onTimeStats(circle, asOf);
  const paid = paidCount(circle, cycle, asOf);
  const members = circle.members.length;
  const daysToPayout = Math.max(0, daysBetween(asOf, cycle.due));
  const readiness = paid === members ? 100 : Math.min(100, daysToPayout * 20);
  const score = Math.round(0.65 * stats.rate + 0.25 * ((paid / members) * 100) + 0.1 * readiness);
  return {
    score,
    onTimeRate: stats.rate,
    onTimePaid: stats.paid,
    onTimeCount: stats.onTime,
    paid,
    members,
    daysToPayout,
    readiness,
    band: score >= 60 ? "Healthy" : "Needs a nudge",
  };
}

/** One snapshot per month, four days before each due date. */
export function healthHistory(circle: Circle) {
  return circle.cycles.map((c) => {
    const asOf = c.collected === null ? TODAY : addDays(c.due, -4);
    return { cycle: c, asOf, ...circleHealth(circle, c, asOf) };
  });
}

export function potCollected(circle: Circle, cycle: Cycle, asOf: ISODate = TODAY): number {
  return paidCount(circle, cycle, asOf) * circle.contribution;
}

export function potTarget(circle: Circle): number {
  return circle.contribution * circle.members.length;
}

export type PaymentStatus = "on-time" | "after-due" | "due" | "not-due";

export function paymentStatus(cycle: Cycle, memberId: MemberId, asOf: ISODate = TODAY): PaymentStatus {
  const d = cycle.payments[memberId] ?? null;
  if (d !== null && d <= asOf) return d <= cycle.due ? "on-time" : "after-due";
  return asOf <= cycle.due ? "due" : "not-due";
}

/** On-time payments in a row, newest first. An open, not-yet-due payment doesn't break it. */
export function memberStreak(circle: Circle, memberId: MemberId, asOf: ISODate = TODAY): number {
  let streak = 0;
  for (const c of [...circle.cycles].reverse()) {
    const status = paymentStatus(c, memberId, asOf);
    if (status === "due") continue;
    if (status === "on-time") streak += 1;
    else return streak;
  }
  return streak + memberById(circle, memberId).priorOnTime;
}

export function memberTotals(circle: Circle, memberId: MemberId, asOf: ISODate = TODAY) {
  const paidCycles = circle.cycles.filter((c) => paidBy(c.payments[memberId] ?? null, asOf));
  const round = circle.cycles.filter((c) => c.round === circle.round);
  const roundPaid = round.filter((c) => paidBy(c.payments[memberId] ?? null, asOf)).length;
  const roundLength = round.length + circle.upcoming.filter((u) => u.round === circle.round).length;
  return {
    sixMonths: paidCycles.length * circle.contribution,
    sixMonthsCount: paidCycles.length,
    onTimeCount: paidCycles.filter((c) => onTime(c.payments[memberId] ?? null, c.due)).length,
    roundPaid: roundPaid * circle.contribution,
    roundPaidCount: roundPaid,
    roundTarget: roundLength * circle.contribution,
    roundLength,
  };
}

export type TurnStatus = "collected" | "next" | "upcoming";

export interface Turn {
  turn: number;
  member: Member;
  due: ISODate;
  collected: ISODate | null;
  status: TurnStatus;
  cycle: Cycle | null;
  moved: boolean;
}

/** The current round's payout schedule, in order. */
export function payoutTurns(circle: Circle): Turn[] {
  const roundCycles = circle.cycles.filter((c) => c.round === circle.round);
  const all = [
    ...roundCycles.map((c) => ({ id: c.id, due: c.due, collectorId: c.collectorId, collected: c.collected, cycle: c as Cycle | null })),
    ...circle.upcoming.filter((u) => u.round === circle.round).map((u) => ({ id: u.id, due: u.due, collectorId: u.collectorId, collected: null, cycle: null })),
  ];
  let nextFound = false;
  return all.map((t, i) => {
    let status: TurnStatus = "upcoming";
    if (t.collected) status = "collected";
    else if (!nextFound) {
      status = "next";
      nextFound = true;
    }
    return {
      turn: i + 1,
      member: memberById(circle, t.collectorId),
      due: t.due,
      collected: t.collected,
      status,
      cycle: t.cycle,
      moved: Boolean(t.collected && t.collected !== t.due),
    };
  });
}

/** Per-month contributions for the chart: naira on time, after the due date, and still due. */
export function monthlyContributions(circle: Circle, asOf: ISODate = TODAY) {
  return circle.cycles.map((c) => {
    const statuses = circle.members.map((m) => paymentStatus(c, m.id, asOf));
    const count = (s: PaymentStatus) => statuses.filter((x) => x === s).length;
    return {
      id: c.id,
      month: c.short,
      label: c.label,
      onTime: count("on-time") * circle.contribution,
      afterDue: count("after-due") * circle.contribution,
      due: (count("due") + count("not-due")) * circle.contribution,
      onTimeCount: count("on-time"),
      afterDueCount: count("after-due"),
      dueCount: count("due") + count("not-due"),
      cycle: c,
    };
  });
}

export function goalCoverage(profile: Profile) {
  if (!profile.goal) return null;
  const payout = potTarget(profile.circle);
  const covered = Math.min(payout, profile.goal.target);
  return {
    payout,
    target: profile.goal.target,
    covered,
    remaining: Math.max(0, profile.goal.target - payout),
    percent: (covered / profile.goal.target) * 100,
  };
}

export function suggestedAction(circle: Circle, cycle: Cycle | null, asOf: ISODate = TODAY) {
  if (!cycle) return { text: "Invite your circle to get started.", unpaid: [] as Member[] };
  const unpaid = circle.members.filter((m) => !paidBy(cycle.payments[m.id] ?? null, asOf));
  const words = ["No", "One member", "Two members", "Three members", "Four members", "Five members", "Six members"];
  if (!unpaid.length) return { text: "Everyone has paid. The Pot is full.", unpaid };
  return {
    text: `${words[unpaid.length]} still to pay. Send a friendly reminder.`,
    unpaid,
  };
}

export function nudgeLine(health: HealthBreakdown, cycle: Cycle): string {
  const day = health.daysToPayout <= 6 ? "Friday" : "soon";
  return `Circle Health ${health.score}. Payout is ${day}.`;
}

/** Light-ring segments: 4 per member for a six-member circle, in payout order, clockwise from the top. */
export function ringSegments(circle: Circle, cycle: Cycle, asOf: ISODate = TODAY): ("paid" | "due")[] {
  const per = Math.floor(SEGMENTS / circle.members.length);
  return Array.from({ length: SEGMENTS }, (_, j) => {
    const k = Math.min(circle.members.length - 1, Math.floor(((j + per / 2) % SEGMENTS) / per));
    const m = circle.members[k];
    return paidBy(cycle.payments[m.id] ?? null, asOf) ? "paid" : "due";
  });
}
