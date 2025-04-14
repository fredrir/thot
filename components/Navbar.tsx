"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  BookOpen,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./Theme/ThemeToggle";
import { SearchBar } from "./SearchBar";
import Image from "next/image";

const navLinks = [
  { href: "/emner", label: "Emner", icon: BookOpen },
  { href: "/om", label: "Om Thot", icon: GraduationCap },
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b shadow-md backdrop-blur"
          : "bg-background/80"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 transition-all duration-300 hover:bg-amber-100 hover:text-amber-600 md:hidden dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetTitle className="hidden" />
          <SheetContent
            side="left"
            className="border-r-amber-200 pr-0 dark:border-r-amber-900/30"
          >
            <div className="mb-8 flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 p-2 shadow-md">
                <Image
                  src={"/thot.svg"}
                  alt="Thot"
                  width={125}
                  height={125}
                  className="h-6 w-6"
                />
              </div>
              <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-xl font-bold text-transparent">
                Thot
              </span>
            </div>

            <nav className="grid gap-6 text-lg font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/emner/${link.href}`}
                  className="text-muted-foreground group flex items-center gap-2 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <div className="rounded-md bg-amber-100 p-2 text-amber-600 transition-colors group-hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:group-hover:bg-amber-900/30">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span>{link.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="group mr-6 flex items-center gap-2">
          <div
            className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
              scrolled
                ? "bg-gradient-to-br from-amber-500 to-amber-700"
                : "bg-amber-600"
            } p-2 shadow-md group-hover:shadow-amber-300/30 dark:group-hover:shadow-amber-700/30`}
          >
            <Image
              src={"/thot.svg"}
              alt="Thot"
              width={125}
              height={125}
              className="relative z-10 h-6 w-6"
            />
            <div className="absolute inset-0 translate-y-full bg-gradient-to-r from-amber-400 to-amber-600 transition-transform duration-300 ease-out group-hover:translate-y-0"></div>
          </div>
          <span
            className={`hidden text-xl font-bold transition-all duration-300 sm:inline-block ${
              scrolled
                ? "bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent"
                : "text-amber-600 dark:text-amber-500"
            } group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-700 group-hover:bg-clip-text group-hover:text-transparent`}
          >
            Thot
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/emner/${link.href}`}
              className="group relative overflow-hidden py-1 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-500 to-amber-700 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {searchOpen ? (
            <div className="animate-in fade-in slide-in-from-right-4 relative duration-300">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="transition-all duration-300 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Søk</span>
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            className="ml-2 hidden bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-amber-800 hover:shadow-lg sm:flex"
          >
            Logg inn
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
