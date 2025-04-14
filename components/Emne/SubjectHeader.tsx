import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubjectHeaderProps {
  subject: {
    id: string;
    name: string;
    language: string;
    level: string;
    studyPoints: number;
    department: {
      name: string;
      university: {
        name: string;
      };
    };
  };
}

export function SubjectHeader({ subject }: SubjectHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">
          {subject.id} - {subject.name}
        </CardTitle>
        <CardDescription>
          {subject.department.name},, {subject.department.university.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Language
            </h3>
            <p className="text-lg font-medium">{subject.language}</p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">Level</h3>
            <p className="text-lg font-medium">{subject.level}</p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Study Points
            </h3>
            <p className="text-lg font-medium">{subject.studyPoints}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
