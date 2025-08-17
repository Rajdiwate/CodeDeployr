/*
  Warnings:

  - The `version` column on the `Deployment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Deployment" DROP COLUMN "version",
ADD COLUMN     "version" SERIAL NOT NULL;
