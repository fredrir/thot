"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  GraduationCap,
  Languages,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradeDistribution } from "./GradeDistribution";
import Link from "next/link";
import getSubjectById from "@/lib/actions/getSubjectById";
import type { Subject } from "@/lib/types";
import { GradeTrends } from "./GradeTrends";

interface SubjectDetailProps {
  subjectId: string;
  onBack?: () => void;
  href?: boolean;
}

type ExtendedSubject = Subject & {
  totalParticipants: number;
  averageGrade: string;
  failRate: number;
  taughtInSpring: boolean;
  taughtInAutumn: boolean;
  placeOfStudy: string;
  courseContent: string;
  learningGoals: string;
  learningForm: string;
  grades: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  };
  studyLevel: string;
  gradeHistory: {
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
  }[];
};

export function SubjectDetail({ subjectId, onBack, href }: SubjectDetailProps) {
  const [subject, setSubject] = useState<ExtendedSubject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);

      try {
        const subject = await getSubjectById(subjectId);
        setSubject(subject);
      } catch (error) {
        console.error("Failed to fetch subject:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex-1 animate-pulse p-6">
        <div className="mb-4 h-8 w-40 bg-gray-200"></div>
        <div className="mb-6 h-12 w-3/4 bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="h-40 bg-gray-200"></div>
          <div className="h-40 bg-gray-200"></div>
          <div className="h-40 bg-gray-200"></div>
        </div>
        <div className="mt-6 h-60 bg-gray-200"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex-1 p-6">
        {href ? (
          <Button className="mb-6 rounded-none border-4 border-black font-bold">
            <Link href={"/emner"}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to results
            </Link>
          </Button>
        ) : (
          <Button
            onClick={onBack}
            className="mb-6 rounded-none border-4 border-black font-bold"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to results
          </Button>
        )}
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold">Subject not found</h2>
          <p className="mt-2">
            The subject you&#39;re looking for doesn&#39;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {href ? (
        <Button className="mb-6 rounded-none border-4 border-black font-bold hover:bg-yellow-300 hover:text-black">
          <Link href={"/emner"} className="flex">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to results
          </Link>
        </Button>
      ) : (
        <Button
          onClick={onBack}
          className="mb-6 cursor-pointer rounded-none border-4 border-black font-bold hover:bg-yellow-300 hover:text-black"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to results
        </Button>
      )}

      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className="rounded-none bg-black px-2 py-0.5 font-bold text-white">
              {subject.universityName}
            </Badge>
            <Badge className="rounded-none border-2 border-black bg-yellow-300 px-2 py-0.5 font-bold text-black">
              {subject.studyPoints} SP
            </Badge>
            <Badge className="rounded-none border-2 border-black bg-white px-2 py-0.5 font-bold text-black">
              {subject.level}
            </Badge>
          </div>
          <h1 className="text-3xl font-black">{subject.name}</h1>
          <p className="mt-1 text-lg font-medium">{subject.departmentName}</p>
        </div>

        <Button className="rounded-none border-4 border-black bg-yellow-300 font-bold text-black hover:bg-yellow-400">
          <Star className="mr-2 h-5 w-5" />
          Add to Favorites
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-none border-4 border-black">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Grade Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Average Grade</div>
                <div
                  className={`text-3xl font-black ${
                    subject.averageGrade === "A" || subject.averageGrade === "B"
                      ? "text-green-600"
                      : subject.averageGrade === "C"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {subject.averageGrade}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Fail Rate</div>
                <div
                  className={`text-3xl font-black ${
                    subject.failRate < 10
                      ? "text-green-600"
                      : subject.failRate < 20
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {subject.failRate}%
                </div>
              </div>
            </div>
            <div className="text-sm">
              Based on {subject.totalParticipants} students in the last semester
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-4 border-black">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Teaching Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`border-2 border-black p-2 text-center font-bold ${subject.taughtInSpring ? "bg-green-100" : "bg-gray-100 text-gray-500"}`}
              >
                Spring Semester
              </div>
              <div
                className={`border-2 border-black p-2 text-center font-bold ${subject.taughtInAutumn ? "bg-green-100" : "bg-gray-100 text-gray-500"}`}
              >
                Autumn Semester
              </div>
            </div>
            <div className="mt-4 text-sm">
              <div className="font-medium">Place of Study:</div>
              <div>{subject.placeOfStudy}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-4 border-black">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Course Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">Language:</div>
                <div className="font-bold">{subject.language}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Study Level:</div>
                <div className="font-bold">
                  {subject.level} ({subject.studyLevel})
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Study Points:</div>
                <div className="font-bold">{subject.studyPoints}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="w-full rounded-none border-4 border-black bg-white">
          <TabsTrigger
            value="grades"
            className="rounded-none font-bold data-[state=active]:bg-yellow-300 data-[state=active]:text-black"
          >
            <GraduationCap className="mr-2 h-5 w-5" />
            Grade Distribution
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="rounded-none font-bold data-[state=active]:bg-yellow-300 data-[state=active]:text-black"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="mt-6">
          <Card className="rounded-none border-4 border-black">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold">Grade Distribution</h3>
              <GradeDistribution grades={subject.grades} />

              <div className="mt-8">
                <h4 className="mb-2 text-lg font-bold">
                  Historical Grade Data
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-4 border-black">
                    <thead>
                      <tr className="bg-yellow-300">
                        <th className="border-2 border-black p-2 text-left">
                          Semester
                        </th>
                        <th className="border-2 border-black p-2 text-left">
                          A
                        </th>
                        <th className="border-2 border-black p-2 text-left">
                          B
                        </th>
                        <th className="border-2 border-black p-2 text-left">
                          C
                        </th>
                        <th className="border-2 border-black p-2 text-left">
                          D
                        </th>
                        <th className="border-2 border-black p-2 text-left">
                          E
                        </th>
                        <th className="border-2 border-black p-2 text-left">
                          F
                        </th>
                        <th className="border-2 border-black p-2 text-left">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/*eslint-disable-next-line */}
                      {subject.gradeHistory.map((semester: any) => (
                        <tr key={semester.id} className="border-2 border-black">
                          <td className="border-2 border-black p-2 font-bold">
                            {semester.year}{" "}
                            {semester.semester === 1 ? "Spring" : "Autumn"}
                          </td>
                          <td className="border-2 border-black p-2">
                            {semester.gradeA}
                          </td>
                          <td className="border-2 border-black p-2">
                            {semester.gradeB}
                          </td>
                          <td className="border-2 border-black p-2">
                            {semester.gradeC}
                          </td>
                          <td className="border-2 border-black p-2">
                            {semester.gradeD}
                          </td>
                          <td className="border-2 border-black p-2">
                            {semester.gradeE}
                          </td>
                          <td className="border-2 border-black p-2">
                            {semester.gradeF}
                          </td>
                          <td className="border-2 border-black p-2 font-bold">
                            {semester.participantsTotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="mt-6">
          <Card className="rounded-none border-4 border-black">
            <CardContent className="p-6">
              <GradeTrends grades={subject.gradeHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
