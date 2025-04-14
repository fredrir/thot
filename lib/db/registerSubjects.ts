import { Subject } from "./client.js";
import fs from "node:fs/promises";
import prisma from "./db.js";

export const registerSubjects = async () => {
  console.log(`** Crawling data for subjects`);
  const json = await fs.readFile("./subjects.json", "utf-8");
  const subjects = JSON.parse(json) as Subject[];

  const uniqueSubjects = new Map<string, Subject>();

  for (const subject of subjects) {
    if (!uniqueSubjects.has(subject.Emnekode)) {
      uniqueSubjects.set(subject.Emnekode, subject);
    }
  }

  const uniqueSubjectsArray = Array.from(uniqueSubjects.values());

  const existingSubjects = await prisma.subject.findMany({
    where: {
      id: {
        in: uniqueSubjectsArray.map((subject) => subject.Emnekode),
      },
    },
    select: {
      id: true,
    },
  });

  const uniqueAndNotExistingSubjects = uniqueSubjectsArray.filter(
    (subject) =>
      !existingSubjects.some((existingSubject) => {
        return existingSubject.id === subject.Emnekode;
      }),
  );

  const prismaArray = uniqueAndNotExistingSubjects.map((subject) => ({
    id: subject.Emnekode,
    name: subject.Emnenavn,
    level: subject.Nivåkode,
    language: subject["Underv.språk"],
    studyPoints: parseFloat(subject.Studiepoeng),
    instituteId: subject.Avdelingskode,
  }));

  await prisma.subject.createMany({
    data: prismaArray,
  });
};
