/*
  Warnings:

  - Added the required column `thumbnail_url` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar_url` to the `teacher_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "thumbnail_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teacher_profiles" ADD COLUMN     "avatar_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT;
