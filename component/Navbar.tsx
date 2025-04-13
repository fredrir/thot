"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./Theme/ThemeToggle";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="flex items-center gap-2 mb-8">
              <GraduationCap className="h-6 w-6 text-amber-600" />
              <span className="font-bold text-xl">Thot</span>
            </div>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/emner"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                Emner
              </Link>

              <Link
                href="/om"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <GraduationCap className="h-5 w-5" />
                Om Thot
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 mr-6">
          <GraduationCap className="h-6 w-6 text-amber-600" />
          <span className="hidden font-bold text-xl sm:inline-block">Thot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/emner"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Emner
          </Link>

          <Link
            href="/om"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Om
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {searchOpen ? (
            <div className="relative animate-in fade-in slide-in-from-top-4 duration-300">
              <Input
                type="search"
                placeholder="Søk etter emner..."
                className="w-[200px] sm:w-[300px] pr-8 focus-visible:ring-amber-500"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Lukk søk</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Søk</span>
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            className="ml-2 bg-amber-600 hover:bg-amber-700 text-white hidden sm:flex"
          >
            Logg inn
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
