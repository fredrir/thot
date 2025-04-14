import { ClientWrapper } from "@/component/Emne/ClientWrapper"
import { GradeStatisticsCards } from "@/component/Emne/GradeStatisticsCards"
import { GradeTimelineChart } from "@/component/Emne/GradeTimelineChart"
import { SubjectHeader } from "@/component/Emne/SubjectHeader"
import { prisma } from "@/lib/db/db"
import type { Metadata } from "next"



export async function generateMetadata(props: {
  params: { id: string }
}): Promise<Metadata> {
  const { id } = props.params
  const itemTitle = decodeURIComponent(id)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  return {
    title: `${decodeURIComponent(itemTitle)}`,
  }
}

export async function generateStaticParams() {
  const emner = await prisma.subject.findMany({
    select: { id: true },
  })

  return emner.map((emne) => ({
    id: emne.id,
  }))
}

export default async function EmnePage(props: { params: { id: string } }) {
  const { id } = props.params
  const decodedSlug = decodeURIComponent(id)

  const emne = await prisma.subject.findUnique({
    where: {
      id: decodedSlug,
    },
    include: {
      department: {
        include: {
          faculty: {
            include: {
              university: true,
            },
          },
        },
      },
      grades: true,
    },
  })

  if (!emne) {
    return <div>Subject not found</div>
  }

  // Get the most recent semester for initial selection
  const sortedGrades = [...emne.grades].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.semester - a.semester
  })

  const initialSemester = sortedGrades.length > 0 ? `${sortedGrades[0].year}-${sortedGrades[0].semester}` : ""

  return (
    <main className="container py-6">
      <SubjectHeader subject={emne} />

      <div className="grid gap-4 md:grid-cols-4">
        <GradeStatisticsCards grades={emne.grades} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ClientWrapper grades={emne.grades} initialSemester={initialSemester} />
      </div>

      <div className="mt-6">
        <GradeTimelineChart grades={emne.grades} />
      </div>
    </main>
  )
}
