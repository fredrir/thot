import { universityList } from "./universityList";
import prisma from "./db";

export default async function registerUniversities() {
  try {
    for (const university of universityList) {
      const existingUniversity = await prisma.university.findUnique({
        where: { id: university.id },
      });
      if (!existingUniversity) {
        await prisma.university.create({
          data: {
            id: university.id,
            name: university.name,
            shortName: university.shortName,
          },
        });
        console.log(`Created university: ${university.name}`);
      } else {
        await prisma.university.update({
          where: { id: university.id },
          data: {
            name: university.name,
            shortName: university.shortName,
          },
        });
        console.log(`Updated university: ${university.name}`);
      }
    }
    console.log("University import completed successfully");
  } catch (error) {
    console.error("Error during university import:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
