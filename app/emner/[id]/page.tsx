import { SearchFilters } from "@/components/EmnerPage/SearchFilters";
import { SubjectDetail } from "@/components/EmnerPage/SubjectDetail";
import prisma from "@/lib/db/db";
import { tParams } from "@/lib/types";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: tParams;
}): Promise<Metadata> {
  const { id } = await props.params;
  const itemTitle = decodeURIComponent(id)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    title: `${decodeURIComponent(itemTitle)}`,
  };
}

// export async function generateStaticParams() {
//   const emner = await prisma.subject.findMany({
//     select: { id: true },
//   });

//   return emner.map((emne) => ({
//     id: emne.id,
//   }));
// }

export default async function EmnePage(props: { params: tParams }) {
  const { id } = await props.params;
  const decodedSlug = decodeURIComponent(id);

  const universities = await prisma.university.findMany({
    include: {
      departments: true,
    },
  });

  return (
    <main className="min-h-screen bg-white">
      <header className="border-8 border-black bg-yellow-300 p-6">
        <h1 className="text-5xl font-black tracking-tighter">EMNER DATABASE</h1>
        <p className="mt-2 text-xl font-bold">
          Find and compare university courses
        </p>
      </header>

      <div className="flex flex-col md:flex-row">
        <SearchFilters universities={universities} />
        <SubjectDetail subjectId={decodedSlug} href />
      </div>
    </main>
  );
}
