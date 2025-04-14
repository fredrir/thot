import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Users, Star, Search } from "lucide-react"

import { SubjectCard } from "@/component/Home/SubjectCard"
import getPopularSubjects from "@/lib/actions/getPopularSubjects"
import { SearchBar } from "@/component/SearchBar"

export default async function Home() {
  const popularSubjects = await getPopularSubjects()

  return (
    <div className="space-y-16">
    
      
        <section className="relative z-10 py-20 px-4 sm:px-6 flex flex-col items-center text-center ">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl">Thot.no - Din komplette studenthub</h1>
          <p className="mt-6 text-lg sm:text-xl max-w-2xl">
            Finn emner, les anmeldelser og få innsikt i karakterfordelinger fra universiteter over hele Norge.
          </p>
          <div className="mt-8  flex flex-col w-full items-center mx-auto">
            <div className="flex w-full max-w-lg items-center space-x-2 bg-white rounded-md p-1">
              <SearchBar/>
            </div>
          </div>
        </section>
    

      <section className="container px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-12">Hvorfor bruke Thot.no?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Omfattende emnekatalog</h3>
            <p className="text-muted-foreground">
              Få tilgang til informasjon om tusenvis av emner fra universiteter og høyskoler over hele Norge.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Studentfellesskap</h3>
            <p className="text-muted-foreground">
              Koble til med medstudenter, del notater og samarbeid om oppgaver for å forbedre læringsopplevelsen.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Studentanmeldelser</h3>
            <p className="text-muted-foreground">
              Les ærlige anmeldelser fra tidligere studenter for å ta informerte valg om dine studier.
            </p>
          </div>
        </div>
      </section>

      <section className="container px-4 py-8 ">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Populære emner</h2>
          <Link href="/emner" className="flex items-center text-primary hover:underline">
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
