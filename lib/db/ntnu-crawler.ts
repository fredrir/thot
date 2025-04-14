import axios from "axios";
import cheerio from "cheerio";
import PQueue from "p-queue";
import prisma from "./db";

interface NTNUSubjectMetadata {
  courseContent: string | null;
  learningGoals: string | null;
  studyLevel: number | null;
  taughtInAutumn: boolean | null;
  taughtInSpring: boolean | null;
  placeOfStudy: string | null;
}

function parseCardContentByTitle(
  soup: cheerio.Root,
  title: string,
): Map<string, string> {
  const cardTitle = soup("div.card-header")
    .filter((_, elem) => {
      return cheerio(elem).text() === title;
    })
    .first();

  const factsCard = cheerio(cardTitle.parent());
  const cardBody = cheerio(factsCard).find("div.card-body");
  const contentText = cheerio(cardBody).text();

  //@ts-expect-error: Named capturing groups are not recognized in some TypeScript configurations
  const searchPattern = /(?<name>\S.*):\s+(?<value>.*)/g;
  const results = [...contentText.matchAll(searchPattern)];

  const content: Map<string, string> = new Map();
  for (const match of results) {
    const key = match.groups?.name || "";
    const value = match.groups?.value || "";
    content.set(key, value);
  }
  return content;
}

function getStudyLevelFromDescription(description: string): number {
  switch (description) {
    case "Doktorgrads nivå":
      return 900;
    case "Videreutdanning lavere grad":
      return 800;
    case "Høyere grads nivå":
      return 500;
    case "Fjerdeårsemner, nivå IV":
      return 400;
    case "Tredjeårsemner, nivå III":
      return 300;
    case "Videregående emner, nivå II":
      return 200;
    case "Grunnleggende emner, nivå I":
      return 100;
    case "Lavere grad, redskapskurs":
      return 90;
    case "Norsk for internasjonale studenter":
      return 80;
    case "Examen facultatum":
      return 71;
    case "Examen philosophicum":
      return 70;
    case "Forprøve/forkurs":
      return 60;
    default:
      return -1;
  }
}

function parseSubjectCardInfo($: cheerio.Root): NTNUSubjectMetadata | null {
  if (
    $("div#course-details h1").text().trim() === "Ingen info for gitt studieår"
  )
    return null;
  const factsCardContent = parseCardContentByTitle($, "Fakta om emnet");
  const studyLevel = factsCardContent.has("Studienivå")
    ? getStudyLevelFromDescription(
        factsCardContent.get("Studienivå") ??
          (() => {
            throw new Error(`Studienivå did not exist`);
          })(),
      )
    : null;

  const educationCardContent = parseCardContentByTitle($, "Undervisning");

  const taughtInAutumn =
    educationCardContent.get("Undervises")?.toLowerCase().includes("høst") ??
    null;
  const taughtInSpring =
    educationCardContent.get("Undervises")?.toLowerCase().includes("vår") ??
    null;

  const placeOfStudy = educationCardContent.get("Sted") ?? null;

  const content = $("div#course-content-toggler p").text();

  const learningGoals = $("div#learning-goal-toggler p").text();

  return {
    courseContent: content,
    learningGoals: learningGoals,
    studyLevel: studyLevel,
    taughtInAutumn: taughtInAutumn,
    taughtInSpring: taughtInSpring,
    placeOfStudy: placeOfStudy,
  };
}

async function crawlSubjectMetadata(
  subjectCode: string,
): Promise<NTNUSubjectMetadata | null> {
  const url = `https://www.ntnu.no/studier/emner/${subjectCode.split("-")[0]}`;
  const response = await axios.get(url);
  if (response.status !== 200)
    throw new Error(
      `Could not fetch ${url}, got status code ${response.status}`,
    );
  const $ = cheerio.load(response.data);
  return parseSubjectCardInfo($);
}

export const crawlNTNU = async () => {
  const subjects = await prisma.subject.findMany({
    select: { id: true },
  });

  const queue = new PQueue({ concurrency: 10 });

  for (const subject of subjects) {
    queue.add(async () => {
      const metadata = (await crawlSubjectMetadata(subject.id)) ?? {
        courseContent: null,
        learningGoals: null,
        studyLevel: null,
        taughtInAutumn: null,
        taughtInSpring: null,
        placeOfStudy: null,
      };
      await prisma.subject.update({
        where: { id: subject.id },
        data: {
          courseContent: metadata.courseContent,
          learningGoals: metadata.learningGoals,
          studyLevel: metadata.studyLevel,
          taughtInAutumn: metadata.taughtInAutumn,
          taughtInSpring: metadata.taughtInSpring,
          placeOfStudy: metadata.placeOfStudy,
        },
      });
    });
  }

  await queue.onIdle();
};
