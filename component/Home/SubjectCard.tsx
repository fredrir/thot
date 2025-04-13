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
    instCode as keyof typeof institutionMap
  ] || {
    name: "Ukjent",
    color: "bg-gray-500",
  };

  const colorName = institution.color.replace("bg-", "");

  return (
    <Link href={`/emner/${emnekode}`}>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer h-full border-t-4 relative",

          className
        )}
      >
        <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 rounded-full bg-gradient-to-br from-transparent to-black/5 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 w-16 h-16 -mb-8 -ml-8 rounded-full bg-gradient-to-tr from-transparent to-black/5 group-hover:scale-110 transition-transform duration-500" />

        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {emnekode}
              </CardTitle>
              <div className="h-1 w-12 bg-black/10 mt-1 mb-2 rounded-full group-hover:w-20 transition-all duration-300" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "font-medium border-2 px-3 py-1 transition-all duration-300 ",
                ` group-hover:border-${colorName}`
              )}
            >
              {institution.name}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 h-12 text-base mt-2 font-medium">
            {emnenavn}
          </CardDescription>
        </CardHeader>

        <CardFooter className="pt-0 pb-4 flex justify-between items-center relative z-10">
          <div className="flex items-center text-sm text-muted-foreground">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Se karakterstatistikk</span>
          </div>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0",
              institution.color
            )}
          >
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
