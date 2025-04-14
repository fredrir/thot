import { Grade, Subject } from "./client.js";
import fs from "node:fs/promises";
import prisma from "./db.js";

export const registerSubjects = async () => {
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

const registerGrade = async (grade: Grade) => {
  console.log(`*GRADE * ${grade.Emnekode} ${grade.Årstall} ${grade.Semester}`);

  const matchingSubject = await prisma.subject.findUnique({
    where: { id: grade.Emnekode },
  });

  if (matchingSubject === null) {
    return;
  }

  let match = await prisma.subjectSemesterGrade.findFirst({
    where: {
      year: parseInt(grade.Årstall),
      semester: parseInt(grade.Semester),
      subjectId: grade.Emnekode,
    },
  });

  if (match === null) {
    match = await prisma.subjectSemesterGrade.create({
      data: {
        subjectId: grade.Emnekode,
        semester: parseInt(grade.Semester),
        year: parseInt(grade.Årstall),
        participantsTotal: 0,
      },
    });
  }

  const gradeKeyMap: Record<string, string> = {
    A: "gradeA",
    B: "gradeB",
    C: "gradeC",
    D: "gradeD",
    E: "gradeE",
    F: "gradeF",
    G: "gradePass",
    H: "gradeFail",
  };

  await prisma.subjectSemesterGrade.update({
    where: { id: match.id },
    data: {
      [gradeKeyMap[grade.Karakter]]: parseInt(
        grade["Antall kandidater totalt"],
      ),
      participantsTotal:
        match.participantsTotal + parseInt(grade["Antall kandidater totalt"]),
    },
  });
};

export const registerGrades = async () => {
  const json = await fs.readFile("./grades.json", "utf-8");
  const grades = JSON.parse(json) as Grade[];

  for (const grade of grades) {
    console.log(`** Crawling data for ${grade.Emnekode}`);
    await registerGrade(grade);
  }
};
