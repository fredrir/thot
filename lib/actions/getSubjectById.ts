"use server";

import prisma from "@/lib/db/db";
import calculateAverageGrade from "../utils/calculateAverageGrade";
import calculateFailRate from "../utils/calculateFailRate";

export default async function getSubjectById(id: string) {
  const subjectData = await prisma.subject.findUnique({
    where: {
      id,
    },
    include: {
      department: {
        include: {
          university: true,
        },
      },
      grades: true,
    },
  });

  if (!subjectData) {
    throw new Error("Subject not found");
  }

  const totalParticipants = subjectData.grades.reduce(
    (sum, grade) => sum + grade.participantsTotal,
    0,
  );

  const averageGrade = calculateAverageGrade(subjectData.grades);

  const failRate = calculateFailRate(subjectData.grades);

  const grades = {
    A: subjectData.grades.reduce((sum, g) => sum + (g.gradeA || 0), 0),
    B: subjectData.grades.reduce((sum, g) => sum + (g.gradeB || 0), 0),
    C: subjectData.grades.reduce((sum, g) => sum + (g.gradeC || 0), 0),
    D: subjectData.grades.reduce((sum, g) => sum + (g.gradeD || 0), 0),
    E: subjectData.grades.reduce((sum, g) => sum + (g.gradeE || 0), 0),
    F: subjectData.grades.reduce((sum, g) => sum + (g.gradeF || 0), 0),
  };

  const extendedSubject = {
    id: subjectData.id,
    name: subjectData.name,
    universityName: subjectData.department.university.name,
    departmentName: subjectData.department.name,
    studyPoints: subjectData.studyPoints,
    language: subjectData.language,
    level: subjectData.level,
    averageGrade,
    failRate,
    taughtInSpring: subjectData.taughtInSpring || false,
    taughtInAutumn: subjectData.taughtInAutumn || false,
    totalParticipants,
    placeOfStudy: subjectData.placeOfStudy || "",
    courseContent: subjectData.courseContent || "",
    learningGoals: subjectData.learningGoals || "",
    learningForm: subjectData.learningForm || "",
    grades,
    studyLevel: subjectData.studyLevel?.toString() || "",
    gradeHistory: subjectData.grades.map((grade) => ({
      id: grade.id,
      year: grade.year,
      semester: grade.semester,
      gradeA: grade.gradeA || 0,
      gradeB: grade.gradeB || 0,
      gradeC: grade.gradeC || 0,
      gradeD: grade.gradeD || 0,
      gradeE: grade.gradeE || 0,
      gradeF: grade.gradeF || 0,
      participantsTotal: grade.participantsTotal,
    })),
  };

  return extendedSubject;
}
