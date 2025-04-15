import { SearchFilters } from "@/components/EmnerPage/SearchFilters";
import { SubjectList } from "@/components/EmnerPage/SubjectList";
import prisma from "@/lib/db/db";

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
        <SearchFilters universities={universities} />
        <SubjectList />
      </div>
    </main>
  );
}
