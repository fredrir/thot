import { PrismaClient } from "@prisma/client";
import { Department, Grade, Subject } from "./client.js";
import fs from "node:fs/promises";


const registerLevelTwoInstitution = async (
  institution: Department,
  db: PrismaClient
) => {
  const match = await db.faculty.findUnique({
    where: { id: institution.Fakultetskode },
  });

  if (match !== null) {
    if (match.name !== institution.Fakultetsnavn) {
      await db.faculty.update({
        where: { id: institution.Fakultetskode },
        data: { name: institution.Fakultetsnavn },
      });
    }
    return;
  }

  await db.faculty.create({
    data: {
      id: institution.Fakultetskode,
      name: institution.Fakultetsnavn,
    },
  });
};

const registerLevelThreeInstitution = async (
  institution: Department,
  db: PrismaClient
) => {
  const match = await db.department.findUnique({
    where: { id: institution.Avdelingskode },
  });

  const faculty = await db.faculty.findUnique({
    where: { id: institution.Fakultetskode },
  });

  if (!faculty) {
    throw new Error(
      `Did not find matching faculty for ${
        institution.Avdelingskode
      }: ${JSON.stringify(institution)}`
    );
  }

  if (match !== null) {
    if (
      match.name !== institution.Avdelingsnavn ||
      match.facultyId !== institution.Fakultetskode
    ) {
      await db.department.update({
        where: { id: institution.Avdelingskode },
        data: {
          name: institution.Avdelingsnavn,
          facultyId: faculty.id,
        },
      });
    }
    return;
  }

  await db.department.create({
    data: {
      id: institution.Avdelingskode,
      name: institution.Avdelingsnavn,
      facultyId: faculty.id,
    },
  });
};

export const registerInstitutions = async (db: PrismaClient) => {
  console.log(`** Crawling data for faculties and departments`);
  const json = await fs.readFile("./departments.json", "utf-8");
  const institutions = JSON.parse(json) as Department[];

  console.group();
  // We must sort such that Nivå 2 departments are registered before Nivå 3
  // because Nivå 3 depends on Nivå 2 being registered.
  institutions.sort((a, b) => a.Nivå.localeCompare(b.Nivå));
  for (const institution of institutions) {
    console.log(`* Fetching ${institution.Avdelingsnavn}`);
    switch (institution.Nivå) {
      case "2":
        // Register the faculty
        await registerLevelTwoInstitution(institution, db);
        // Register 000-code institute
        await registerLevelThreeInstitution(institution, db);
        break;
      case "3":
        await registerLevelThreeInstitution(institution, db);
        break;
      default:
        throw new Error(
          `Failed to register institution with level ${
            institution.Nivå
          }: ${JSON.stringify(institution)}`
        );
    }
  }
  console.groupEnd();
};

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
      }: ${JSON.stringify(subject)}`
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
        grade["Antall kandidater totalt"]
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
