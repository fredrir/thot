import Link from "next/link"
import { ArrowRight, BookOpen, Users, Star } from "lucide-react"

import { SubjectCard } from "@/components/Home/SubjectCard"

import getPopularSubjects from "@/lib/actions/getPopularSubjects"
import { SearchBar } from "@/components/SearchBar"


export default async function Home() {
  const popularSubjects = await getPopularSubjects()

  return (
    <div className="space-y-16">
      <section className="relative z-10 py-20 px-4 sm:px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl">Thot.no - Din komplette studenthub</h1>
        <p className="mt-6 text-lg sm:text-xl max-w-2xl">
          Finn emner, les anmeldelser og få innsikt i karakterfordelinger fra universiteter over hele Norge.
        </p>
        <div className="mt-8 flex flex-col w-full items-center mx-auto">
          <div className="flex w-full max-w-lg items-center space-x-2 bg-white dark:bg-stone-800 rounded-md p-1">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container px-4 py-8">
        <div className="flex flex-col mb-12">
          <h2 className="text-3xl font-black uppercase text-stone-800 dark:text-stone-200">Hvorfor bruke Thot.no?</h2>
          <div className="h-2 w-24 bg-stone-800 dark:bg-stone-400 mt-3" />
        </div>

        <div className="flex flex-col text-lg">


          <p >
            Thot.no har som mål å gjøre det enklere for studenter å navigere i emner og karakterer. Vi gir deg tilgang til en omfattende database med emner, karakterfordelinger og anmeldelser fra medstudenter. Uansett om du er ny student eller har vært på universitetet en stund, vil Thot.no hjelpe deg med å ta informerte valg om emner og studieretninger.
          </p>
          
        </div>
      </section>

      <section className="container px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black uppercase text-stone-800 dark:text-stone-200">Populære emner</h2>
            <div className="h-2 w-16 bg-stone-800 dark:bg-stone-400 mt-2" />
          </div>

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
              institusjonskode={subject.department?.faculty.universityId}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
