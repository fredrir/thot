"use server";

import prisma from "@/lib/db/db";
import type { Subject } from "@/lib/types";
import calculateAverageGrade from "../utils/calculateAverageGrade";
import calculateFailRate from "../utils/calculateFailRate";

type SortField = "name" | "grade" | "points";
type SortOrder = "asc" | "desc";

interface GetSubjectsParams {
  page: number;
  pageSize?: number;
  sortBy: SortField;
  sortOrder: SortOrder;
  search?: string;
  department?: string;
  university?: string;
  language?: string;
  level?: string;
}

export default async function getSubjects({
  page = 1,
  pageSize = 12,
  sortBy = "name",
  sortOrder = "asc",
  search = "",
  department = "",
  university = "",
  language = "",
  level = "",
}: GetSubjectsParams) {
  const skip = (page - 1) * pageSize;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { id: { contains: search, mode: "insensitive" } },
    ];
  }

  if (department) {
    where.department = {
      name: { contains: department, mode: "insensitive" },
    };
  }

  if (university) {
    where.department = {
      ...where.department,
      university: {
        name: { contains: university, mode: "insensitive" },
      },
    };
  }

  if (language) {
    where.language = { contains: language, mode: "insensitive" };
  }

  if (level) {
    where.level = { contains: level, mode: "insensitive" };
  }

  const sortFieldMap: Record<SortField, string> = {
    name: "name",
    grade: "studyPoints",
    points: "studyPoints",
  };

  const dbSortField = sortFieldMap[sortBy] || "name";

  const totalCount = await prisma.subject.count({ where });
  const totalPages = Math.ceil(totalCount / pageSize);

  const subjects = await prisma.subject.findMany({
    where,
    include: {
      department: {
        include: {
          university: true,
        },
      },
      grades: {
        orderBy: {
          year: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      [dbSortField]: sortOrder,
    },
    skip,
    take: pageSize,
  });

  const formattedSubjects: Subject[] = subjects.map((subject) => {
    const averageGrade = calculateAverageGrade(subject.grades);

    const failRate = calculateFailRate(subject.grades);

    const totalParticipants = subject.grades.reduce(
      (sum, grade) => sum + grade.participantsTotal,
      0,
    );

    return {
      id: subject.id,
      name: subject.name,
      universityName: subject.department.university.shortName,
      departmentName: subject.department.name,
      language: subject.language,
      level: subject.level,
      studyPoints: subject.studyPoints,
      taughtInSpring: subject.taughtInSpring || false,
      taughtInAutumn: subject.taughtInAutumn || false,
      averageGrade,
      failRate,
      totalParticipants,
    };
  });

  return {
    subjects: formattedSubjects,
    totalPages,
    currentPage: page,
    totalCount,
  };
}
