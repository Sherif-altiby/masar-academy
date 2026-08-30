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

interface CourseEnrollmentDatum {
  title: string;
  studentCount: number;
}

export function CourseEnrollmentChart({ courses }: { courses: CourseEnrollmentDatum[] }) {
  const data = courses.map((course) => ({
    name: course.title.length > 14 ? `${course.title.slice(0, 14)}…` : course.title,
    students: course.studentCount,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="4 8"
        />
        <XAxis
          dataKey="name"
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
          cursor={{ fill: "var(--secondary)" }}
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
        <Bar dataKey="students" fill="var(--primary)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
