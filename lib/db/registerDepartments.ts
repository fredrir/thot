import { Department } from "./client.js";
import fs from "node:fs/promises";
import prisma from "./db.js";

const registerLevelThreeInstitution = async (institution: Department) => {
  const match = await prisma.department.findUnique({
    where: { id: institution.Avdelingskode },
  });

  const university = await prisma.university.findUnique({
    where: { id: institution.Institusjonskode },
  });

  if (!university) {
    throw new Error(
      `Did not find matching university for ${
        institution.Avdelingskode
      }: ${JSON.stringify(institution)}`,
    );
  }

  if (match !== null) {
    if (
      match.name !== institution.Avdelingsnavn ||
      match.universityId !== institution.Institusjonskode
    ) {
      await prisma.department.update({
        where: { id: institution.Avdelingskode },
        data: {
          name: institution.Avdelingsnavn,
          universityId: university.id,
        },
      });
    }
    return;
  }

  await prisma.department.create({
    data: {
      id: institution.Avdelingskode,
      name: institution.Avdelingsnavn,
      universityId: university.id,
    },
  });
};

export const registerDepartments = async () => {
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
        // Register 000-code institute
        await registerLevelThreeInstitution(institution);
        break;
      case "3":
        await registerLevelThreeInstitution(institution);
        break;
      default:
        throw new Error(
          `Failed to register institution with level ${
            institution.Nivå
          }: ${JSON.stringify(institution)}`,
        );
    }
  }
  console.groupEnd();
};
