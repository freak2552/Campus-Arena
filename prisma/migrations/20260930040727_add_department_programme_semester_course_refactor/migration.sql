/*
  Warnings:

  - You are about to drop the column `department` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `Course` table. All the data in the column will be lost.
  - Added the required column `semesterId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- Clear existing courses so we can add the NOT NULL semesterId column safely
-- (dev data only — Course.department/semester TEXT columns are being replaced by the FK)
DELETE FROM "Course";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "department",
DROP COLUMN "semester",
ADD COLUMN     "semesterId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "programmeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Department_collegeId_idx" ON "Department"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_collegeId_name_key" ON "Department"("collegeId", "name");

-- CreateIndex
CREATE INDEX "Programme_departmentId_idx" ON "Programme"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_departmentId_name_key" ON "Programme"("departmentId", "name");

-- CreateIndex
CREATE INDEX "Semester_programmeId_idx" ON "Semester"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_programmeId_number_key" ON "Semester"("programmeId", "number");

-- CreateIndex
CREATE INDEX "Course_semesterId_idx" ON "Course"("semesterId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
