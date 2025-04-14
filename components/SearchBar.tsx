"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

type Subject = {
  id: number;
  emnekode: string;
  emnenavn: string;
  university: {
    name: string;
    color: string;
  };
};

export function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(debouncedQuery)}`,
        );
        const data = await response.json();
        setResults(data.subjects || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSubjectClick = (emnekode: string) => {
    router.push(`/emner/${emnekode}`);
    if (onClose) onClose();
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <div className="relative w-full">
          <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
            <Search className="h-4 w-4" />
          </div>
          <Input
            ref={inputRef}
            type="search"
            placeholder="Søk etter emnekode..."
            className="w-full border-amber-200 pr-8 pl-10 shadow-sm focus-visible:ring-amber-500 dark:border-amber-800/30"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground absolute top-0 right-0 h-full hover:text-amber-600"
              onClick={() => {
                setQuery("");
                setResults([]);
                if (inputRef.current) inputRef.current.focus();
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Tøm søk</span>
            </Button>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-background animate-in fade-in slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-md border border-amber-200 shadow-lg duration-200 dark:border-amber-800/30">
          <ul className="py-2">
            {results.map((subject) => (
              <li
                key={subject.id}
                className="cursor-pointer px-4 py-2 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/10"
                onClick={() => handleSubjectClick(subject.emnekode)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{subject.emnekode}</div>
                    <div className="text-muted-foreground text-sm">
                      {subject.emnenavn}
                    </div>
                  </div>
                  <div
                    className={`${subject.university.color} rounded-md px-2 py-1 text-xs text-white shadow-sm`}
                  >
                    {subject.university.name}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && query.length >= 2 && (
        <div className="bg-background animate-in fade-in slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-1 rounded-md border border-amber-200 p-4 shadow-lg duration-200 dark:border-amber-800/30">
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
            <span className="ml-2 text-amber-700 dark:text-amber-400">
              Søker...
            </span>
          </div>
        </div>
      )}

      {!isLoading && query.length >= 2 && results.length === 0 && (
        <div className="bg-background animate-in fade-in slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-1 rounded-md border border-amber-200 p-4 shadow-lg duration-200 dark:border-amber-800/30">
          <p className="text-muted-foreground text-center">
            Ingen emner funnet
          </p>
        </div>
      )}
    </div>
  );
}
