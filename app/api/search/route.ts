import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
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
          { emnekode: { contains: query, mode: "insensitive" } },
          { emnenavn: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 20,
    });

    const formattedSubjects = subjects.map((subject) => {
      const institutionCode = subject.institusjonskode;
      const university = institutionMap[
        institutionCode as keyof typeof institutionMap
      ] || {
        name: subject.institusjonsnavn,
        color: "bg-gray-500",
      };

      return {
        id: subject.id,
        emnekode: subject.emnekode,
        emnenavn: subject.emnenavn,
        university: university,
        institutionName: subject.institusjonsnavn,
      };
    });

    return NextResponse.json({ subjects: formattedSubjects });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search subjects" },
      { status: 500 }
    );
  }
}
