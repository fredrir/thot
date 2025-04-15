import { Grade } from "../types";

export default function calculateAverageGrade(grades: Grade[]): string {
  if (grades.length === 0) return "N/A";

  const totalGradePoints = grades.reduce((sum, grade) => {
    return (
      sum +
      (grade.gradeA || 0) * 5 +
      (grade.gradeB || 0) * 4 +
      (grade.gradeC || 0) * 3 +
      (grade.gradeD || 0) * 2 +
      (grade.gradeE || 0) * 1
    );
  }, 0);

  const totalStudents = grades.reduce((sum, grade) => {
    return (
      sum +
      (grade.gradeA || 0) +
      (grade.gradeB || 0) +
      (grade.gradeC || 0) +
      (grade.gradeD || 0) +
      (grade.gradeE || 0) +
      (grade.gradeF || 0)
    );
  }, 0);

  if (totalStudents === 0) return "N/A";

  const averagePoint = totalGradePoints / totalStudents;

  if (averagePoint >= 4.5) return "A";
  if (averagePoint >= 3.5) return "B";
  if (averagePoint >= 2.5) return "C";
  if (averagePoint >= 1.5) return "D";
  if (averagePoint >= 0.5) return "E";
  return "F";
}
