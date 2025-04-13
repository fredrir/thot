import { prisma } from "../db/prisma";

export default async function getPopularSubjects() {
  const numberOfSubjects = 9;

  try {
    const popularSubjects = await prisma.grade.groupBy({
      by: ["emnekode"],
      _sum: {
        antallKandidaterTotalt: true,
      },
      orderBy: {
        _sum: {
          antallKandidaterTotalt: "desc",
        },
      },
      take: numberOfSubjects,
    });

    const subjectsWithDetails = await Promise.all(
      popularSubjects.map(async (subject) => {
        const subjectDetails = await prisma.subject.findFirst({
          where: {
            emnekode: subject.emnekode,
          },
          select: {
            emnekode: true,
            emnenavn: true,
            studiepoeng: true,
            institusjonsnavn: true,
            avdelingsnavn: true,
          },
        });

        return {
          ...subjectDetails,
          totalCandidates: subject._sum.antallKandidaterTotalt,
        };
      })
    );

    return subjectsWithDetails;
  } catch (error) {
    console.error("Error fetching popular subjects:", error);
    return [];
  }
}
