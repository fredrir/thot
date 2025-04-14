"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GradeTimelineChartProps {
  grades: Array<{
    id: string;
    year: number;
    semester: number;
    gradeA?: number | null;
    gradeB?: number | null;
    gradeC?: number | null;
    gradeD?: number | null;
    gradeE?: number | null;
    gradeF?: number | null;
    gradePass?: number | null;
    gradeFail?: number | null;
    participantsTotal: number;
  }>;
}

export function GradeTimelineChart({ grades }: GradeTimelineChartProps) {
  const sortedGrades = useMemo(() => {
    return [...grades].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.semester - b.semester;
    });
  }, [grades]);

  const hasLetterGrades = useMemo(() => {
    return grades.some(
      (g) => g.gradeA !== null || g.gradeB !== null || g.gradeC !== null,
    );
  }, [grades]);

  const passRateData = useMemo(() => {
    return sortedGrades.map((grade) => {
      let passRate = 0;

      if (hasLetterGrades) {
        const passing =
          (grade.gradeA || 0) +
          (grade.gradeB || 0) +
          (grade.gradeC || 0) +
          (grade.gradeD || 0) +
          (grade.gradeE || 0);
        passRate = Math.round((passing / grade.participantsTotal) * 100);
      } else {
        const passing = grade.gradePass || 0;
        passRate = Math.round((passing / grade.participantsTotal) * 100);
      }

      return {
        semester: `${grade.year}-${grade.semester}`,
        label: `${grade.year} ${grade.semester === 1 ? "S" : "F"}`,
        passRate,
        participants: grade.participantsTotal,
      };
    });
  }, [sortedGrades, hasLetterGrades]);

  const gradeDistributionData = useMemo(() => {
    if (!hasLetterGrades) return [];

    return sortedGrades.map((grade) => {
      const total = grade.participantsTotal;

      return {
        semester: `${grade.year}-${grade.semester}`,
        label: `${grade.year} ${grade.semester === 1 ? "S" : "F"}`,
        A: Math.round(((grade.gradeA || 0) / total) * 100),
        B: Math.round(((grade.gradeB || 0) / total) * 100),
        C: Math.round(((grade.gradeC || 0) / total) * 100),
        D: Math.round(((grade.gradeD || 0) / total) * 100),
        E: Math.round(((grade.gradeE || 0) / total) * 100),
        F: Math.round(((grade.gradeF || 0) / total) * 100),
      };
    });
  }, [sortedGrades, hasLetterGrades]);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Grade Trends Over Time</CardTitle>
        <CardDescription>
          Historical grade distribution and pass rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution">
          <TabsList className="mb-4">
            <TabsTrigger value="passRate">Pass Rate</TabsTrigger>
            {hasLetterGrades && (
              <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
            )}
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>

          <TabsContent value="passRate" className="h-[300px]">
            <ChartContainer
              config={{
                passRate: {
                  label: "Pass Rate (%)",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={passRateData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--grid-color)"
                  />
                  <XAxis
                    dataKey="label"
                    stroke="var(--axis-color)"
                    tick={{ fill: "var(--text-color)" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="var(--axis-color)"
                    tick={{ fill: "var(--text-color)" }}
                  />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: "var(--cursor-color)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="passRate"
                    stroke="var(--pass-rate-color)"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "var(--pass-rate-color)",
                      stroke: "var(--pass-rate-color)",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "var(--pass-rate-color)",
                      stroke: "var(--pass-rate-dot-stroke)",
                    }}
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          {hasLetterGrades && (
            <TabsContent value="distribution" className="h-[300px]">
              <ChartContainer
                config={{
                  A: {
                    label: "A (%)",
                    color: "hsl(var(--chart-1))",
                  },
                  B: {
                    label: "B (%)",
                    color: "hsl(var(--chart-2))",
                  },
                  C: {
                    label: "C (%)",
                    color: "hsl(var(--chart-3))",
                  },
                  D: {
                    label: "D (%)",
                    color: "hsl(var(--chart-4))",
                  },
                  E: {
                    label: "E (%)",
                    color: "hsl(var(--chart-5))",
                  },
                  F: {
                    label: "F (%)",
                    color: "hsl(var(--chart-6))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={gradeDistributionData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--grid-color)"
                    />
                    <XAxis
                      dataKey="label"
                      stroke="var(--axis-color)"
                      tick={{ fill: "var(--text-color)" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="var(--axis-color)"
                      tick={{ fill: "var(--text-color)" }}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      cursor={{ stroke: "var(--cursor-color)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="A"
                      stroke="var(--grade-a-color)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: "var(--grade-a-color)",
                        stroke: "var(--grade-a-color)",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "var(--grade-a-color)",
                        stroke: "var(--grade-dot-stroke)",
                      }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="B"
                      stroke="var(--grade-b-color)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: "var(--grade-b-color)",
                        stroke: "var(--grade-b-color)",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "var(--grade-b-color)",
                        stroke: "var(--grade-dot-stroke)",
                      }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="C"
                      stroke="var(--grade-c-color)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: "var(--grade-c-color)",
                        stroke: "var(--grade-c-color)",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "var(--grade-c-color)",
                        stroke: "var(--grade-dot-stroke)",
                      }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="D"
                      stroke="var(--grade-d-color)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: "var(--grade-d-color)",
                        stroke: "var(--grade-d-color)",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "var(--grade-d-color)",
                        stroke: "var(--grade-dot-stroke)",
                      }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="E"
                      stroke="var(--grade-e-color)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: "var(--grade-e-color)",
                        stroke: "var(--grade-e-color)",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "var(--grade-e-color)",
                        stroke: "var(--grade-dot-stroke)",
                      }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="F"
                      stroke="var(--grade-f-color)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: "var(--grade-f-color)",
                        stroke: "var(--grade-f-color)",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "var(--grade-f-color)",
                        stroke: "var(--grade-dot-stroke)",
                      }}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          )}

          <TabsContent value="participants" className="h-[300px]">
            <ChartContainer
              config={{
                participants: {
                  label: "Participants",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={passRateData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--grid-color)"
                  />
                  <XAxis
                    dataKey="label"
                    stroke="var(--axis-color)"
                    tick={{ fill: "var(--text-color)" }}
                  />
                  <YAxis
                    stroke="var(--axis-color)"
                    tick={{ fill: "var(--text-color)" }}
                  />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: "var(--cursor-color)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="participants"
                    stroke="var(--participants-color)"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "var(--participants-color)",
                      stroke: "var(--participants-color)",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "var(--participants-color)",
                      stroke: "var(--participants-dot-stroke)",
                    }}
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
