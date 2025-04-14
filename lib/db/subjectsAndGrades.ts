import { Grade, Subject } from "./client.js";
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

export async function registerGrades() {
  console.log(`** Crawling data for grades`);
  const json = await fs.readFile("./grades.json", "utf-8");
  const grades = JSON.parse(json) as Grade[];

  const allSubjectIds = new Set<string>();
  for (const g of grades) {
    allSubjectIds.add(g.Emnekode);
  }

  const existingSubjects = await prisma.subject.findMany({
    where: { id: { in: Array.from(allSubjectIds) } },
    select: { id: true },
  });
  const existingSubjectIds = new Set(existingSubjects.map((s) => s.id));

  const grouped: Record<
    string,
    Record<
      string,
      {
        year: number;
        semester: number;
        subjectId: string;
        gradeA: number;
        gradeB: number;
        gradeC: number;
        gradeD: number;
        gradeE: number;
        gradeF: number;
        gradePass: number;
        gradeFail: number;
        participantsTotal: number;
      }
    >
  > = {};

  const gradeKeyMap: Record<
    string,
    keyof Omit<
      (typeof grouped)[string][string],
      "year" | "semester" | "subjectId" | "participantsTotal"
    >
  > = {
    A: "gradeA",
    B: "gradeB",
    C: "gradeC",
    D: "gradeD",
    E: "gradeE",
    F: "gradeF",
    G: "gradePass",
    H: "gradeFail",
  };

  for (const g of grades) {
    const subjectId = g.Emnekode;
    if (!existingSubjectIds.has(subjectId)) {
      continue;
    }

    const year = parseInt(g.Årstall);
    const semester = parseInt(g.Semester);
    const gradeChar = g.Karakter;
    const totalCount = parseInt(g["Antall kandidater totalt"]) || 0;

    const comboKey = `${year}_${semester}`;

    if (!grouped[subjectId]) {
      grouped[subjectId] = {};
    }
    if (!grouped[subjectId][comboKey]) {
      grouped[subjectId][comboKey] = {
        year,
        semester,
        subjectId,
        gradeA: 0,
        gradeB: 0,
        gradeC: 0,
        gradeD: 0,
        gradeE: 0,
        gradeF: 0,
        gradePass: 0,
        gradeFail: 0,
        participantsTotal: 0,
      };
    }

    const keyToIncrement = gradeKeyMap[gradeChar];
    if (keyToIncrement) {
      grouped[subjectId][comboKey][keyToIncrement] += totalCount;
    }

    grouped[subjectId][comboKey].participantsTotal += totalCount;
  }

  const flattened: Array<{
    subjectId: string;
    year: number;
    semester: number;
    gradeA: number;
    gradeB: number;
    gradeC: number;
    gradeD: number;
    gradeE: number;
    gradeF: number;
    gradePass: number;
    gradeFail: number;
    participantsTotal: number;
  }> = [];
  for (const subjectId of Object.keys(grouped)) {
    for (const comboKey of Object.keys(grouped[subjectId])) {
      flattened.push(grouped[subjectId][comboKey]);
    }
  }

  function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  const combos = flattened.map((f) => ({
    subjectId: f.subjectId,
    year: f.year,
    semester: f.semester,
  }));

  const BATCH_SIZE = 1000;
  const existingMap = new Map<
    string,
    { id: string; subjectId: string; year: number; semester: number }
  >();

  const comboChunks = chunkArray(combos, BATCH_SIZE);

  for (const chunk of comboChunks) {
    const existing = await prisma.subjectSemesterGrade.findMany({
      where: {
        OR: chunk.map((c) => ({
          subjectId: c.subjectId,
          year: c.year,
          semester: c.semester,
        })),
      },
      select: { id: true, subjectId: true, year: true, semester: true },
    });
    for (const e of existing) {
      const key = `${e.subjectId}_${e.year}_${e.semester}`;
      existingMap.set(key, e);
    }
  }

  const toCreate: Array<{
    subjectId: string;
    year: number;
    semester: number;
    participantsTotal: number;
  }> = [];

  for (const f of flattened) {
    const key = `${f.subjectId}_${f.year}_${f.semester}`;
    if (!existingMap.has(key)) {
      toCreate.push({
        subjectId: f.subjectId,
        year: f.year,
        semester: f.semester,
        participantsTotal: 0,
      });
    }
  }

  const createChunks = chunkArray(toCreate, BATCH_SIZE);
  for (const chunk of createChunks) {
    await prisma.subjectSemesterGrade.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  existingMap.clear();
  for (const chunk of comboChunks) {
    const existing = await prisma.subjectSemesterGrade.findMany({
      where: {
        OR: chunk.map((c) => ({
          subjectId: c.subjectId,
          year: c.year,
          semester: c.semester,
        })),
      },
      select: { id: true, subjectId: true, year: true, semester: true },
    });
    for (const e of existing) {
      const key = `${e.subjectId}_${e.year}_${e.semester}`;
      existingMap.set(key, e);
    }
  }

  const updates: Array<{
    where: { id: string };
    data: {
      gradeA: number;
      gradeB: number;
      gradeC: number;
      gradeD: number;
      gradeE: number;
      gradeF: number;
      gradePass: number;
      gradeFail: number;
      participantsTotal: number;
    };
  }> = [];

  for (const f of flattened) {
    const key = `${f.subjectId}_${f.year}_${f.semester}`;
    const existing = existingMap.get(key);
    if (!existing) continue;
    updates.push({
      where: { id: existing.id },
      data: {
        gradeA: f.gradeA,
        gradeB: f.gradeB,
        gradeC: f.gradeC,
        gradeD: f.gradeD,
        gradeE: f.gradeE,
        gradeF: f.gradeF,
        gradePass: f.gradePass,
        gradeFail: f.gradeFail,
        participantsTotal: f.participantsTotal,
      },
    });
  }

  const updateChunks = chunkArray(updates, BATCH_SIZE);
  for (const chunk of updateChunks) {
    await Promise.all(
      chunk.map((item) =>
        prisma.subjectSemesterGrade.update({
          where: item.where,
          data: item.data,
        }),
      ),
    );
  }

  console.log("Done bulk‐registering grades!");
}
