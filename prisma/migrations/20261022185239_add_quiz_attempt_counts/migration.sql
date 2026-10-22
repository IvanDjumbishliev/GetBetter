/*
  Warnings:

  - Added the required column `correctCount` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCount` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "correctCount" INTEGER NOT NULL,
ADD COLUMN     "totalCount" INTEGER NOT NULL;
