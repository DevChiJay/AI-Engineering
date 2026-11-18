"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { naira } from "@/lib/format";
import { K } from "@/lib/tokens";

export interface MonthBar {
  month: string;
  label: string;
  onTime: number;
  afterDue: number;
  due: number;
}

/** The circle's contributions per month, stacked: on time, after the due date, still due. */
export function MonthBars({ data, onPick, reduced }: { data: MonthBar[]; onPick: (i: number) => void; reduced: boolean }) {
  const summary = data
    .map((d) => `${d.label}: ${naira(d.onTime)} on time${d.afterDue ? `, ${naira(d.afterDue)} after the due date` : ""}${d.due ? `, ${naira(d.due)} still due` : ""}`)
    .join(". ");
  return (
    <div role="img" aria-label={`Contributions by month. ${summary}.`} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 28, right: 8, left: 8, bottom: 0 }} barCategoryGap="22%" accessibilityLayer={false}>
          <CartesianGrid vertical={false} stroke={K.stoneSoft} />
          <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: K.stoneSoft }} tick={{ fill: K.indigo, fontSize: 14, fontWeight: 700 }} />
          <YAxis hide domain={[0, 300000]} />
          <Bar dataKey="onTime" stackId="m" fill={K.teal} isAnimationActive={!reduced} animationDuration={600} cursor="pointer" onClick={(_, i) => onPick(i)} />
          <Bar dataKey="afterDue" stackId="m" fill={K.saffron} isAnimationActive={!reduced} animationDuration={600} cursor="pointer" onClick={(_, i) => onPick(i)} />
          <Bar
            dataKey="due"
            stackId="m"
            fill={K.card}
            stroke={K.stoneStrong}
            strokeDasharray="5 4"
            strokeWidth={2}
            radius={[8, 8, 0, 0]}
            isAnimationActive={!reduced}
            animationDuration={600}
            cursor="pointer"
            onClick={(_, i) => onPick(i)}
          >
            <LabelList
              position="top"
              valueAccessor={(entry: { payload?: MonthBar }) => (entry.payload ? naira(entry.payload.onTime + entry.payload.afterDue) : "")}
              style={{ fill: K.indigo, fontSize: 13, fontWeight: 800 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
