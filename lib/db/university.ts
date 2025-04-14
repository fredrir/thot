import { PrismaClient } from "@prisma/client"
import fs from "fs"

const prisma = new PrismaClient()

export default async function fetchUniversity() {
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



    const departmentsData: DepartmentData[] = JSON.parse(fs.readFileSync("./departments.json", "utf8"))

    const universities = [
      {
        id: "1110",
        name: "Universitetet i Oslo",
        shortName: "UiO",
      },
      {
        id: "1120",
        name: "Universitetet i Bergen",
        shortName: "UiB",
      },
      {
        id: "1130",
        name: "Universitetet i Tromsø - Norges arktiske universitet",
        shortName: "UiT",
      },
      {
        id: "1150",
        name: "Norges teknisk-naturvitenskapelige universitet",
        shortName: "NTNU",
      },
      {
        id: "1160",
        name: "Universitetet i Stavanger",
        shortName: "UiS",
      },{
        id: "1171",
        name: "Universitetet i Agder",
        shortName: "UiA",
      }
    ]

    

    universities.forEach(async (university) => {
      const existingUniversity = await prisma.university.findUnique({
        where: { id: university.id },
      })
      if (!existingUniversity) {
        await prisma.university.create({
          data: {
            id: university.id,
            name: university.name,
            shortName: university.shortName,
          },
        })
        console.log(`Created university: ${university.name}`)
      } else {
        await prisma.university.update({
          where: { id: university.id },
          data: {
            name: university.name,
            shortName: university.shortName,
          },
        })
        console.log(`Updated university: ${university.name}`)
      }
    })


    const faculties = await prisma.faculty.findMany()

    
    const facultyToUniMap = new Map()

    departmentsData.forEach((dept: DepartmentData) => {
      const facultyCode = dept.Fakultetskode
      const uniCode = dept.Institusjonskode

      console.log(uniCode)

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
    
    const departments = await prisma.department.findMany()
    const departmentToFacultyMap = new Map()
    departmentsData.forEach((dept: DepartmentData) => {
      const facultyCode = dept.Fakultetskode
      const uniCode = dept.Institusjonskode
      if (facultyCode && uniCode ) {
        departmentToFacultyMap.set(uniCode, {
          facultyCode,
          uniCode,
        })
      }
    })
    for (const department of departments) {
      const departmentCode = department.id
      const departmentInfo = departmentToFacultyMap.get(departmentCode)
      if (departmentInfo) {
        await prisma.department.update({
          where: { id: department.id },
          data: {
            universityId: departmentInfo.uniCode,
            name: departmentInfo.departmentName,
          },
        })
        console.log(`Updated department ${department.id} with university ${departmentInfo.uniCode}`)
      } else {
        console.log(`Could not find university for department ${department.id}`)
      }
    }

    console.log("Import completed successfully")
  } catch (error) {
    console.error("Error during import:", error)
  } finally {
    await prisma.$disconnect()
  }
}

