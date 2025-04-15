import { Grade } from "../types";

export default function calculateFailRate(grades: Grade[]): number {
  if (grades.length === 0) return 0;

  const totalFails = grades.reduce(
    (sum, grade) => sum + (grade.gradeF || 0),
    0,
  );
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

  if (totalStudents === 0) return 0;

  return parseFloat((totalFails / totalStudents).toFixed(2));
}
