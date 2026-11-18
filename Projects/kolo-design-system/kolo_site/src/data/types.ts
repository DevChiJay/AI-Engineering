export type MemberId = string;
export type ISODate = string; // YYYY-MM-DD

export interface Member {
  id: MemberId;
  name: string;
  first: string;
  initials: string;
  /** Position in the current round's payout order; null before the round starts. */
  turn: number | null;
  /** On-time contributions in a row before the first month in this dataset. */
  priorOnTime: number;
}

export interface Cycle {
  id: string;
  label: string;
  short: string;
  due: ISODate;
  round: number;
  collectorId: MemberId;
  /** Date the collector received the Pot; null while the cycle is open. */
  collected: ISODate | null;
  note?: string;
  /** Paid date per member; null means not paid yet. */
  payments: Record<MemberId, ISODate | null>;
}

export interface UpcomingCycle {
  id: string;
  label: string;
  short: string;
  due: ISODate;
  round: number;
  collectorId: MemberId;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  contribution: number;
  frequency: "monthly";
  status: "active" | "inviting";
  round: number;
  roundLabel: string;
  members: Member[];
  cycles: Cycle[];
  upcoming: UpcomingCycle[];
}

export interface Goal {
  title: string;
  target: number;
  detail: string;
}

export interface Profile {
  label: string;
  viewerId: MemberId;
  circle: Circle;
  goal: Goal | null;
}

export interface Dataset {
  meta: { version: number; today: ISODate; currency: "NGN"; note: string };
  profiles: Record<"adaeze" | "new", Profile>;
}

export type ProfileKey = keyof Dataset["profiles"];
