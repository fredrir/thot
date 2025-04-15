import { SearchFilters } from "@/components/EmnerPage/SearchFilters";
import { SubjectList } from "@/components/EmnerPage/SubjectList";
import prisma from "@/lib/db/db";
import { Suspense } from "react";

export default async function EmnerPage() {
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
        <Suspense
          fallback={
            <div className="w-full border-x-8 border-b-8 border-black bg-white p-4 md:w-80">
              Loading filters...
            </div>
          }
        >
          <SearchFilters universities={universities} />
        </Suspense>
        <SubjectList />
      </div>
    </main>
  );
}
