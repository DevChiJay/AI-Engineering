import { getProfile } from "@/lib/selectors";
import { avatarAt } from "./geometry";

/** Friday Circle members in payout order (Tunde at the top, then clockwise). Same data as the app. */
export const MEMBERS = getProfile("adaeze").circle.members;

/** Six avatars around a ring centred at (cx, cy). `tone` sets colours for light or dark chapters. */
export function Avatars({ cx, cy, r, tone, names = false, className = "" }: { cx: number; cy: number; r: number; tone: "light" | "dark"; names?: boolean; className?: string }) {
  return (
    <div className={`d-abs ${className}`} style={{ inset: 0 }} data-avatars>
      {MEMBERS.map((m, k) => {
        const [x, y] = avatarAt(k, r, cx, cy);
        const you = m.id === "an";
        const bg = you ? (tone === "dark" ? "#fbf7f0" : "#1e1b4b") : tone === "dark" ? "#1e1b4b" : "#fffdf8";
        const ink = you ? (tone === "dark" ? "#1e1b4b" : "#fbf7f0") : tone === "dark" ? "#fbf7f0" : "#1e1b4b";
        return (
          <div key={m.id}>
            <div className="d-avatar" data-k={k} style={{ left: x, top: y, background: bg, color: ink, border: "5px solid #b8b2a7" }}>
              {m.initials}
            </div>
            {names ? (
              <span className="d-name" data-name={k} style={{ left: x, top: y + 58, color: tone === "dark" ? "#c9c4dc" : "#6b655c" }}>
                {you ? "Adaeze (you)" : m.first}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** The "kolo" wordmark (monoline, the o's as coin rings), with paths ready for DrawSVG. */
export function Wordmark({ width, color }: { width: number; color: string }) {
  return (
    <svg viewBox="0 0 204 84" width={width} height={(width * 84) / 204} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path data-draw d="M13 8 V76" />
        <path data-draw d="M42 36 L14 59" />
        <path data-draw d="M26 49 L44 76" />
        <circle data-draw cx="80" cy="54" r="22" />
        <circle data-draw cx="80" cy="54" r="12" />
        <path data-draw d="M124 8 V76" />
        <circle data-draw cx="168" cy="54" r="22" />
        <circle data-draw cx="168" cy="54" r="12" />
      </g>
    </svg>
  );
}
