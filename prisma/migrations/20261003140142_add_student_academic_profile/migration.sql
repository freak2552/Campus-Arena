-- CreateTable
CREATE TABLE "StudentAcademicProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "programmeId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAcademicProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentAcademicProfile_userId_key" ON "StudentAcademicProfile"("userId");

-- CreateIndex
CREATE INDEX "StudentAcademicProfile_departmentId_idx" ON "StudentAcademicProfile"("departmentId");

-- CreateIndex
CREATE INDEX "StudentAcademicProfile_programmeId_idx" ON "StudentAcademicProfile"("programmeId");

-- CreateIndex
CREATE INDEX "StudentAcademicProfile_semesterId_idx" ON "StudentAcademicProfile"("semesterId");

-- AddForeignKey
ALTER TABLE "StudentAcademicProfile" ADD CONSTRAINT "StudentAcademicProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAcademicProfile" ADD CONSTRAINT "StudentAcademicProfile_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAcademicProfile" ADD CONSTRAINT "StudentAcademicProfile_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAcademicProfile" ADD CONSTRAINT "StudentAcademicProfile_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;
