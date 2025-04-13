import { Command } from "commander";
import process from "node:process";
import fs from "node:fs/promises";
import { prisma } from "./db.js";
import {
  getDepartmentsQuery,
  getGradesQuery,
  getSubjectsQuery,
} from "./client.js";
import {
  registerGrades,
  registerInstitutions,
  registerSubjects,
} from "./crawler.js";
import { crawlNTNU } from "./ntnu-crawler.js";

const crawlNtnuAction = async () => {
  await crawlNTNU(prisma);
};

const migrateAction = async () => {
  const file = new URL("../init.sql", import.meta.url).pathname;
  const content = await fs.readFile(file, "utf-8");

  // Execute raw SQL with Prisma
  await prisma.$executeRawUnsafe(content);
};

const crawlAction = async () => {
  const departments = getDepartmentsQuery();
  const subjects = getSubjectsQuery();
  const grades = getGradesQuery();
  await Promise.all([departments, subjects, grades]);
};

const populateAction = async () => {
  await registerInstitutions(prisma);
  await registerSubjects(prisma);
  await registerGrades(prisma);
};

const program = new Command("crawler");

program.command("migrate").action(migrateAction);
program.command("crawl").action(crawlAction);
program.command("populate").action(populateAction);
program.command("crawl-ntnu").action(crawlNtnuAction);

program.command("deploy-prod").action(async () => {
  await migrateAction();
  await crawlAction();
  await populateAction();
  await crawlNtnuAction();
});

program.parse(process.argv);
