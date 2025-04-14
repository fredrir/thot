import { Command } from "commander";
import process from "node:process";
import fs from "node:fs/promises";
import prisma from "./db.js";
import {
  getDepartmentsQuery,
  getGradesQuery,
  getSubjectsQuery,
} from "./client.js";

import { crawlNTNU } from "./ntnu-crawler.js";
import fetchUniversity from "./registerUniversities.js";
import { registerGrades, registerSubjects } from "./subjectsAndGrades.js";
import registerUniversities from "./registerUniversities.js";
import { registerDepartments } from "./registerDepartments.js";

const crawlNtnuAction = async () => {
  await crawlNTNU();
};

const migrateAction = async () => {
  const file = new URL("../init.sql", import.meta.url).pathname;
  const content = await fs.readFile(file, "utf-8");

  // Split the SQL file into individual statements
  // This regex splits on semicolons but ignores those inside quotes or comments
  const statements = content
    .replace(/^START TRANSACTION;|COMMIT;$/gm, "") // Remove transaction statements
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  // Execute each statement individually
  try {
    // Start a transaction manually
    await prisma.$executeRaw`BEGIN`;

    for (const statement of statements) {
      await prisma.$executeRawUnsafe(`${statement};`);
    }

    // Commit the transaction
    await prisma.$executeRaw`COMMIT`;

    console.log("Migration completed successfully");
  } catch (error) {
    // Rollback on error
    await prisma.$executeRaw`ROLLBACK`;
    console.error("Migration failed:", error);
    throw error;
  }
};

const crawlAction = async () => {
  const departments = getDepartmentsQuery();
  const subjects = getSubjectsQuery();
  const grades = getGradesQuery();
  await Promise.all([departments, subjects, grades]);
};

const populateAction = async () => {
  await registerUniversities();
  await registerDepartments();
  await registerSubjects();
  await registerGrades();
};

const program = new Command("crawler");

program.command("migrate").action(migrateAction);
program.command("crawl").action(crawlAction);
program.command("populate").action(populateAction);
program.command("crawl-ntnu").action(crawlNtnuAction);
program.command("university").action(fetchUniversity);

program.command("deploy-prod").action(async () => {
  await migrateAction();
  await crawlAction();
  await populateAction();
  await crawlNtnuAction();
});

program.parse(process.argv);
