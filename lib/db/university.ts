import { PrismaClient } from "@prisma/client"
import fs from "fs"

const prisma = new PrismaClient()

export default async function fetchUniversity() {
  try {
    const departmentsData = JSON.parse(fs.readFileSync("./departments.json", "utf8"))

    const universities = new Map()

    departmentsData.forEach((dept: any) => {
      const uniCode = dept.Institusjonskode
      const uniName = dept.Institusjonsnavn

      if (!universities.has(uniCode)) {
        universities.set(uniCode, {
          id: uniCode,
          code: uniCode,
          name: uniName,
        })
      }
    })

    console.log(`Found ${universities.size} unique universities`)

    for (const uni of universities.values()) {
      await prisma.university.upsert({
        where: { code: uni.code },
        update: { name: uni.name },
        create: {
          id: uni.id,
          code: uni.code,
          name: uni.name,
        },
      })
      console.log(`Created/updated university: ${uni.name}`)
    }


    const faculties = await prisma.faculty.findMany()


    const facultyToUniMap = new Map()

    departmentsData.forEach((dept: any) => {
      const facultyCode = dept.Fakultetskode
      const uniCode = dept.Institusjonskode

      if (facultyCode && uniCode) {
        facultyToUniMap.set(facultyCode, uniCode)
      }
    })

    for (const faculty of faculties) {
      const facultyCode = faculty.id
      const uniCode = facultyToUniMap.get(facultyCode)

      if (uniCode) {
        await prisma.faculty.update({
          where: { id: faculty.id },
          data: { universityId: uniCode },
        })
        console.log(`Updated faculty ${faculty.id} with university ${uniCode}`)
      } else {
        console.log(`Could not find university for faculty ${faculty.id}`)
      }
    }

    console.log("Import completed successfully")
  } catch (error) {
    console.error("Error during import:", error)
  } finally {
    await prisma.$disconnect()
  }
}

