import type { ReactNode } from "react";
import { CoinMark } from "./ui";

/** Designed empty state: the coin-ring motif, a short title, one line and one action. */
export function EmptyState({ page, title, body, action }: { page: string; title: string; body: string; action: ReactNode }) {
  return (
    <section aria-label={`${page}: nothing here yet`} className="card flex flex-col items-start gap-4 p-8 md:p-10">
      <span className="eyebrow">{page}</span>
      <CoinMark />
      <h2 className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-indigo">{title}</h2>
      <p className="m-0 max-w-[48ch] text-[15px] leading-relaxed text-muted">{body}</p>
      {action}
    </section>
  );
}
