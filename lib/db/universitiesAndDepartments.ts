import fs from "fs";
import { universityList } from "./universityList";
import { PrismaClient } from "@prisma/client";

export default async function registerUniversityAndDepartments(
  db: PrismaClient,
) {
  try {
    interface DepartmentData {
      Nivå: string;
      Nivå_tekst: string;
      Institusjonskode: string;
      Institusjonsnavn: string;
      Avdelingskode: string;
      Avdelingsnavn: string;
      "Gyldig fra": string;
      "Gyldig til": string;
      "fagkode avdeling": string;
      "fagnavn avdeling": string;
      Fakultetskode: string;
      Fakultetsnavn: string;
      "Avdelingskode (3 siste siffer)": string;
    }

    const departmentsData: DepartmentData[] = JSON.parse(
      fs.readFileSync("./departments.json", "utf8"),
    );

    universityList.forEach(async (university) => {
      const existingUniversity = await db.university.findUnique({
        where: { id: university.id },
      });
      if (!existingUniversity) {
        await db.university.create({
          data: {
            id: university.id,
            name: university.name,
            shortName: university.shortName,
          },
        });
        console.log(`Created university: ${university.name}`);
      } else {
        await db.university.update({
          where: { id: university.id },
          data: {
            name: university.name,
            shortName: university.shortName,
          },
        });
        console.log(`Updated university: ${university.name}`);
      }
    });

    const departments = await db.department.findMany();
    const departmentToFacultyMap = new Map();
    departmentsData.forEach((dept: DepartmentData) => {
      const avdelingsKode = dept.Avdelingskode;
      const uniCode = dept.Institusjonskode;
      if (avdelingsKode && uniCode) {
        departmentToFacultyMap.set(avdelingsKode, {
          avdelingsKode,
          uniCode,
        });
      }
    });
    for (const department of departments) {
      const departmentCode = department.id;
      const departmentInfo = departmentToFacultyMap.get(departmentCode);
      if (departmentInfo) {
        await db.department.update({
          where: { id: department.id },
          data: {
            universityId: departmentInfo.uniCode,
          },
        });
        console.log(
          `Updated department ${department.id} with university ${departmentInfo.uniCode}`,
        );
      } else {
        console.log(
          `Could not find university for department ${department.id}`,
        );
      }
    }

    console.log("Import completed successfully");
  } catch (error) {
    console.error("Error during import:", error);
  } finally {
    await db.$disconnect();
  }
}
