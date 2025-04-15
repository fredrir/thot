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

interface GradeDistributionProps {
  grades: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  };
}

export function GradeDistribution({ grades }: GradeDistributionProps) {
  const data = [
    { grade: "A", count: grades.A, fill: "#22c55e" },
    { grade: "B", count: grades.B, fill: "#84cc16" },
    { grade: "C", count: grades.C, fill: "#eab308" },
    { grade: "D", count: grades.D, fill: "#f97316" },
    { grade: "E", count: grades.E, fill: "#ef4444" },
    { grade: "F", count: grades.F, fill: "#7f1d1d" },
  ];

  const total = Object.values(grades).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        {data.map((item) => (
          <div key={item.grade} className="text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-none border-2 border-black font-bold text-white"
              style={{ backgroundColor: item.fill }}
            >
              {item.grade}
            </div>
            <div className="mt-1 font-bold">{item.count}</div>
            <div className="text-xs">
              {Math.round((item.count / total) * 100)}%
            </div>
          </div>
        ))}
      </div>

      <div className="h-64 border-4 border-black p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="grade" />
            <YAxis />
            <Tooltip
              contentStyle={{
                borderRadius: 0,
                border: "4px solid black",
                fontWeight: "bold",
              }}
            />
            <Bar dataKey="count" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
