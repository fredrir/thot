import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Aliases {
  alias: string;
  id: Generated<string>;
  subjectId: string;
}

export interface Departments {
  facultyId: string;
  id: string;
  name: string;
}

export interface Faculties {
  id: string;
  name: string;
}

export interface Favorites {
  id: Generated<string>;
  subjectId: string;
  userId: string;
}

export interface Reviews {
  id: Generated<string>;
  message: string;
  subjectId: string;
  submissionDate: Generated<Timestamp>;
  userId: string;
}

export interface Subjects {
  courseContent: string | null;
  id: string;
  instituteId: string;
  language: string;
  learningForm: string | null;
  learningGoals: string | null;
  level: string;
  name: string;
  placeOfStudy: string | null;
  studyLevel: number | null;
  studyPoints: number;
  taughtInAutumn: boolean | null;
  taughtInSpring: boolean | null;
}

export interface SubjectSemesterGrades {
  gradeA: number | null;
  gradeB: number | null;
  gradeC: number | null;
  gradeD: number | null;
  gradeE: number | null;
  gradeF: number | null;
  gradeFail: number | null;
  gradePass: number | null;
  id: Generated<string>;
  participantsTotal: number;
  semester: number;
  subjectId: string;
  year: number;
}

export interface Users {
  id: Generated<string>;
  password: string;
  username: string;
}

export interface DB {
  aliases: Aliases;
  departments: Departments;
  faculties: Faculties;
  favorites: Favorites;
  reviews: Reviews;
  subjects: Subjects;
  subjectSemesterGrades: SubjectSemesterGrades;
  users: Users;
}
