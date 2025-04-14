"use client";

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { institutionMap } from "@/lib/utils/institutionMap";

interface Props {
  emnekode?: string;
  emnenavn?: string;
  institusjonskode?: string;
  className?: string;
}

export function SubjectCard({
  emnekode,
  emnenavn,
  institusjonskode,
  className,
}: Props) {
  const instCode = Number.parseInt(institusjonskode || "");
  const institution = institutionMap[
    instCode as unknown as keyof typeof institutionMap
  ] || {
    name: "Ukjent",
    color: "earth-neutral",
  };

  return (
    <Link href={`/emner/${emnekode}`}>
      <Card
        className={cn(
          "group relative h-full cursor-pointer overflow-hidden border-4 border-stone-800 bg-stone-100 transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] dark:border-stone-600 dark:bg-stone-900 dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]",
          className,
        )}
      >
        <div className="absolute top-0 bottom-0 left-0 w-6 bg-amber-800 transition-colors duration-300 group-hover:bg-amber-900 dark:bg-amber-950 dark:group-hover:bg-amber-900" />

        <div className="absolute top-4 right-0 bottom-4 w-2 bg-gradient-to-l from-stone-300 to-transparent dark:from-stone-700" />

        <CardHeader className="relative pb-2 pl-10">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-black tracking-tight text-stone-800 uppercase dark:text-stone-200">
                {emnekode}
              </CardTitle>
              <div className="mt-2 mb-3 h-3 w-16 bg-stone-800 transition-all duration-300 group-hover:w-24 dark:bg-stone-400" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "border-4 border-stone-800 px-3 py-1 text-xs font-bold text-stone-800 uppercase transition-all duration-300 dark:border-stone-600 dark:text-stone-200",
                `group-hover:text-stone-600 dark:group-hover:text-stone-200`,
              )}
            >
              {institution.name}
            </Badge>
          </div>
          <CardDescription className="mt-2 line-clamp-2 h-12 text-base font-medium text-stone-800 dark:text-stone-300">
            {emnenavn}
          </CardDescription>
        </CardHeader>

        <CardFooter className="relative flex items-center justify-between pt-0 pb-4 pl-10">
          <div className="flex items-center text-sm font-bold text-stone-700 dark:text-stone-400">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span className="text-xs tracking-wide uppercase">
              Se karakterstatistikk
            </span>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 -translate-x-2 items-center justify-center rounded-none border-4 border-stone-800 bg-stone-100 text-stone-800 transition-all duration-300 group-hover:translate-x-0 group-hover:bg-stone-800 group-hover:text-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:group-hover:bg-stone-200 dark:group-hover:text-stone-800",
            )}
          >
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
