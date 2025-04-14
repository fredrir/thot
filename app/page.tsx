import Link from "next/link"
import { ArrowRight} from "lucide-react"

import { SubjectCard } from "@/components/Home/SubjectCard"

import getPopularSubjects from "@/lib/actions/getPopularSubjects"
import { SearchBar } from "@/components/SearchBar"
import HeaderText from "@/components/All/HeaderText"


export default async function Home() {
  const popularSubjects = await getPopularSubjects()

  return (
    <div className="space-y-16 font-mono">
    <section className="relative z-10 py-20 px-4 sm:px-6 flex flex-col items-center text-center">
      <div className="absolute inset-0 -z-10 bg-[#ffde59] dark:bg-[#121212] skew-y-3 transform -rotate-1"></div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black max-w-4xl tracking-tight text-black dark:text-white 
        [text-shadow:4px_4px_0px_#ffcc80] dark:[text-shadow:4px_4px_0px_#00ff66]">
        Thot.no - Din komplette studenthub
      </h1>
      <p className="mt-6 text-lg sm:text-xl max-w-2xl font-bold bg-white dark:bg-black px-4 py-2 
        border-4 border-black dark:border-white rotate-1">
        Finn emner, les anmeldelser og få innsikt i karakterfordelinger fra universiteter over hele Norge.
      </p>
      <div className="mt-8 flex flex-col w-full items-center mx-auto">
        <div className="flex w-full max-w-lg items-center space-x-2 bg-white dark:bg-black 
          border-4 border-black dark:border-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]">
          <SearchBar />
        </div>
      </div>
    </section>

    <section className=" px-4 py-8 relative mx-auto container">
      
      <HeaderText className="mb-8">
        Hva er Thot.no?
      </HeaderText>

      <div className="flex flex-col text-lg">
        <p className="bg-white dark:bg-black p-6 
          border-4 border-black dark:border-white
          shadow-[8px_8px_0px_0px_rgba(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]
          font-medium">
          Thot.no har som mål å gjøre det enklere for studenter å navigere i emner og karakterer. 
          Vi gir deg tilgang til en omfattende database med emner, karakterfordelinger og anmeldelser 
          fra medstudenter. Uansett om du er ny student eller har vært på universitetet en stund, 
          vil Thot.no hjelpe deg med å ta informerte valg om emner og studieretninger.
        </p>
      </div>
    </section>

      <section className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <HeaderText>

            Populære emner
            </HeaderText>

          <Link
            href="/emner"
            className="flex items-center px-4 py-2 border-4 border-stone-800 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 hover:bg-stone-800 hover:text-stone-100 dark:hover:bg-stone-200 dark:hover:text-stone-800 transition-colors duration-300 font-bold uppercase text-sm"
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
  )
}
