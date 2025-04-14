"use client"

import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { institutionMap } from "@/lib/utils/institutionMap"

interface Props {
  emnekode?: string
  emnenavn?: string
  institusjonskode?: string
  className?: string
}

export function SubjectCard({ emnekode, emnenavn, institusjonskode, className }: Props) {
  const instCode = Number.parseInt(institusjonskode || "")
  const institution = institutionMap[instCode as unknown as keyof typeof institutionMap] || {
    name: "Ukjent",
    color: "earth-neutral",
  }

  return (
    <Link href={`/emner/${emnekode}`}>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:-translate-x-1 group cursor-pointer h-full border-4 border-stone-800 dark:border-stone-600 relative bg-stone-100 dark:bg-stone-900",
          className,
        )}
      >
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-amber-800 dark:bg-amber-950 group-hover:bg-amber-900 dark:group-hover:bg-amber-900 transition-colors duration-300" />

        <div className="absolute right-0 top-4 bottom-4 w-2 bg-gradient-to-l from-stone-300 to-transparent dark:from-stone-700" />

        <CardHeader className="pb-2 relative z-10 pl-10">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-black tracking-tight uppercase text-stone-800 dark:text-stone-200">
                {emnekode}
              </CardTitle>
              <div className="h-3 w-16 bg-stone-800 dark:bg-stone-400 mt-2 mb-3 group-hover:w-24 transition-all duration-300" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "font-bold border-4 border-stone-800 dark:border-stone-600 px-3 py-1 transition-all duration-300 uppercase text-xs text-stone-800 dark:text-stone-200",
                ` group-hover:text-stone-600 dark:group-hover:text-stone-200`,
              )}
            >
              {institution.name}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 h-12 text-base mt-2 font-medium text-stone-800 dark:text-stone-300">
            {emnenavn}
          </CardDescription>
        </CardHeader>

        <CardFooter className="pt-0 pb-4 flex justify-between items-center relative z-10 pl-10">
          <div className="flex items-center text-sm font-bold text-stone-700 dark:text-stone-400">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span className="uppercase text-xs tracking-wide">Se karakterstatistikk</span>
          </div>
          <div
            className={cn(
              "w-10 h-10 rounded-none flex items-center justify-center border-4 border-stone-800 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 group-hover:bg-stone-800 dark:group-hover:bg-stone-200 group-hover:text-stone-100 dark:group-hover:text-stone-800 transition-all duration-300 -translate-x-2 group-hover:translate-x-0",
            )}
          >
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </CardFooter>

        {/* Book texture overlay */}
        <div className="absolute inset-0 bg-[url('/aged-parchment.png')] opacity-20 dark:opacity-10 pointer-events-none mix-blend-overlay" />
      </Card>
    </Link>
  )
}
