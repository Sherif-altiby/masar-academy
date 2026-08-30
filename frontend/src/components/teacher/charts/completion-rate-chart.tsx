"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CourseCompletion } from "@/data/teacher-dashboard-data";

export function CompletionRateChart({ data }: { data: CourseCompletion[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid
          horizontal={false}
          stroke="var(--border)"
          strokeDasharray="4 8"
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="courseTitle"
          tickLine={false}
          axisLine={false}
          width={110}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "var(--secondary)" }}
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            direction: "rtl",
          }}
          labelStyle={{ color: "var(--popover-foreground)", fontWeight: 600 }}
          formatter={(value) => [`${value}٪`, "نسبة الإكمال"]}
        />
        <Bar dataKey="completionRate" fill="var(--accent)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
