import { NextResponse } from "next/server";
import prisma from "@/lib/db/db";
import { institutionMap } from "@/lib/utils/institutionMap";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ subjects: [] });
  }

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        OR: [
          { id: { contains: query, mode: "insensitive" } },
          { id: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        department: true,
      },
      take: 20,
    });

    const formattedSubjects = subjects.map((subject) => {
      const institutionCode = subject.department.universityId;
      const university = institutionMap[
        institutionCode as keyof typeof institutionMap
      ] || {
        name: "Ukjent",
        color: "bg-gray-500",
      };

      return {
        id: subject.id,
        emnekode: subject.id,
        emnenavn: subject.name,
        university: university,
      };
    });

    return NextResponse.json({ subjects: formattedSubjects });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search subjects" },
      { status: 500 },
    );
  }
}
