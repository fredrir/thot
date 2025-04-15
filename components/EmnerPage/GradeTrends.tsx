"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp } from "lucide-react";

interface GradeHistoryItem {
  id: string;
  year: number;
  semester: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  gradeE: number;
  gradeF: number;
  participantsTotal: number;
}

interface GradeTrendsProps {
  grades: GradeHistoryItem[];
}

export function GradeTrends({ grades }: GradeTrendsProps) {
  const [viewType, setViewType] = useState<"percentage" | "absolute">(
    "percentage",
  );

  //eslint-disable-next-line
  const [sortedGrades, setSortedGrades] = useState<any[]>([]);

  useEffect(() => {
    // Sort grades by year and semester
    const sorted = [...grades].sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.semester - b.semester;
    });

    // Transform data for charts
    const transformedData = sorted.map((grade) => {
      const semesterLabel = `${grade.year} ${grade.semester === 1 ? "Spring" : "Autumn"}`;

      if (viewType === "percentage") {
        const total = grade.participantsTotal || 1; // Avoid division by zero
        return {
          name: semesterLabel,
          A: Math.round((grade.gradeA / total) * 100),
          B: Math.round((grade.gradeB / total) * 100),
          C: Math.round((grade.gradeC / total) * 100),
          D: Math.round((grade.gradeD / total) * 100),
          E: Math.round((grade.gradeE / total) * 100),
          F: Math.round((grade.gradeF / total) * 100),
          total: grade.participantsTotal,
        };
      } else {
        return {
          name: semesterLabel,
          A: grade.gradeA,
          B: grade.gradeB,
          C: grade.gradeC,
          D: grade.gradeD,
          E: grade.gradeE,
          F: grade.gradeF,
          total: grade.participantsTotal,
        };
      }
    });

    setSortedGrades(transformedData);
  }, [grades, viewType]);

  // Calculate average grades over time
  const averageGradeData = sortedGrades.map((semester) => {
    // Convert letter grades to numerical values (A=5, B=4, etc.)
    const totalPoints =
      semester.A * 5 +
      semester.B * 4 +
      semester.C * 3 +
      semester.D * 2 +
      semester.E * 1;

    const totalStudents =
      viewType === "percentage"
        ? 100 // For percentage view
        : semester.A +
          semester.B +
          semester.C +
          semester.D +
          semester.E +
          semester.F;

    // Calculate average (excluding F grades which are 0)
    const averageValue =
      totalPoints /
      (totalStudents - (viewType === "percentage" ? semester.F : semester.F));

    // Map back to letter grade range
    let averageGrade;
    if (averageValue > 4.5) averageGrade = "A";
    else if (averageValue > 3.5) averageGrade = "B";
    else if (averageValue > 2.5) averageGrade = "C";
    else if (averageValue > 1.5) averageGrade = "D";
    else averageGrade = "E";

    return {
      name: semester.name,
      average: averageValue,
      averageGrade,
      total: semester.total,
    };
  });

  // Calculate pass/fail rates over time
  const passFailData = sortedGrades.map((semester) => {
    const passRate =
      viewType === "percentage"
        ? 100 - semester.F
        : Math.round(((semester.total - semester.F) / semester.total) * 100);

    const failRate =
      viewType === "percentage"
        ? semester.F
        : Math.round((semester.F / semester.total) * 100);

    return {
      name: semester.name,
      pass: passRate,
      fail: failRate,
      total: semester.total,
    };
  });

  //eslint-disable-next-line
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip border-4 border-black bg-white p-3">
          <p className="font-bold">{`${label}`}</p>
          {/* eslint-disable-next-line */}
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              style={{ color: entry.color }}
              className="font-medium"
            >
              {`${entry.name}: ${entry.value}${viewType === "percentage" ? "%" : ""}`}
            </p>
          ))}
          {viewType === "absolute" && (
            <p className="mt-1 text-sm font-bold">{`Total: ${sortedGrades.find((g) => g.name === label)?.total || 0} students`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (grades.length === 0) {
    return (
      <div className="border-4 border-black p-6 text-center">
        <h3 className="text-xl font-bold">
          No historical grade data available
        </h3>
        <p className="mt-2">
          There is no trend data to display for this course.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center text-xl font-bold">
            <TrendingUp className="mr-2 h-5 w-5" />
            Grade Trends Over Time
          </h3>
          <p className="text-sm">
            Visualizing how grades have changed across semesters
          </p>
        </div>

        <Button
          onClick={() =>
            setViewType(viewType === "percentage" ? "absolute" : "percentage")
          }
          className="rounded-none border-4 border-black bg-white font-bold text-black hover:bg-yellow-300"
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {viewType === "percentage"
            ? "Show Absolute Numbers"
            : "Show Percentages"}
        </Button>
      </div>

      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="w-full rounded-none border-4 border-black bg-white">
          <TabsTrigger
            value="distribution"
            className="rounded-none font-bold data-[state=active]:bg-yellow-300 data-[state=active]:text-black"
          >
            Grade Distribution Trends
          </TabsTrigger>
          <TabsTrigger
            value="average"
            className="rounded-none font-bold data-[state=active]:bg-yellow-300 data-[state=active]:text-black"
          >
            Average Grade Trends
          </TabsTrigger>
          <TabsTrigger
            value="passfail"
            className="rounded-none font-bold data-[state=active]:bg-yellow-300 data-[state=active]:text-black"
          >
            Pass/Fail Rate Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="mt-6">
          <Card className="overflow-hidden rounded-none border-4 border-black">
            <CardContent className="p-0">
              <div className="border-b-4 border-black bg-yellow-100 p-4">
                <h4 className="font-bold">Grade Distribution Over Time</h4>
                <p className="text-sm">
                  How the distribution of grades has changed across semesters
                </p>
              </div>
              <div className="h-[400px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedGrades}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontWeight: "bold" }}
                    />
                    <YAxis
                      label={{
                        value:
                          viewType === "percentage"
                            ? "Percentage (%)"
                            : "Number of Students",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontWeight: "bold" },
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontWeight: "bold" }} />
                    <Bar
                      dataKey="A"
                      stackId="a"
                      fill="#4CAF50"
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <Bar
                      dataKey="B"
                      stackId="a"
                      fill="#8BC34A"
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <Bar
                      dataKey="C"
                      stackId="a"
                      fill="#FFEB3B"
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <Bar
                      dataKey="D"
                      stackId="a"
                      fill="#FF9800"
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <Bar
                      dataKey="E"
                      stackId="a"
                      fill="#FF5722"
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <Bar
                      dataKey="F"
                      stackId="a"
                      fill="#F44336"
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="average" className="mt-6">
          <Card className="overflow-hidden rounded-none border-4 border-black">
            <CardContent className="p-0">
              <div className="border-b-4 border-black bg-yellow-100 p-4">
                <h4 className="font-bold">Average Grade Trend</h4>
                <p className="text-sm">
                  How the average grade has changed over time
                </p>
              </div>
              <div className="h-[400px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={averageGradeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontWeight: "bold" }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      ticks={[0, 1, 2, 3, 4, 5]}
                      tickFormatter={(value) => {
                        if (value === 0) return "F";
                        if (value === 1) return "E";
                        if (value === 2) return "D";
                        if (value === 3) return "C";
                        if (value === 4) return "B";
                        if (value === 5) return "A";
                        return "";
                      }}
                    />
                    <Tooltip
                      //eslint-disable-next-line
                      formatter={(value: any) => {
                        let grade = "F";
                        if (value > 4.5) grade = "A";
                        else if (value > 3.5) grade = "B";
                        else if (value > 2.5) grade = "C";
                        else if (value > 1.5) grade = "D";
                        else if (value > 0.5) grade = "E";
                        return [
                          `${value.toFixed(2)} (${grade})`,
                          "Average Grade",
                        ];
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="average"
                      fill="#8884d8"
                      stroke="#000"
                      strokeWidth={2}
                      label={{
                        position: "top",

                        //eslint-disable-next-line
                        formatter: (value: any) => {
                          let grade = "F";
                          if (value > 4.5) grade = "A";
                          else if (value > 3.5) grade = "B";
                          else if (value > 2.5) grade = "C";
                          else if (value > 1.5) grade = "D";
                          else if (value > 0.5) grade = "E";
                          return grade;
                        },
                        style: { fontWeight: "bold" },
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passfail" className="mt-6">
          <Card className="overflow-hidden rounded-none border-4 border-black">
            <CardContent className="p-0">
              <div className="border-b-4 border-black bg-yellow-100 p-4">
                <h4 className="font-bold">Pass/Fail Rate Trend</h4>
                <p className="text-sm">
                  How the pass and fail rates have changed over time
                </p>
              </div>
              <div className="h-[400px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={passFailData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tick={{ fontWeight: "bold" }}
                    />
                    <YAxis
                      label={{
                        value: "Percentage (%)",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontWeight: "bold" },
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontWeight: "bold" }} />
                    <Bar
                      dataKey="pass"
                      name="Pass Rate"
                      fill="#4CAF50"
                      stroke="#000"
                      strokeWidth={2}
                      label={{
                        position: "top",

                        //eslint-disable-next-line
                        formatter: (value: any) => `${value}%`,
                        style: { fontWeight: "bold" },
                      }}
                    />
                    <Bar
                      dataKey="fail"
                      name="Fail Rate"
                      fill="#F44336"
                      stroke="#000"
                      strokeWidth={2}
                      label={{
                        position: "top",
                        //eslint-disable-next-line
                        formatter: (value: any) => `${value}%`,
                        style: { fontWeight: "bold" },
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="border-4 border-black bg-yellow-100 p-4">
        <h4 className="font-bold">Insights</h4>
        <ul className="mt-2 space-y-2">
          <li className="flex items-start">
            <span className="mt-2 mr-2 inline-block h-2 w-2 rounded-full bg-black"></span>
            {averageGradeData.length > 1 && (
              <>
                {averageGradeData[averageGradeData.length - 1].average >
                averageGradeData[0].average ? (
                  <span>
                    The average grade has <strong>improved</strong> from{" "}
                    {averageGradeData[0].averageGrade} to{" "}
                    {averageGradeData[averageGradeData.length - 1].averageGrade}{" "}
                    over time.
                  </span>
                ) : averageGradeData[averageGradeData.length - 1].average <
                  averageGradeData[0].average ? (
                  <span>
                    The average grade has <strong>decreased</strong> from{" "}
                    {averageGradeData[0].averageGrade} to{" "}
                    {averageGradeData[averageGradeData.length - 1].averageGrade}{" "}
                    over time.
                  </span>
                ) : (
                  <span>
                    The average grade has <strong>remained stable</strong> at{" "}
                    {averageGradeData[0].averageGrade} over time.
                  </span>
                )}
              </>
            )}
          </li>
          <li className="flex items-start">
            <span className="mt-2 mr-2 inline-block h-2 w-2 rounded-full bg-black"></span>
            {passFailData.length > 1 && (
              <>
                {passFailData[passFailData.length - 1].fail <
                passFailData[0].fail ? (
                  <span>
                    The fail rate has <strong>decreased</strong> from{" "}
                    {passFailData[0].fail}% to{" "}
                    {passFailData[passFailData.length - 1].fail}%, showing
                    improved student performance.
                  </span>
                ) : passFailData[passFailData.length - 1].fail >
                  passFailData[0].fail ? (
                  <span>
                    The fail rate has <strong>increased</strong> from{" "}
                    {passFailData[0].fail}% to{" "}
                    {passFailData[passFailData.length - 1].fail}%, which may
                    indicate increasing course difficulty.
                  </span>
                ) : (
                  <span>
                    The fail rate has <strong>remained stable</strong> at{" "}
                    {passFailData[0].fail}% over time.
                  </span>
                )}
              </>
            )}
          </li>
          <li className="flex items-start">
            <span className="mt-2 mr-2 inline-block h-2 w-2 rounded-full bg-black"></span>
            <span>
              The most common grade across all semesters is{" "}
              <strong>
                {(() => {
                  // Calculate the most common grade
                  const gradeCount = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
                  sortedGrades.forEach((semester) => {
                    gradeCount.A +=
                      viewType === "percentage"
                        ? semester.A
                        : Math.round((semester.A / semester.total) * 100);
                    gradeCount.B +=
                      viewType === "percentage"
                        ? semester.B
                        : Math.round((semester.B / semester.total) * 100);
                    gradeCount.C +=
                      viewType === "percentage"
                        ? semester.C
                        : Math.round((semester.C / semester.total) * 100);
                    gradeCount.D +=
                      viewType === "percentage"
                        ? semester.D
                        : Math.round((semester.D / semester.total) * 100);
                    gradeCount.E +=
                      viewType === "percentage"
                        ? semester.E
                        : Math.round((semester.E / semester.total) * 100);
                    gradeCount.F +=
                      viewType === "percentage"
                        ? semester.F
                        : Math.round((semester.F / semester.total) * 100);
                  });

                  let maxGrade = "A";
                  let maxCount = gradeCount.A;

                  Object.entries(gradeCount).forEach(([grade, count]) => {
                    if (count > maxCount) {
                      maxGrade = grade;
                      maxCount = count;
                    }
                  });

                  return maxGrade;
                })()}
              </strong>
              .
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
