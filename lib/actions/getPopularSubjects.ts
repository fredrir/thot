import { prisma } from "../db/db";

export default async function getPopularSubjects() {
  const numberOfSubjects = 9;

  try {
    const popularSubjects = await prisma.subjectSemesterGrade.groupBy({
      by: ["subjectId"],
      _sum: {
        participantsTotal: true,
      },
      orderBy: {
        _sum: {
          participantsTotal: "desc",
        },
      },
      take: numberOfSubjects,
    });

    const subjectsWithDetails = await Promise.all(
      popularSubjects.map(async (subject) => {
        const subjectDetails = await prisma.subject.findFirst({
          where: {
            id: subject.subjectId,
          },
          select: {
            id: true,
            name: true,
            studyPoints: true,

          },
        });

        return {
          ...subjectDetails,
          totalCandidates: subject._sum.participantsTotal,
        };
      })
    );

    return subjectsWithDetails;
  } catch (error) {
    console.error("Error fetching popular subjects:", error);
    return [];
  }
}
