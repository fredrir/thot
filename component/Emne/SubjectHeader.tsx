import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SubjectHeaderProps {
  subject: {
    id: string
    name: string
    language: string
    level: string
    studyPoints: number
    department: {
      name: string
      faculty: {
        name: string
        university: {
          name: string
        }
      }
    }
  }
}

export function SubjectHeader({ subject }: SubjectHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">
          {subject.id} - {subject.name}
        </CardTitle>
        <CardDescription>
          {subject.department.name}, {subject.department.faculty.name}, {subject.department.faculty.university.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
            <p className="text-lg font-medium">{subject.language}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Level</h3>
            <p className="text-lg font-medium">{subject.level}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Study Points</h3>
            <p className="text-lg font-medium">{subject.studyPoints}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
