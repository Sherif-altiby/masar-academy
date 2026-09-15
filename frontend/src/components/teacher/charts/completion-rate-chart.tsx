"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CourseCompletion } from "@/data/teacher-dashboard-data";

// Color ramp: columns scale from a soft accent to a deeper, saturated tone
// based on completion rate, so high performers visually pop.
const COLOR_STOPS = [
  "#a5b4fc", // low completion — soft indigo
  "#818cf8",
  "#6366f1",
  "#4f46e5", // high completion — deep indigo
];

function getBarColor(rate: number) {
  if (rate >= 90) return COLOR_STOPS[3];
  if (rate >= 70) return COLOR_STOPS[2];
  if (rate >= 40) return COLOR_STOPS[1];
  return COLOR_STOPS[0];
}

export function CompletionRateChart({ data }: { data: CourseCompletion[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 24, right: 10, left: 0, bottom: 10 }}
        barCategoryGap={24}
      >
        <defs>
          {data.map((entry, index) => {
            const color = getBarColor(entry.completionRate);
            return (
              <linearGradient
                key={`gradient-${index}`}
                id={`barGradient-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.55} />
              </linearGradient>
            );
          })}
        </defs>

        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="3 6"
          strokeOpacity={0.6}
        />

        <XAxis
          type="category"
          dataKey="courseTitle"
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
        />

        <YAxis
          type="number"
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          width={40}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          tickFormatter={(v) => `${v}٪`}
        />

        <Tooltip
          cursor={{ fill: "var(--secondary)", opacity: 0.4, radius: 6 }}
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            fontSize: 13,
            padding: "8px 12px",
            direction: "rtl",
          }}
          labelStyle={{
            color: "var(--popover-foreground)",
            fontWeight: 600,
            marginBottom: 4,
          }}
          formatter={(value) => [`${value}٪`, "نسبة الإكمال"]}
        />

        <Bar
          dataKey="completionRate"
          radius={[8, 8, 0, 0]}
          maxBarSize={48}
          animationDuration={700}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
          ))}
          <LabelList
            dataKey="completionRate"
            position="top"
            formatter={(value) => (value == null ? "" : `${value}٪`)}
            style={{
              fill: "var(--foreground)",
              fontSize: 12,
              fontWeight: 600,
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}