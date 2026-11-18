"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { Circle, Cycle, MemberId, Profile, ProfileKey } from "@/data/types";
import { naira } from "./format";
import { circleHealth, currentCycle, getProfile, potCollected, withDemoPayments, type HealthBreakdown } from "./selectors";

interface DemoState {
  paid: MemberId[];
  message: string;
}

type Action = { type: "pay"; id: MemberId } | { type: "reset" } | { type: "announce"; message: string };

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "pay":
      return state.paid.includes(action.id) ? state : { ...state, paid: [...state.paid, action.id] };
    case "reset":
      return { paid: [], message: "Demo reset to today: 4 of 6 paid." };
    case "announce":
      return { ...state, message: action.message };
  }
}

export interface DemoValue {
  profileKey: ProfileKey;
  profile: Profile;
  circle: Circle;
  cycle: Cycle | null;
  health: HealthBreakdown | null;
  demoPaid: MemberId[];
  message: string;
  /** Members still to pay this cycle, in payout order. */
  unpaid: MemberId[];
  pay: (id: MemberId) => void;
  reset: () => void;
  announce: (message: string) => void;
  /** Adds ?demo=new to a link when the empty profile is active. */
  href: (path: string) => string;
}

const DemoContext = createContext<DemoValue | null>(null);

/** Reads ?demo= from the URL. Rendered only in the browser; the static HTML uses DemoProvider's default profile. */
export function DemoFromSearch({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  return <DemoProvider profileKey={params.get("demo") === "new" ? "new" : "adaeze"}>{children}</DemoProvider>;
}

export function DemoProvider({ profileKey = "adaeze", children }: { profileKey?: ProfileKey; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { paid: [], message: "" });

  const value = useMemo<DemoValue>(() => {
    const profile = getProfile(profileKey);
    const circle = profileKey === "adaeze" ? withDemoPayments(profile.circle, state.paid) : profile.circle;
    const cycle = currentCycle(circle);
    const health = cycle ? circleHealth(circle, cycle) : null;
    const unpaid = cycle ? circle.members.filter((m) => cycle.payments[m.id] == null).map((m) => m.id) : [];
    return {
      profileKey,
      profile,
      circle,
      cycle,
      health,
      demoPaid: state.paid,
      message: state.message,
      unpaid,
      pay: () => undefined,
      reset: () => undefined,
      announce: () => undefined,
      href: (path: string) => (profileKey === "new" ? `${path}?demo=new` : path),
    };
  }, [profileKey, state.paid, state.message]);

  const pay = useCallback(
    (id: MemberId) => {
      if (profileKey !== "adaeze") return;
      const profile = getProfile("adaeze");
      const next = withDemoPayments(profile.circle, [...state.paid, id]);
      const cycle = currentCycle(next)!;
      const h = circleHealth(next, cycle);
      const member = profile.circle.members.find((m) => m.id === id)!;
      dispatch({ type: "pay", id });
      dispatch({
        type: "announce",
        message: `${member.first} paid ${naira(profile.circle.contribution)}. The Pot holds ${naira(potCollected(next, cycle))} and Circle Health is ${h.score}.`,
      });
    },
    [profileKey, state.paid],
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const announce = useCallback((message: string) => dispatch({ type: "announce", message }), []);

  const full = useMemo(() => ({ ...value, pay, reset, announce }), [value, pay, reset, announce]);
  return <DemoContext.Provider value={full}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
