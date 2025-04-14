"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GradeDistributionChartProps {
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
  initialSemester: string;
}

export function GradeDistributionChart({
  grades,
  initialSemester,
}: GradeDistributionChartProps) {
  const [selectedSemester, setSelectedSemester] = useState(initialSemester);

  const semesterOptions = useMemo(() => {
    return grades.map((grade) => ({
      value: `${grade.year}-${grade.semester}`,
      label: `${grade.year} - ${grade.semester === 1 ? "Spring" : "Fall"}`,
    }));
  }, [grades]);

  const selectedGradeData = useMemo(() => {
    if (!selectedSemester) return null;

    const [year, semester] = selectedSemester.split("-").map(Number);
    return grades.find((g) => g.year === year && g.semester === semester);
  }, [grades, selectedSemester]);

  const chartData = useMemo(() => {
    if (!selectedGradeData) return [];

    const hasLetterGrades =
      selectedGradeData.gradeA !== null ||
      selectedGradeData.gradeB !== null ||
      selectedGradeData.gradeC !== null;

    if (hasLetterGrades) {
      return [
        {
          grade: "A",
          count: selectedGradeData.gradeA || 0,
          fill: "var(--chart-1)",
        },
        {
          grade: "B",
          count: selectedGradeData.gradeB || 0,
          fill: "var(--chart-2)",
        },
        {
          grade: "C",
          count: selectedGradeData.gradeC || 0,
          fill: "var(--chart-3)",
        },
        {
          grade: "D",
          count: selectedGradeData.gradeD || 0,
          fill: "var(--chart-4)",
        },
        {
          grade: "E",
          count: selectedGradeData.gradeE || 0,
          fill: "var(--chart-5)",
        },
        {
          grade: "F",
          count: selectedGradeData.gradeF || 0,
          fill: "var(--chart-6)",
        },
      ];
    } else {
      return [
        {
          grade: "Pass",
          count: selectedGradeData.gradePass || 0,
          fill: "var(--chart-1)",
        },
        {
          grade: "Fail",
          count: selectedGradeData.gradeFail || 0,
          fill: "var(--chart-6)",
        },
      ];
    }
  }, [selectedGradeData]);

  const passRate = useMemo(() => {
    if (!selectedGradeData) return 0;

    const hasLetterGrades =
      selectedGradeData.gradeA !== null ||
      selectedGradeData.gradeB !== null ||
      selectedGradeData.gradeC !== null;

    if (hasLetterGrades) {
      const passing =
        (selectedGradeData.gradeA || 0) +
        (selectedGradeData.gradeB || 0) +
        (selectedGradeData.gradeC || 0) +
        (selectedGradeData.gradeD || 0) +
        (selectedGradeData.gradeE || 0);
      return Math.round((passing / selectedGradeData.participantsTotal) * 100);
    } else {
      const passing = selectedGradeData.gradePass || 0;
      return Math.round((passing / selectedGradeData.participantsTotal) * 100);
    }
  }, [selectedGradeData]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>
            {selectedGradeData
              ? `${selectedGradeData.participantsTotal} students, ${passRate}% pass rate`
              : "Select a semester to view grade distribution"}
          </CardDescription>
        </div>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="">
          {selectedGradeData ? (
            <ChartContainer
              config={{
                count: {
                  label: "Students",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Select a semester to view grade distribution
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
