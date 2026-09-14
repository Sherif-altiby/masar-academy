/*
  Warnings:

  - You are about to drop the column `is_free` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `subjects` table. All the data in the column will be lost.
  - Made the column `text` on table `quiz_options` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `quiz_questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "is_free" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "is_free";

-- AlterTable
ALTER TABLE "quiz_options" ALTER COLUMN "text" SET NOT NULL;

-- AlterTable
ALTER TABLE "quiz_questions" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "imageUrl",
ADD COLUMN     "image_url" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "quiz_options_question_id_idx" ON "quiz_options"("question_id");

-- CreateIndex
CREATE INDEX "quiz_questions_lesson_id_idx" ON "quiz_questions"("lesson_id");
