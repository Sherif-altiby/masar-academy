"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ContentMixSlice } from "@/data/teacher-dashboard-data";

export function ContentMixChart({ data }: { data: ContentMixSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((slice) => (
            <Cell key={slice.label} fill={slice.colorVar} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            direction: "rtl",
          }}
          labelStyle={{ color: "var(--popover-foreground)", fontWeight: 600 }}
          formatter={(value) => [`${value} درس`, ""]}
        />
        <Legend
          layout="vertical"
          align="left"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
