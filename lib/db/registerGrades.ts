import { Grade } from "./client";
import prisma from "./db";
import fs from "node:fs/promises";

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

  console.log(`Found ${grades.length} grades`);

  for (const g of grades) {
    const subjectId = g.Emnekode;
    if (!existingSubjectIds.has(subjectId)) {
      continue;
    }

    const year = parseInt(g.Årstall);
    const semester = parseInt(g.Semester);
    const gradeChar = g.Karakter.trim().toUpperCase();

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
  console.log(`Found ${Object.keys(grouped).length} subjects`);

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
  console.log(`Found ${flattened.length} grades`);

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

  console.log("** Checking existing grades");

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

  console.log("** Checking for new grades");

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

  console.log(`Found ${toCreate.length} new grades to create`);

  const createChunks = chunkArray(toCreate, BATCH_SIZE);
  for (const chunk of createChunks) {
    await prisma.subjectSemesterGrade.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.log("Done bulk‐creating grades!");

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

  console.log("** Updating grades");
  console.log(`Found ${updates.length} grades to update`);
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

  console.log("** Bulk‐registering grades");

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
  await prisma.$disconnect();
}
