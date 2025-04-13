import fs from "fs/promises";
import { Readable } from "stream";
import * as fss from "node:fs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const apiBaseUrl = "https://dbh.hkdir.no/api/Tabeller/hentJSONTabellData";
const ntnuInstitutionCode = 1150;

const createApiRequest = async (
  outFile: string,
  query: Record<string, unknown>
) => {
  const response = await fetch(apiBaseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(query),
  });
  if (response.body === null) {
    throw new Error("No body returned");
  }
  // @ts-expect-error -- this thinks we have browser fetch, not node 18.x fetch
  const stream = Readable.fromWeb(response.body, {
    encoding: "utf-8",
  });
  stream.pipe(
    fss.createWriteStream(outFile, {
      encoding: "utf-8",
    })
  );
  return new Promise((r) => {
    stream.on("end", r);
  });
};

const createQueryFilter = (variableName: string, values: string[]) => ({
  variabel: variableName,
  selection: {
    filter: "item",
    values,
  },
});

const createExclusionFilter = (variableName: string, exclude: string[]) => ({
  variabel: variableName,
  selection: {
    filter: "all",
    values: ["*"],
    exclude,
  },
});

const createQueryAllFilter = (variableName: string) => ({
  variabel: variableName,
  selection: {
    filter: "all",
    values: ["*"],
    exclude: [""],
  },
});

const createLatestQueryFilter = (variableName: string) => ({
  variabel: variableName,
  selection: {
    filter: "top",
    values: ["3"],
    exclude: [""],
  },
});

type QueryOptions = {
  sortBy?: string[];
  groupBy?: string[];
  filter: Record<string, unknown>[];
};

const createQuery = (
  tabelId: number,
  { sortBy, groupBy, filter }: QueryOptions
) => ({
  tabell_id: tabelId,
  api_versjon: 1,
  statuslinje: "N",
  kodetekst: "J",
  desimal_separator: ".",
  variabler: ["*"],
  sortBy,
  groupBy,
  filter,
});

const createStatusQueryFilter = () => createQueryFilter("Status", ["1", "2"]);
const createLevelQueryFilter = () =>
  createQueryFilter("Nivåkode", ["HN", "LN"]);
const createInstitutionQueryFilter = (institution: number) =>
  createQueryFilter("Institusjonskode", [institution.toString()]);

const getDepartmentsQuery = async () =>
  await createApiRequest(
    "departments.json",
    createQuery(210, {
      sortBy: ["Nivå"],
      filter: [
        createInstitutionQueryFilter(ntnuInstitutionCode),
        createExclusionFilter("Avdelingskode", ["000000"]),
      ],
    })
  );

const getSubjectsQuery = async () =>
  await createApiRequest(
    "subjects.json",
    createQuery(208, {
      sortBy: ["Årstall", "Institusjonskode", "Avdelingskode"],
      filter: [
        createInstitutionQueryFilter(ntnuInstitutionCode),
        createLevelQueryFilter(),
        createStatusQueryFilter(),
        createLatestQueryFilter("Årstall"),
        createExclusionFilter("Avdelingskode", ["000000"]),
      ],
    })
  );

const getGradesQuery = async () => {
  await createApiRequest(
    "grades.json",
    createQuery(308, {
      groupBy: [
        "Årstall",
        "Semester",
        "Karakter",
        "Emnekode",
        "Institusjonskode",
      ],
      filter: [
        createInstitutionQueryFilter(ntnuInstitutionCode),
        createLatestQueryFilter("Årstall"),
        createQueryAllFilter("Emnekode"),
        createQueryAllFilter("Semester"),
      ],
    })
  );
};

async function main() {
  console.log("Fetching data from API...");
  await getDepartmentsQuery();
  await getSubjectsQuery();
  await getGradesQuery();

  console.log("Reading JSON files...");
  const departmentsRaw = await fs.readFile("departments.json", "utf8");
  const subjectsRaw = await fs.readFile("subjects.json", "utf8");
  const gradesRaw = await fs.readFile("grades.json", "utf8");

  //eslint-disable-next-line
  let departments: any[], subjects: any[], grades: any[];
  try {
    departments = JSON.parse(departmentsRaw);
    subjects = JSON.parse(subjectsRaw);
    grades = JSON.parse(gradesRaw);
  } catch (err) {
    console.error("Error parsing JSON:", err);
    process.exit(1);
  }

  //eslint-disable-next-line
  const departmentData = departments.map((dep: any) => ({
    nivo: dep["Nivå"],
    nivoTekst: dep["Nivå_tekst"],
    institusjonskode: dep["Institusjonskode"],
    institusjonsnavn: dep["Institusjonsnavn"],
    avdelingskode: dep["Avdelingskode"],
    avdelingsnavn: dep["Avdelingsnavn"],
    gyldigFra: dep["Gyldig fra"],
    gyldigTil: dep["Gyldig til"],
    fagkodeAvdeling: dep["fagkode avdeling"],
    fagnavnAvdeling: dep["fagnavn avdeling"],
    fakultetskode: dep["Fakultetskode"],
    fakultetsnavn: dep["Fakultetsnavn"],
    avdelingskode3SisteSiffer: dep["Avdelingskode (3 siste siffer)"],
  }));

  //eslint-disable-next-line
  const subjectData = subjects.map((sub: any) => ({
    institusjonskode: sub["Institusjonskode"],
    institusjonsnavn: sub["Institusjonsnavn"],
    avdelingskode: sub["Avdelingskode"],
    avdelingsnavn: sub["Avdelingsnavn"],
    avdelingskodeSSB: sub["Avdelingskode_SSB"],
    arstall: sub["Årstall"],
    semester: sub["Semester"],
    semesternavn: sub["Semesternavn"],
    studieprogramkode: sub["Studieprogramkode"],
    studieprogramnavn: sub["Studieprogramnavn"],
    emnekode: sub["Emnekode"],
    emnenavn: sub["Emnenavn"],
    nivokode: sub["Nivåkode"],
    nivonavn: sub["Nivånavn"],
    studiepoeng: sub["Studiepoeng"],
    nusKode: sub["NUS-kode"],
    status: sub["Status"],
    statusnavn: sub["Statusnavn"],
    undervSprak: sub["Underv.språk"],
    navn: sub["Navn"],
    fagkode: sub["Fagkode"],
    fagnavn: sub["Fagnavn"],
    oppgaveNyFraH2012: sub["Oppgave (ny fra h2012)"],
  }));

  //eslint-disable-next-line
  const gradeData = grades.map((gr: any) => ({
    arstall: gr["Årstall"],
    semester: gr["Semester"],
    semesternavn: gr["Semesternavn"],
    karakter: gr["Karakter"],
    emnekode: gr["Emnekode"],
    antallKandidaterTotalt: parseInt(gr["Antall kandidater totalt"] ?? "0", 10),
  }));

  console.log("Seeding data into the database...");
  await prisma.department.createMany({
    data: departmentData,
    skipDuplicates: true,
  });
  await prisma.subject.createMany({
    data: subjectData,
    skipDuplicates: true,
  });
  await prisma.grade.createMany({
    data: gradeData,
    skipDuplicates: true,
  });

  console.log("Seeding completed.");
}

main()
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
