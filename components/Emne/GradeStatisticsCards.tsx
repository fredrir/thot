"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, Minus, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GradeStatisticsCardsProps {
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

export function GradeStatisticsCards({ grades }: GradeStatisticsCardsProps) {
  const hasLetterGrades = useMemo(() => {
    return grades.some(
      (g) => g.gradeA !== null || g.gradeB !== null || g.gradeC !== null,
    );
  }, [grades]);

  const sortedGrades = useMemo(() => {
    return [...grades].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.semester - b.semester;
    });
  }, [grades]);

  const latestGrade = useMemo(() => {
    return sortedGrades[sortedGrades.length - 1];
  }, [sortedGrades]);

  const previousGrade = useMemo(() => {
    return sortedGrades.length > 1
      ? sortedGrades[sortedGrades.length - 2]
      : null;
  }, [sortedGrades]);

  const averageGrade = useMemo(() => {
    if (!hasLetterGrades || !latestGrade) return null;

    // Calculate weighted average (A=5, B=4, C=3, D=2, E=1, F=0)
    const totalPoints =
      (latestGrade.gradeA || 0) * 5 +
      (latestGrade.gradeB || 0) * 4 +
      (latestGrade.gradeC || 0) * 3 +
      (latestGrade.gradeD || 0) * 2 +
      (latestGrade.gradeE || 0) * 1;

    const totalGraded =
      (latestGrade.gradeA || 0) +
      (latestGrade.gradeB || 0) +
      (latestGrade.gradeC || 0) +
      (latestGrade.gradeD || 0) +
      (latestGrade.gradeE || 0) +
      (latestGrade.gradeF || 0);

    if (totalGraded === 0) return null;

    const average = totalPoints / totalGraded;

    // Convert to letter grade
    if (average >= 4.5) return "A";
    if (average >= 3.5) return "B";
    if (average >= 2.5) return "C";
    if (average >= 1.5) return "D";
    if (average >= 0.5) return "E";
    return "F";
  }, [hasLetterGrades, latestGrade]);

  const passRate = useMemo(() => {
    if (!latestGrade) return { rate: 0, change: 0 };

    let currentPassRate = 0;
    let previousPassRate = 0;

    if (hasLetterGrades) {
      const passing =
        (latestGrade.gradeA || 0) +
        (latestGrade.gradeB || 0) +
        (latestGrade.gradeC || 0) +
        (latestGrade.gradeD || 0) +
        (latestGrade.gradeE || 0);
      currentPassRate = Math.round(
        (passing / latestGrade.participantsTotal) * 100,
      );

      if (previousGrade) {
        const prevPassing =
          (previousGrade.gradeA || 0) +
          (previousGrade.gradeB || 0) +
          (previousGrade.gradeC || 0) +
          (previousGrade.gradeD || 0) +
          (previousGrade.gradeE || 0);
        previousPassRate = Math.round(
          (prevPassing / previousGrade.participantsTotal) * 100,
        );
      }
    } else {
      currentPassRate = Math.round(
        ((latestGrade.gradePass || 0) / latestGrade.participantsTotal) * 100,
      );

      if (previousGrade) {
        previousPassRate = Math.round(
          ((previousGrade.gradePass || 0) / previousGrade.participantsTotal) *
            100,
        );
      }
    }

    return {
      rate: currentPassRate,
      change: previousPassRate ? currentPassRate - previousPassRate : 0,
    };
  }, [latestGrade, previousGrade, hasLetterGrades]);

  const topGrade = useMemo(() => {
    if (!hasLetterGrades || !latestGrade) return null;

    const grades = [
      { grade: "A", count: latestGrade.gradeA || 0 },
      { grade: "B", count: latestGrade.gradeB || 0 },
      { grade: "C", count: latestGrade.gradeC || 0 },
      { grade: "D", count: latestGrade.gradeD || 0 },
      { grade: "E", count: latestGrade.gradeE || 0 },
    ];

    return grades.sort((a, b) => b.count - a.count)[0].grade;
  }, [hasLetterGrades, latestGrade]);

  const participantsTrend = useMemo(() => {
    if (!latestGrade) return { count: 0, change: 0 };

    const currentCount = latestGrade.participantsTotal;
    const previousCount = previousGrade ? previousGrade.participantsTotal : 0;

    return {
      count: currentCount,
      change: previousCount
        ? Math.round(((currentCount - previousCount) / previousCount) * 100)
        : 0,
    };
  }, [latestGrade, previousGrade]);

  if (!latestGrade) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Grade Data Available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Latest Semester</CardDescription>
          <CardTitle>
            {latestGrade.year} {latestGrade.semester === 1 ? "Spring" : "Fall"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestGrade.participantsTotal}
          </div>
          <p className="text-muted-foreground text-xs">Students</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Pass Rate</CardDescription>
          <CardTitle>{passRate.rate}%</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            {passRate.change === 0 ? (
              <Minus className="text-muted-foreground mr-1 h-4 w-4" />
            ) : passRate.change > 0 ? (
              <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span
              className={
                passRate.change > 0
                  ? "text-emerald-500"
                  : passRate.change < 0
                    ? "text-red-500"
                    : "text-muted-foreground"
              }
            >
              {passRate.change > 0 ? "+" : ""}
              {passRate.change}%
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            From previous semester
          </p>
        </CardContent>
      </Card>

      {hasLetterGrades && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Grade</CardDescription>
              <CardTitle>{averageGrade || "N/A"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topGrade || "N/A"}</div>
              <p className="text-muted-foreground text-xs">Most common grade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Participants Trend</CardDescription>
              <CardTitle>
                <Users className="mr-1 inline h-4 w-4" />
                {participantsTrend.count}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {participantsTrend.change === 0 ? (
                  <Minus className="text-muted-foreground mr-1 h-4 w-4" />
                ) : participantsTrend.change > 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    participantsTrend.change > 0
                      ? "text-emerald-500"
                      : participantsTrend.change < 0
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }
                >
                  {participantsTrend.change > 0 ? "+" : ""}
                  {participantsTrend.change}%
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                From previous semester
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
