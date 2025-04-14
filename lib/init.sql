START TRANSACTION;

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

CREATE TABLE IF NOT EXISTS faculties
(
    id   TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS departments
(
    id         TEXT PRIMARY KEY,
    faculty_id TEXT NOT NULL,
    name       TEXT NOT NULL,

    CONSTRAINT fk_faculty_id FOREIGN KEY (faculty_id) REFERENCES faculties (id)
);

CREATE TABLE IF NOT EXISTS subjects
(
    id           TEXT PRIMARY KEY,
    institute_id TEXT  NOT NULL,
    name         TEXT  NOT NULL,
    language     TEXT  NOT NULL,
    level        TEXT  NOT NULL,
    study_points FLOAT NOT NULL,

    course_content TEXT,
    learning_goals TEXT,
    learning_form TEXT,
    study_level INTEGER,
    place_of_study TEXT,
    taught_in_spring BOOLEAN,
    taught_in_autumn BOOLEAN,

    CONSTRAINT fk_institute_id FOREIGN KEY (institute_id) REFERENCES departments (id)
);

CREATE TABLE IF NOT EXISTS subject_semester_grades
(
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id         TEXT    NOT NULL,
    year               INTEGER NOT NULL,
    semester           INTEGER NOT NULL,
    grade_a            INTEGER          DEFAULT NULL,
    grade_b            INTEGER          DEFAULT NULL,
    grade_c            INTEGER          DEFAULT NULL,
    grade_d            INTEGER          DEFAULT NULL,
    grade_e            INTEGER          DEFAULT NULL,
    grade_f            INTEGER          DEFAULT NULL,
    grade_pass         INTEGER          DEFAULT NULL,
    grade_fail         INTEGER          DEFAULT NULL,
    participants_total INTEGER NOT NULL,

    CONSTRAINT fk_subject_id FOREIGN KEY (subject_id) REFERENCES subjects (id)
);

CREATE TABLE IF NOT EXISTS users
(
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    password TEXT NOT NULL,

    CONSTRAINT unique_username UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS aliases
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL,
    alias      TEXT NOT NULL,

    CONSTRAINT fk_subject_id FOREIGN KEY (subject_id) REFERENCES subjects (id)
);

CREATE TABLE IF NOT EXISTS favorites
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL,
    subject_id TEXT NOT NULL,

    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_subject_id FOREIGN KEY (subject_id) REFERENCES subjects (id)
);

CREATE TABLE IF NOT EXISTS reviews
(
    id              UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL,
    subject_id      TEXT        NOT NULL,
    message         TEXT        NOT NULL,
    submission_date TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_subject_id FOREIGN KEY (subject_id) REFERENCES subjects (id)
);

COMMIT;