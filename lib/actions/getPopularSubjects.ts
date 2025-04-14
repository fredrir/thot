import prisma from "../db/db";

/**
 * Returns a single list of Subject objects (3 per university),
 * with an added `universityId` property on each item.
 */
export default async function getPopularSubjects() {
  try {
    const universities = await prisma.university.findMany();

    const topSubjects: Array<{
      id: string;
      name: string;
      totalCandidates: number;
      universityId: string;
    }> = [];

    for (const university of universities) {
      const departmentIds = (
        await prisma.department.findMany({
          where: { universityId: university.id },
          select: { id: true },
        })
      ).map((dept) => dept.id);

      const subjects = await prisma.subject.findMany({
        where: { instituteId: { in: departmentIds } },
        select: {
          id: true,
          name: true,
          department: { select: { universityId: true } },
          grades: { select: { participantsTotal: true } },
        },
      });

      const withTotals = subjects
        .map((subject) => {
          const totalCandidates = subject.grades.reduce(
            (sum, grade) => sum + grade.participantsTotal,
            0,
          );

          return {
            subject,
            totalCandidates,
          };
        })
        .sort((a, b) => b.totalCandidates - a.totalCandidates)
        .slice(0, 3);

      const top3ForThisUni = withTotals.map(({ subject, totalCandidates }) => ({
        ...subject,
        totalCandidates,
        universityId: subject.department.universityId,
      }));

      topSubjects.push(...top3ForThisUni);
    }

    return topSubjects;
  } catch (error) {
    console.error("Error fetching popular subjects:", error);
    return [];
  }
}
