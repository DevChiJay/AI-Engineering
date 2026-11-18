import { describe, expect, it } from "vitest";
import { naira, shortDate } from "@/lib/format";
import {
  circleHealth,
  currentCycle,
  getProfile,
  goalCoverage,
  healthHistory,
  memberStreak,
  memberTotals,
  monthlyContributions,
  paymentStatus,
  payoutTurns,
  potCollected,
  potTarget,
  suggestedAction,
  withDemoPayments,
} from "@/lib/selectors";

const profile = getProfile("adaeze");
const circle = profile.circle;
const cycle = currentCycle(circle)!;

describe("spec §4 · today's numbers (A4, A5)", () => {
  it("Circle Health is 86 from 94% on time, 4 of 6 paid, 4 days to payout", () => {
    const h = circleHealth(circle, cycle);
    expect(h.score).toBe(86);
    expect(Math.round(h.onTimeRate)).toBe(94);
    expect(h.onTimeCount).toBe(32);
    expect(h.onTimePaid).toBe(34);
    expect(h.paid).toBe(4);
    expect(h.daysToPayout).toBe(4);
    expect(h.band).toBe("Healthy");
  });

  it("the Pot holds ₦200,000 of ₦300,000", () => {
    expect(naira(potCollected(circle, cycle))).toBe("₦200,000");
    expect(naira(potTarget(circle))).toBe("₦300,000");
  });

  it("Adaeze collects 4th on Fri 27 Feb, streak 9, goal 75%", () => {
    const next = payoutTurns(circle).find((t) => t.status === "next")!;
    expect(next.member.id).toBe("an");
    expect(next.turn).toBe(4);
    expect(shortDate(next.due)).toBe("Fri 27 Feb");
    expect(memberStreak(circle, "an")).toBe(9);
    expect(Math.round(goalCoverage(profile)!.percent)).toBe(75);
    expect(naira(goalCoverage(profile)!.remaining)).toBe("₦100,000");
  });

  it("suggested action names two members", () => {
    expect(suggestedAction(circle, cycle).text).toBe("Two members still to pay. Send a friendly reminder.");
  });
});

describe("spec §4 · six months and January (A6, A7)", () => {
  it("covers September to February", () => {
    expect(circle.cycles.map((c) => c.short)).toEqual(["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]);
  });

  it("January: Funmi and Emeka paid after the due date; Ibrahim collected 3 Feb", () => {
    const jan = circle.cycles.find((c) => c.id === "2026-01")!;
    expect(paymentStatus(jan, "fa")).toBe("after-due");
    expect(paymentStatus(jan, "eo")).toBe("after-due");
    expect(circle.members.filter((m) => paymentStatus(jan, m.id) === "after-due")).toHaveLength(2);
    const ibrahim = payoutTurns(circle).find((t) => t.member.id === "im")!;
    expect(ibrahim.collected).toBe("2026-02-03");
    expect(ibrahim.moved).toBe(true);
  });

  it("Adaeze paid ₦300,000 over six months and ₦200,000 this round", () => {
    const t = memberTotals(circle, "an");
    expect(naira(t.sixMonths)).toBe("₦300,000");
    expect(naira(t.roundPaid)).toBe("₦200,000");
    expect(naira(t.roundTarget)).toBe("₦300,000");
  });

  it("monthly history matches: Jan ₦200,000 after the due date", () => {
    const jan = monthlyContributions(circle).find((m) => m.id === "2026-01")!;
    expect(jan.onTime).toBe(200000);
    expect(jan.afterDue).toBe(100000);
  });

  it("Circle Health history is Sep 90, Oct 94, Nov 90, Dec 86, Jan 81, Feb 86", () => {
    expect(healthHistory(circle).map((h) => h.score)).toEqual([90, 94, 90, 86, 81, 86]);
  });
});

describe("spec §4 · demo payments (A8)", () => {
  it("Funmi pays → 90 and ₦250,000; Emeka too → 96 and ₦300,000", () => {
    const one = withDemoPayments(circle, ["fa"]);
    const c1 = currentCycle(one)!;
    expect(circleHealth(one, c1).score).toBe(90);
    expect(naira(potCollected(one, c1))).toBe("₦250,000");
    const two = withDemoPayments(circle, ["fa", "eo"]);
    const c2 = currentCycle(two)!;
    expect(circleHealth(two, c2).score).toBe(96);
    expect(naira(potCollected(two, c2))).toBe("₦300,000");
  });

  it("does not mutate the dataset", () => {
    withDemoPayments(circle, ["fa"]);
    expect(cycle.payments.fa).toBeNull();
  });
});

describe("empty profile (A11)", () => {
  it("has no cycles, no goal and one member", () => {
    const p = getProfile("new");
    expect(p.circle.cycles).toHaveLength(0);
    expect(p.goal).toBeNull();
    expect(currentCycle(p.circle)).toBeNull();
  });
});

describe("naira() (A12)", () => {
  it("formats with ₦ and commas, no decimals", () => {
    expect(naira(50000)).toBe("₦50,000");
    expect(naira(300000)).toBe("₦300,000");
    expect(naira(0)).toBe("₦0");
  });
});
