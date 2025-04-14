import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SubjectCard } from "@/components/Home/SubjectCard";

import getPopularSubjects from "@/lib/actions/getPopularSubjects";
import { SearchBar } from "@/components/SearchBar";
import HeaderText from "@/components/All/HeaderText";

export default async function Home() {
  const popularSubjects = await getPopularSubjects();

  return (
    <div className="space-y-16 font-mono">
      <section className="relative z-10 flex flex-col items-center px-4 py-20 text-center sm:px-6">
        <div className="absolute inset-0 -z-10 -rotate-1 skew-y-3 transform bg-[#ffde59] dark:bg-[#121212]"></div>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-black [text-shadow:4px_4px_0px_#ffcc80] sm:text-5xl md:text-6xl dark:text-white dark:[text-shadow:4px_4px_0px_#00ff66]">
          Thot.no - Din komplette studenthub
        </h1>
        <p className="mt-6 max-w-2xl rotate-1 border-4 border-black bg-white px-4 py-2 text-lg font-bold sm:text-xl dark:border-white dark:bg-black">
          Finn emner, les anmeldelser og få innsikt i karakterfordelinger fra
          universiteter over hele Norge.
        </p>
        <div className="mx-auto mt-8 flex w-full flex-col items-center">
          <div className="flex w-full max-w-lg items-center space-x-2 border-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0)] dark:border-white dark:bg-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-8">
        <HeaderText className="mb-8">Hva er Thot.no?</HeaderText>

        <div className="flex flex-col text-lg">
          <p className="border-4 border-black bg-white p-6 font-medium shadow-[8px_8px_0px_0px_rgba(0,0,0)] dark:border-white dark:bg-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]">
            Thot.no har som mål å gjøre det enklere for studenter å navigere i
            emner og karakterer. Vi gir deg tilgang til en omfattende database
            med emner, karakterfordelinger og anmeldelser fra medstudenter.
            Uansett om du er ny student eller har vært på universitetet en
            stund, vil Thot.no hjelpe deg med å ta informerte valg om emner og
            studieretninger.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <HeaderText>Populære emner</HeaderText>

          <Link
            href="/emner"
            className="flex items-center border-4 border-stone-800 bg-stone-100 px-4 py-2 text-sm font-bold uppercase transition-colors duration-300 hover:bg-stone-800 hover:text-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:hover:bg-stone-200 dark:hover:text-stone-800"
          >
            Se alle emner <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              emnekode={subject.id}
              emnenavn={subject.name}
              institusjonskode={subject.universityId}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
