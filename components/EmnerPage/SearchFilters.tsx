"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SearchFiltersProps {
  universities: {
    id: string;
    name: string;
    shortName: string;
    departments: {
      id: string;
      name: string;
    }[];
  }[];
}

export function SearchFilters({ universities }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [minGrade, setMinGrade] = useState<number>(1);
  const [maxFailRate, setMaxFailRate] = useState<number>(100);

  //Haven't found any course with more than 90 study points
  const [studyPoints, setStudyPoints] = useState<number[]>([0, 90]);

  const departments = selectedUniversity
    ? universities.find((u) => u.id === selectedUniversity)?.departments || []
    : [];

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) params.set("search", searchQuery);
    else params.delete("q");

    if (selectedUniversity) params.set("university", selectedUniversity);
    else params.delete("university");

    if (selectedDepartment) params.set("department", selectedDepartment);
    else params.delete("department");

    params.set("minGrade", minGrade.toString());
    params.set("maxFailRate", maxFailRate.toString());
    params.set("minPoints", studyPoints[0].toString());
    params.set("maxPoints", studyPoints[1].toString());

    router.push(`/emner?${params.toString()}`);
  };

  function renderFilters() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-lg font-bold">University</label>
          <Select
            value={selectedUniversity}
            onValueChange={setSelectedUniversity}
          >
            <SelectTrigger className="rounded-none border-4 border-black font-medium">
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-4 border-black">
              <SelectItem value="all">All Universities</SelectItem>
              {universities.map((uni) => (
                <SelectItem key={uni.id} value={uni.id}>
                  {uni.shortName} - {uni.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-lg font-bold">Department</label>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
            disabled={!selectedUniversity}
          >
            <SelectTrigger className="rounded-none border-4 border-black font-medium">
              <SelectValue
                placeholder={
                  selectedUniversity
                    ? "Select department"
                    : "Select university first"
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-none border-4 border-black">
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="grades" className="border-4 border-black">
            <AccordionTrigger className="px-4 py-2 text-lg font-bold">
              Grade Statistics
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-bold">Minimum Average Grade</label>
                    <span className="font-mono font-bold">
                      {getGradeLetter(minGrade)}
                    </span>
                  </div>
                  <Slider
                    value={[minGrade]}
                    min={1}
                    max={6}
                    step={1}
                    onValueChange={(value) => setMinGrade(value[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>F</span>
                    <span>E</span>
                    <span>D</span>
                    <span>C</span>
                    <span>B</span>
                    <span>A</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-bold">Max Fail Rate</label>
                    <span className="font-mono font-bold">{maxFailRate}%</span>
                  </div>
                  <Slider
                    value={[maxFailRate]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setMaxFailRate(value[0])}
                    className="py-4"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="studypoints"
            className="mt-4 border-4 border-black"
          >
            <AccordionTrigger className="px-4 py-2 text-lg font-bold">
              Study Points
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="font-bold">Range</label>
                  <span className="font-mono font-bold">
                    {studyPoints[0]} - {studyPoints[1]}
                  </span>
                </div>
                <Slider
                  value={studyPoints}
                  min={0}
                  max={30}
                  step={2.5}
                  onValueChange={setStudyPoints}
                  className="py-4"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="semester"
            className="mt-4 border-4 border-black"
          >
            <AccordionTrigger className="px-4 py-2 text-lg font-bold">
              Semester
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="rounded-none border-4 border-black font-bold hover:bg-yellow-300"
                >
                  Spring
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none border-4 border-black font-bold hover:bg-yellow-300"
                >
                  Autumn
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="w-full border-x-8 border-b-8 border-black bg-white p-4 md:w-80">
      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-none border-4 border-black font-bold"
        />
        <Button
          onClick={handleSearch}
          className="rounded-none border-4 border-black bg-black text-white hover:bg-gray-800"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <Collapsible
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        className="mb-4 md:hidden"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="flex w-full items-center justify-between rounded-none border-4 border-black font-bold"
          >
            Filters
            <SlidersHorizontal className="ml-2 h-5 w-5" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          {renderFilters()}
        </CollapsibleContent>
      </Collapsible>

      <div className="hidden md:block">{renderFilters()}</div>

      <Button
        onClick={handleSearch}
        className="mt-6 w-full rounded-none border-4 border-black bg-yellow-300 font-bold text-black hover:bg-yellow-400"
      >
        Apply Filters
      </Button>
    </div>
  );
}

function getGradeLetter(value: number): string {
  const grades = ["F", "E", "D", "C", "B", "A"];
  return grades[value - 1] || "?";
}
