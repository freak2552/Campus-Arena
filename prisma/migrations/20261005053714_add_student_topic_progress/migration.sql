-- CreateTable
CREATE TABLE "StudentTopicProgress" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentTopicProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentTopicProgress_topicId_idx" ON "StudentTopicProgress"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTopicProgress_studentId_topicId_key" ON "StudentTopicProgress"("studentId", "topicId");

-- AddForeignKey
ALTER TABLE "StudentTopicProgress" ADD CONSTRAINT "StudentTopicProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTopicProgress" ADD CONSTRAINT "StudentTopicProgress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
