"use client"

import { useState } from "react"
import { GradeDistributionChart } from "./GradeDistributionChart"



interface ClientWrapperProps {
  grades: Array<{
    id: string
    year: number
    semester: number
    gradeA?: number | null
    gradeB?: number | null
    gradeC?: number | null
    gradeD?: number | null
    gradeE?: number | null
    gradeF?: number | null
    gradePass?: number | null
    gradeFail?: number | null
    participantsTotal: number
  }>
  initialSemester: string
}

export function ClientWrapper({ grades, initialSemester }: ClientWrapperProps) {
  const [selectedSemester, setSelectedSemester] = useState(initialSemester)

  return (
    <GradeDistributionChart
      grades={grades}
      selectedSemester={selectedSemester}
      onSemesterChange={setSelectedSemester}
    />
  )
}
