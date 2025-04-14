import { PrismaClient } from "@prisma/client";
import { Grade, Subject } from "./client.js";
import fs from "node:fs/promises";

const registerSubject = async (subject: Subject, db: PrismaClient) => {
  console.log(`*SUBJECT * ${subject.Emnenavn}`);

  const match = await db.subject.findUnique({
    where: { id: subject.Emnekode },
  });

  const department = await db.department.findUnique({
    where: { id: subject.Avdelingskode },
  });

  if (!department) {
    throw new Error(
      `Did not find matching department for ${
        subject.Emnekode
      }: ${JSON.stringify(subject)}`,
    );
  }

  if (match !== null) {
    return;
  }

  await db.subject.create({
    data: {
      id: subject.Emnekode,
      name: subject.Emnenavn,
      level: subject.Nivåkode,
      language: subject["Underv.språk"],
      studyPoints: parseFloat(subject.Studiepoeng),
      instituteId: department.id,
    },
  });
};

export const registerSubjects = async (db: PrismaClient) => {
  const json = await fs.readFile("./subjects.json", "utf-8");
  const subjects = JSON.parse(json) as Subject[];

  for (const subject of subjects) {
    console.log(`** Crawling data for ${subject.Emnenavn}`);
    await registerSubject(subject, db);
  }
};

const registerGrade = async (grade: Grade, db: PrismaClient) => {
  console.log(`*GRADE * ${grade.Emnekode} ${grade.Årstall} ${grade.Semester}`);

  const matchingSubject = await db.subject.findUnique({
    where: { id: grade.Emnekode },
  });

  if (matchingSubject === null) {
    return;
  }

  let match = await db.subjectSemesterGrade.findFirst({
    where: {
      year: parseInt(grade.Årstall),
      semester: parseInt(grade.Semester),
      subjectId: grade.Emnekode,
    },
  });

  if (match === null) {
    match = await db.subjectSemesterGrade.create({
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

  await db.subjectSemesterGrade.update({
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

export const registerGrades = async (db: PrismaClient) => {
  const json = await fs.readFile("./grades.json", "utf-8");
  const grades = JSON.parse(json) as Grade[];

  for (const grade of grades) {
    console.log(`** Crawling data for ${grade.Emnekode}`);
    await registerGrade(grade, db);
  }
};
