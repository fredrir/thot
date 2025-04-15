"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SubjectCard } from "./SubjectCard";
import type { Subject } from "@/lib/types";
import getSubjects from "@/lib/actions/getSubjects";

export function SubjectList() {
  const searchParams = useSearchParams();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"name" | "grade" | "points">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);

      try {
        const search = searchParams.get("search") || "";
        const department = searchParams.get("department") || "";
        const university = searchParams.get("university") || "";
        const language = searchParams.get("language") || "";
        const level = searchParams.get("level") || "";

        const result = await getSubjects({
          page,
          sortBy,
          sortOrder,
          search,
          department,
          university,
          language,
          level,
        });

        setSubjects(result.subjects);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [searchParams, page, sortBy, sortOrder]);

  const handleSort = (field: "name" | "grade" | "points") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="mb-6">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <h2 className="text-3xl font-black tracking-tight">COURSES</h2>
          <div className="flex w-full flex-col items-start gap-2 sm:w-fit sm:flex-row sm:items-center">
            <span className="font-bold">Sort by:</span>
            <Button
              variant="outline"
              onClick={() => handleSort("name")}
              className={`w-full rounded-none border-4 border-black font-bold sm:w-fit ${
                sortBy === "name"
                  ? "bg-yellow-300 hover:bg-yellow-400"
                  : "hover:bg-gray-100"
              }`}
            >
              Name
              {sortBy === "name" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ))}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSort("grade")}
              className={`w-full rounded-none border-4 border-black font-bold sm:w-fit ${
                sortBy === "grade"
                  ? "bg-yellow-300 hover:bg-yellow-400"
                  : "hover:bg-gray-100"
              }`}
            >
              Grade
              {sortBy === "grade" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ))}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSort("points")}
              className={`w-full rounded-none border-4 border-black font-bold sm:w-fit ${
                sortBy === "points"
                  ? "bg-yellow-300 hover:bg-yellow-400"
                  : "hover:bg-gray-100"
              }`}
            >
              Points
              {sortBy === "points" &&
                (sortOrder === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ))}
            </Button>
          </div>
        </div>
        <div className="mt-2 text-lg">
          Showing <span className="font-bold">{subjects.length}</span> of{" "}
          <span className="font-bold">{totalCount}</span> results
        </div>
      </div>

      {loading ? (
        <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-64 border-4 border-black bg-gray-200"
            ></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded-none border-4 border-black font-bold"
              >
                <ChevronLeft className="h-5 w-5" />
                Prev
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => {
                if (
                  totalPages <= 7 ||
                  i === 0 ||
                  i === totalPages - 1 ||
                  (i >= page - 2 && i <= page + 2)
                ) {
                  return (
                    <Button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      variant={page === i + 1 ? "default" : "outline"}
                      className={`rounded-none border-4 border-black font-bold ${
                        page === i + 1
                          ? "bg-yellow-300 text-black hover:bg-yellow-400"
                          : ""
                      }`}
                    >
                      {i + 1}
                    </Button>
                  );
                } else if (
                  (i === page - 3 && page > 3) ||
                  (i === page + 3 && page < totalPages - 3)
                ) {
                  return <span key={i}>...</span>;
                }
                return null;
              })}

              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="rounded-none border-4 border-black font-bold"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
