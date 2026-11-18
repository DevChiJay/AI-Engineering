"use client";

import { CartesianGrid, LabelList, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { K } from "@/lib/tokens";

export interface HealthPoint {
  month: string;
  label: string;
  score: number;
}

/** Circle Health over six months. A point opens that month's detail. */
export function HealthTrend({ data, onPick, reduced }: { data: HealthPoint[]; onPick: (i: number) => void; reduced: boolean }) {
  const last = data.length - 1;
  return (
    <div role="img" aria-label={`Circle Health by month: ${data.map((d) => `${d.label} ${d.score}`).join(", ")}.`} className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 28, right: 24, left: 24, bottom: 0 }} accessibilityLayer={false}>
          <CartesianGrid vertical={false} stroke={K.stoneSoft} />
          <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: K.stoneSoft }} tick={{ fill: K.indigo, fontSize: 14, fontWeight: 700 }} padding={{ left: 16, right: 16 }} />
          <YAxis domain={[60, 100]} ticks={[60, 80, 100]} tickLine={false} axisLine={false} width={28} tick={{ fill: K.muted, fontSize: 12 }} />
          <ReferenceLine y={60} stroke={K.stone} strokeDasharray="4 6" />
          <Line
            type="monotone"
            dataKey="score"
            stroke={K.teal}
            strokeWidth={3}
            isAnimationActive={!reduced}
            animationDuration={700}
            dot={(props: { cx?: number; cy?: number; index?: number }) => (
              <circle
                key={props.index}
                cx={props.cx}
                cy={props.cy}
                r={props.index === last ? 8 : 6}
                fill={props.index === last ? K.teal : K.card}
                stroke={K.teal}
                strokeWidth={3}
                style={{ cursor: "pointer" }}
                onClick={() => onPick(props.index ?? 0)}
              />
            )}
            activeDot={false}
          >
            <LabelList dataKey="score" position="top" offset={14} style={{ fill: K.indigo, fontSize: 14, fontWeight: 800 }} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
