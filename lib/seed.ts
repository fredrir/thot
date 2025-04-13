import { Readable } from "stream";
import fs from "node:fs";

const apiBaseUrl = "https://dbh.hkdir.no/api/Tabeller/hentJSONTabellData";
const ntnuInstitutionCode = 1150;

export enum Semester {
  WINTER = 0,
  SPRING = 1,
  SUMMER = 2,
  AUTUMN = 3,
}

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
    fs.createWriteStream(outFile, {
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

export type Department = {
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
};

export const getDepartmentsQuery = async () =>
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

export type Subject = {
  Institusjonskode: string;
  Institusjonsnavn: string;
  Avdelingskode: string;
  Avdelingsnavn: string;
  Avdelingskode_SSB: string;
  Årstall: string;
  Semester: string;
  Semesternavn: string;
  Studieprogramkode: string;
  Studieprogramnavn: string;
  Emnekode: string;
  Emnenavn: string;
  Nivåkode: string;
  Nivånavn: string;
  Studiepoeng: string;
  "NUS-kode": string;
  Status: string;
  Statusnavn: string;
  "Underv.språk": string;
  Navn: string;
  Fagkode: string;
  Fagnavn: string;
  "Oppgave (ny fra h2012)": string;
};

export const getSubjectsQuery = async () =>
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

export type Grade = {
  Årstall: string;
  Semester: string;
  Semesternavn: string;
  Karakter: string;
  Emnekode: string;
  "Antall kandidater totalt": string;
};

export const getGradesQuery = async () => {
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
