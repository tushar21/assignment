-- CreateEnum
CREATE TYPE "Class" AS ENUM ('Math', 'Science', 'History');

-- CreateTable
CREATE TABLE "Grades" (
    "id" SERIAL NOT NULL,
    "class" "Class" NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "Grades_pkey" PRIMARY KEY ("id")
);
