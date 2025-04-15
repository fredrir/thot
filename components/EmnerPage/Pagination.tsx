"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  totalPages,
  initialPage = 1,
  onPageChange,
}: PaginationProps) {
  const [page, setPage] = useState(initialPage);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 px-2">
      <Button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="rounded-none border-4 border-black bg-white font-bold text-black transition-transform hover:translate-y-[-4px] hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className={isMobile ? "sr-only" : "ml-1"}>Prev</span>
      </Button>

      {Array.from({ length: totalPages }).map((_, i) => {
        // Show fewer pages on mobile
        const visibleRange = isMobile ? 1 : 2;

        if (
          totalPages <= (isMobile ? 5 : 7) ||
          i === 0 ||
          i === totalPages - 1 ||
          (i >= page - visibleRange && i <= page + visibleRange)
        ) {
          return (
            <Button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              variant="outline"
              className={`min-w-10 rounded-none border-4 border-black font-bold transition-transform hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                page === i + 1
                  ? "bg-yellow-300 text-black hover:bg-yellow-300"
                  : "bg-white text-black hover:bg-white"
              }`}
            >
              {i + 1}
            </Button>
          );
        } else if (
          (i === page - (isMobile ? 2 : 3) && page > (isMobile ? 2 : 3)) ||
          (i === page + (isMobile ? 2 : 3) &&
            page < totalPages - (isMobile ? 2 : 3))
        ) {
          return (
            <span key={i} className="px-1 font-bold">
              ...
            </span>
          );
        }
        return null;
      })}

      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-none border-4 border-black bg-white font-bold text-black transition-transform hover:translate-y-[-4px] hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <span className={isMobile ? "sr-only" : "mr-1"}>Next</span>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
