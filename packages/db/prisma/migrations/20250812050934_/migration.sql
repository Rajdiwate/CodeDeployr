/*
  Warnings:

  - A unique constraint covering the columns `[githubRepoUrl]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_githubRepoUrl_key" ON "public"."Project"("githubRepoUrl");
