import { Department } from "./client.js";
import fs from "node:fs/promises";
import prisma from "./db.js";

export const registerDepartments = async () => {
  console.log(`** Crawling data for faculties and departments`);
  const json = await fs.readFile("./departments.json", "utf-8");
  const institutions = JSON.parse(json) as Department[];

  console.group();
  // We must sort such that Nivå 2 departments are registered before Nivå 3
  // because Nivå 3 depends on Nivå 2 being registered.
  institutions.sort((a, b) => a.Nivå.localeCompare(b.Nivå));

  const filteredInstitutions = institutions.filter(
    (institution) => institution.Nivå === "2" || institution.Nivå === "3",
  );
  const uniqueDepartments = new Map<string, Department>();
  const existingDepartments = await prisma.department.findMany({
    where: {
      id: {
        in: filteredInstitutions.map(
          (institution) => institution.Avdelingskode,
        ),
      },
    },
  });
  for (const institution of filteredInstitutions) {
    if (!uniqueDepartments.has(institution.Avdelingskode)) {
      uniqueDepartments.set(institution.Avdelingskode, institution);
    }
  }
  const uniqueDepartmentsArray = Array.from(uniqueDepartments.values());
  const uniqueAndNotExistingInstitutions = uniqueDepartmentsArray.filter(
    (department) =>
      !existingDepartments.some((existingDepartment) => {
        return (
          existingDepartment.id === department.Avdelingskode &&
          existingDepartment.universityId === department.Institusjonskode
        );
      }),
  );

  await prisma.department.createMany({
    data: uniqueAndNotExistingInstitutions.map((institution) => ({
      id: institution.Avdelingskode,
      name: institution.Avdelingsnavn,
      universityId: institution.Institusjonskode,
    })),
    skipDuplicates: true,
  });
};
