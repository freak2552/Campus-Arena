/*
  Warnings:

  - You are about to drop the column `semesterId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_semesterId_fkey";

-- DropIndex
DROP INDEX "Course_semesterId_idx";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "semesterId",
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CourseProgramme" (
    "courseId" INTEGER NOT NULL,
    "programmeId" INTEGER NOT NULL,

    CONSTRAINT "CourseProgramme_pkey" PRIMARY KEY ("courseId","programmeId")
);

-- CreateTable
CREATE TABLE "CourseSemester" (
    "courseId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,

    CONSTRAINT "CourseSemester_pkey" PRIMARY KEY ("courseId","semesterId")
);

-- CreateIndex
CREATE INDEX "CourseProgramme_programmeId_idx" ON "CourseProgramme"("programmeId");

-- CreateIndex
CREATE INDEX "CourseSemester_semesterId_idx" ON "CourseSemester"("semesterId");

-- CreateIndex
CREATE INDEX "Course_departmentId_idx" ON "Course"("departmentId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgramme" ADD CONSTRAINT "CourseProgramme_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgramme" ADD CONSTRAINT "CourseProgramme_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSemester" ADD CONSTRAINT "CourseSemester_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSemester" ADD CONSTRAINT "CourseSemester_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
