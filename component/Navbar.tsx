"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, BookOpen, GraduationCap, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "./Theme/ThemeToggle"
import { SearchBar } from "./SearchBar"

const navLinks = [
  { href: "/emner", label: "Emner" },
  { href: "/om", label: "Om Thot" },
]

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
          : "bg-background/80"
      }`}
    >
      <div className="container mx-auto px-4 flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-all duration-300"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetTitle className="hidden"/>
          <SheetContent side="left" className="pr-0 border-r-amber-200 dark:border-r-amber-900/30">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2 rounded-lg shadow-md">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Thot
              </span>
            </div>
            <nav className="grid gap-6 text-lg font-medium">

        
              <Link
                href="/emner"
                className="flex items-center gap-2 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
              >
                <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/30 transition-colors">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span>Emner</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href="/om"
                className="flex items-center gap-2 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
              >
                <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/30 transition-colors">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span>Om Thot</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 mr-6 group">
          <div
            className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
              scrolled ? "bg-gradient-to-br from-amber-500 to-amber-700" : "bg-amber-600"
            } p-2 shadow-md group-hover:shadow-amber-300/30 dark:group-hover:shadow-amber-700/30`}
          >
            <GraduationCap className="h-6 w-6 text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </div>
          <span
            className={`hidden font-bold text-xl sm:inline-block transition-all duration-300 ${
              scrolled
                ? "bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent"
                : "text-amber-600 dark:text-amber-500"
            } group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-700 group-hover:bg-clip-text group-hover:text-transparent`}
          >
            Thot
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/emner"
            className="relative overflow-hidden py-1 transition-colors hover:text-amber-600 dark:hover:text-amber-400 group"
          >
            <span>Emner</span>
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-500 to-amber-700 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/om"
            className="relative overflow-hidden py-1 transition-colors hover:text-amber-600 dark:hover:text-amber-400 group"
          >
            <span>Om</span>
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-500 to-amber-700 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {searchOpen ? (
            <div className="relative animate-in fade-in slide-in-from-right-4 duration-300">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-all duration-300"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Søk</span>
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            className="ml-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white hidden sm:flex shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Logg inn
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
