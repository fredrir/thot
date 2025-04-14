"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/lib/hooks/useDebounce"

type Subject = {
  id: number
  emnekode: string
  emnenavn: string
  university: {
    name: string
    color: string
  }

}

export function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(debouncedQuery)}`)
        const data = await response.json()
        setResults(data.subjects || [])
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  const handleSubjectClick = (emnekode: string) => {
    router.push(`/emner/${emnekode}`)
    if (onClose) onClose()
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            ref={inputRef}
            type="search"
            placeholder="Søk etter emnekode..."
            className="w-full pl-10 pr-8 focus-visible:ring-amber-500 border-amber-200 dark:border-amber-800/30 shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full text-muted-foreground hover:text-amber-600"
              onClick={() => {
                setQuery("")
                setResults([])
                if (inputRef.current) inputRef.current.focus()
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Tøm søk</span>
            </Button>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-md border border-amber-200 dark:border-amber-800/30 bg-background shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="py-2">
            {results.map((subject) => (
              <li
                key={subject.id}
                className="cursor-pointer px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
                onClick={() => handleSubjectClick(subject.emnekode)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{subject.emnekode}</div>
                    <div className="text-sm text-muted-foreground">{subject.emnenavn}</div>
                  </div>
                  <div className={`${subject.university.color} text-white text-xs px-2 py-1 rounded-md shadow-sm`}>
                    {subject.university.name}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-amber-200 dark:border-amber-800/30 bg-background p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
            <span className="ml-2 text-amber-700 dark:text-amber-400">Søker...</span>
          </div>
        </div>
      )}

      {!isLoading && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-amber-200 dark:border-amber-800/30 bg-background p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-center text-muted-foreground">Ingen emner funnet</p>
        </div>
      )}
    </div>
  )
}
