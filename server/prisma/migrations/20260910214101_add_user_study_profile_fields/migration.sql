-- CreateEnum
CREATE TYPE "StudyLanguage" AS ENUM ('AR', 'EN');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('PREPARATORY', 'SECONDARY', 'BACCALAUREATE');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('PREP_1', 'PREP_2', 'PREP_3', 'SEC_1', 'SEC_2', 'SEC_3_MATH', 'SEC_3_SCIENCE', 'SEC_3_LITERATURE', 'BAC_1', 'BAC_2_ENGINEERING_CS', 'BAC_2_MEDICINE_LIFE', 'BAC_2_BUSINESS', 'BAC_2_ARTS');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "education_level" "EducationLevel",
ADD COLUMN     "grade" "Grade",
ADD COLUMN     "study_language" "StudyLanguage";
