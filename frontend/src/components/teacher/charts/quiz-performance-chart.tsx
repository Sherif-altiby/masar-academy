"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { QuizPerformance } from "@/data/teacher-dashboard-data";

export function QuizPerformanceChart({ data }: { data: QuizPerformance[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="4 8"
        />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          width={36}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            direction: "rtl",
          }}
          labelStyle={{ color: "var(--popover-foreground)", fontWeight: 600 }}
          formatter={(value) => [`${value}٪`, "متوسط الدرجات"]}
        />
        <Line
          type="monotone"
          dataKey="averageScore"
          stroke="var(--accent)"
          strokeWidth={2.5}
          dot={{ fill: "var(--accent)", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
