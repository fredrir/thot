import { Badge } from "@/components/ui/badge";
import { Subject } from "@/lib/types";
import Link from "next/link";

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const getBgColor = () => {
    switch (subject.averageGrade) {
      case "A":
        return "bg-green-100";
      case "B":
        return "bg-green-50";
      case "C":
        return "bg-yellow-50";
      case "D":
        return "bg-orange-50";
      case "E":
        return "bg-red-50";
      default:
        return "bg-white";
    }
  };

  return (
    <Link
      className={`cursor-pointer border-4 border-black transition-transform hover:translate-x-1 hover:translate-y-1 ${getBgColor()}`}
      href={`/emner/${subject.id}`}
    >
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <Badge className="rounded-none bg-black px-2 py-0.5 font-bold text-white">
            {subject.universityName}
          </Badge>
          <Badge className="rounded-none border-2 border-black bg-yellow-300 px-2 py-0.5 font-bold text-black">
            {subject.studyPoints} SP
          </Badge>
        </div>

        <h3 className="mt-2 text-xl font-black">
          {subject.id} - {subject.name}
        </h3>

        <p className="text-sm font-medium">{subject.departmentName}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="text-sm">
            <span className="font-bold">Level:</span> {subject.level}
          </div>
          <div className="text-sm">
            <span className="font-bold">Language:</span> {subject.language}
          </div>

          <div className="text-sm">
            <span className="font-bold">Semester:</span>{" "}
            {subject.taughtInSpring && subject.taughtInAutumn
              ? "Spring/Autumn"
              : subject.taughtInSpring
                ? "Spring"
                : "Autumn"}
          </div>
        </div>

        <div className="mt-4 border-t-2 border-black pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold">Avg. Grade:</span>{" "}
              <span
                className={`font-mono text-lg font-bold ${
                  subject.averageGrade === "A" || subject.averageGrade === "B"
                    ? "text-green-600"
                    : subject.averageGrade === "C"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {subject.averageGrade}
              </span>
            </div>
            <div>
              <span className="font-bold">Fail Rate:</span>{" "}
              <span
                className={`font-mono font-bold ${
                  subject.failRate < 10
                    ? "text-green-600"
                    : subject.failRate < 20
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {subject.failRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
