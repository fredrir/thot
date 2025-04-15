export type tParams = Promise<{ id: string }>;

export type Subject = {
  id: string;
  name: string;
  universityName: string;
  departmentName: string;
  studyPoints: number;
  language: string;
  level: string;
  averageGrade: string;
  failRate: number;
  taughtInSpring: boolean;
  taughtInAutumn: boolean;
};

export type Grade = {
  gradeA: number | null;
  gradeB: number | null;
  gradeC: number | null;
  gradeD: number | null;
  gradeE: number | null;
  gradeF: number | null;
  participantsTotal: number;
};
