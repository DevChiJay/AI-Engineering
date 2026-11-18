import { CREDIT } from "@/lib/seo";
import type { ReactNode } from "react";

export type AvatarState = "paid" | "due" | "none";

/** Member avatar: status shown as a ring (teal solid = paid, saffron dashed = due). */
export function Avatar({
  initials,
  state = "none",
  you = false,
  size = 44,
  onIndigo = false,
  className = "",
}: {
  initials: string;
  state?: AvatarState;
  you?: boolean;
  size?: number;
  onIndigo?: boolean;
  className?: string;
}) {
  const ring = state === "paid" ? "3px solid var(--color-teal)" : state === "due" ? "3px dashed var(--color-saffron)" : "3px solid transparent";
  const bg = you ? (onIndigo ? "var(--color-ivory)" : "var(--color-indigo)") : onIndigo ? "var(--color-indigo)" : "var(--color-card)";
  const ink = you ? (onIndigo ? "var(--color-indigo)" : "var(--color-ivory)") : onIndigo ? "var(--color-ivory)" : state === "due" ? "var(--color-saffron-ink)" : "var(--color-indigo)";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${className}`}
      style={{
        width: size,
        height: size,
        border: ring,
        background: bg,
        color: ink,
        fontSize: size > 52 ? 20 : 13,
        transition: "border-color .35s, border-style .35s, color .35s",
      }}
    >
      {initials}
    </span>
  );
}

export function StatTile({ value, label, tone = "ivory" }: { value: ReactNode; label: string; tone?: "ivory" | "card" }) {
  return (
    <div className={`flex flex-col gap-0.5 rounded-sm p-3 ${tone === "ivory" ? "bg-ivory" : "bg-card"}`}>
      <span className="num text-xl font-extrabold text-indigo">{value}</span>
      <span className="text-[13px] font-medium text-muted">{label}</span>
    </div>
  );
}

/** The coin-ring motif, used in empty states. */
export function CoinMark({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <circle cx="32" cy="32" r="26" fill="none" stroke="#b8b2a7" strokeWidth="4" strokeDasharray="6 7" strokeLinecap="round" />
      <circle cx="32" cy="32" r="13" fill="none" stroke="#1e1b4b" strokeWidth="4" />
    </svg>
  );
}

export function Wordmark({ color = "#1e1b4b", width = 88 }: { color?: string; width?: number }) {
  return (
    <svg viewBox="0 0 204 84" width={width} height={(width * 84) / 204} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 8 V76" />
        <path d="M42 36 L14 59" />
        <path d="M26 49 L44 76" />
        <circle cx="80" cy="54" r="22" />
        <circle cx="80" cy="54" r="12" />
        <path d="M124 8 V76" />
        <circle cx="168" cy="54" r="22" />
        <circle cx="168" cy="54" r="12" />
      </g>
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Disclaimer() {
  return (
    <footer className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-stone-soft pt-6 text-[13px] leading-normal">
      <p className="m-0 max-w-[80ch] text-muted">Demo data. Kolo shows what your circle has paid and collected. It gives no financial advice, promises no returns and adds no interest.</p>
      <p className="m-0 font-semibold text-indigo">
        Designed and built by{" "}
        <a href={CREDIT.url} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-teal-ink">
          {CREDIT.name}
        </a>
      </p>
    </footer>
  );
}

/** Editorial page head: eyebrow, display title and lede on the left, Circle Health on the right. */
export function PageHead({ eyebrow, title, lede, aside }: { eyebrow: string; title: ReactNode; lede?: ReactNode; aside: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12" data-reveal>
      <div className="flex min-w-0 flex-col gap-4 lg:col-span-7">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display m-0">{title}</h1>
        {lede ? <p className="m-0 max-w-[46ch] text-lg leading-relaxed">{lede}</p> : null}
      </div>
      <div className="min-w-0 lg:col-span-5">{aside}</div>
    </div>
  );
}
