/** Stage geometry for the motion story. The stage is 1920 × 1080 design units. */
export const W = 1920;
export const H = 1080;
export const CX = 960;
export const CY = 540;

/** The light ring: 24 segments, mid-radius 200, 28 wide. Pot body radius 360 (same ratio as the app's Pot). */
export const SEG_COUNT = 24;
export const SEG_R0 = 186;
export const SEG_R1 = 214;
export const POT_R = 360;
/** Coin ring (the Kolo mark): outer and inner circles at rest. */
export const COIN_OUTER = 110;
export const COIN_INNER = 60;
export const COIN_STROKE = 23;

const rad = (deg: number) => (deg * Math.PI) / 180;
export function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [cx + r * Math.sin(rad(deg)), cy - r * Math.cos(rad(deg))];
}

const f = (n: number) => n.toFixed(2);

/** Filled annular sector (one light segment), degrees clockwise from the top. */
export function sectorPath(a0: number, a1: number, cx = CX, cy = CY, r0 = SEG_R0, r1 = SEG_R1): string {
  const [x0, y0] = pt(cx, cy, r1, a0);
  const [x1, y1] = pt(cx, cy, r1, a1);
  const [x2, y2] = pt(cx, cy, r0, a1);
  const [x3, y3] = pt(cx, cy, r0, a0);
  return `M${f(x0)} ${f(y0)} A${r1} ${r1} 0 0 1 ${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} A${r0} ${r0} 0 0 0 ${f(x3)} ${f(y3)} Z`;
}

export const SEG_PATHS = Array.from({ length: SEG_COUNT }, (_, j) => sectorPath(j * 15 + 1.6, j * 15 + 13.4));

/** Segment index → member (0–5, payout order, member 0 at the top). Four segments per member, centred on the avatar. */
export function segMember(j: number): number {
  return Math.floor(((j + 2) % SEG_COUNT) / 4);
}
/** The four segments of member k, in clockwise order. */
export function memberSegs(k: number): number[] {
  return [k * 4 - 2, k * 4 - 1, k * 4, k * 4 + 1].map((x) => (x + SEG_COUNT) % SEG_COUNT);
}

/** Avatar position for member k around a ring of radius r. */
export function avatarAt(k: number, r: number, cx = CX, cy = CY): [number, number] {
  const [x, y] = pt(cx, cy, r, k * 60);
  // Whole pixels, so server and client render identical inline styles.
  return [Math.round(x), Math.round(y)];
}

/** Bar-chart blocks for the January scene: 6 months × 6 blocks, bottom up. */
export const CHART = { x0: 600, colW: 96, gap: 44, base: 860, blockH: 44, blockGap: 8 };
export function blockRect(month: number, row: number) {
  const x = CHART.x0 + month * (CHART.colW + CHART.gap);
  const y = CHART.base - (row + 1) * CHART.blockH - row * CHART.blockGap;
  return { x, y, w: CHART.colW, h: CHART.blockH };
}
export function rectPath(month: number, row: number): string {
  const { x, y, w, h } = blockRect(month, row);
  return `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
}
