"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MonthlyStudents } from "@/data/teacher-dashboard-data";

export function StudentGrowthChart({ data }: { data: MonthlyStudents[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="4 8"
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          width={40}
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
          formatter={(value) => [`${Number(value).toLocaleString()} طالب`, "الطلاب"]}
        />
        <Area
          type="monotone"
          dataKey="students"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#studentsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
