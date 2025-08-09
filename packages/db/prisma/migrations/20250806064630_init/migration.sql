-- CreateEnum
CREATE TYPE "public"."ProjectType" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'STATIC');

-- CreateEnum
CREATE TYPE "public"."Framework" AS ENUM ('NEXTJS', 'REACT', 'VUE', 'ANGULAR', 'SVELTE', 'NODEJS', 'EXPRESS', 'FASTIFY', 'PYTHON', 'DJANGO', 'FLASK', 'STATIC_HTML', 'GATSBY', 'NUXT');

-- CreateEnum
CREATE TYPE "public"."DeploymentStatus" AS ENUM ('PENDING', 'CLONING', 'BUILDING', 'PUSHING', 'DEPLOYING', 'DEPLOYED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."DeploymentType" AS ENUM ('MANUAL', 'AUTO_GITHUB_PUSH', 'AUTO_GITHUB_PR');

-- CreateEnum
CREATE TYPE "public"."PodStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'UNKNOWN', 'TERMINATING');

-- CreateEnum
CREATE TYPE "public"."LogLevel" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL');

-- CreateEnum
CREATE TYPE "public"."LogSource" AS ENUM ('BUILD', 'DEPLOY', 'RUNTIME', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."K8sResourceType" AS ENUM ('DEPLOYMENT', 'SERVICE', 'INGRESS', 'POD', 'CONFIGMAP', 'SECRET', 'PVC');

-- CreateEnum
CREATE TYPE "public"."S3ObjectType" AS ENUM ('SOURCE_CODE', 'BUILD_ARTIFACTS', 'BUILD_LOGS', 'DOCKER_BUILD_CONTEXT', 'BACKUP');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "githubId" TEXT,
    "githubUsername" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "githubRepoUrl" TEXT NOT NULL,
    "githubRepoName" TEXT NOT NULL,
    "githubBranch" TEXT NOT NULL DEFAULT 'main',
    "githubWebhookId" TEXT,
    "projectType" "public"."ProjectType" NOT NULL,
    "framework" "public"."Framework",
    "buildCommand" TEXT,
    "outputDirectory" TEXT,
    "installCommand" TEXT DEFAULT 'npm install',
    "startCommand" TEXT,
    "subdomain" TEXT NOT NULL,
    "customDomain" TEXT,
    "sourceCodePath" TEXT,
    "buildArtifactsPath" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EnvVariable" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnvVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deployment" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "commitHash" TEXT NOT NULL,
    "commitMessage" TEXT,
    "branch" TEXT NOT NULL,
    "status" "public"."DeploymentStatus" NOT NULL DEFAULT 'PENDING',
    "deploymentType" "public"."DeploymentType" NOT NULL DEFAULT 'MANUAL',
    "buildStartedAt" TIMESTAMP(3),
    "buildCompletedAt" TIMESTAMP(3),
    "buildDuration" INTEGER,
    "sourceCodeS3Key" TEXT,
    "buildLogsS3Key" TEXT,
    "buildArtifactsS3Key" TEXT,
    "dockerImageTag" TEXT,
    "dockerImageUrl" TEXT,
    "dockerBuildLogs" TEXT,
    "k8sDeploymentName" TEXT,
    "k8sServiceName" TEXT,
    "k8sIngressName" TEXT,
    "k8sNamespace" TEXT,
    "k8sPodStatus" "public"."PodStatus",
    "memoryLimit" TEXT,
    "cpuLimit" TEXT,
    "replicaCount" INTEGER DEFAULT 1,
    "deploymentUrl" TEXT,
    "previewUrl" TEXT,
    "errorMessage" TEXT,
    "errorLogs" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BuildLog" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "level" "public"."LogLevel" NOT NULL DEFAULT 'INFO',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "public"."LogSource" NOT NULL DEFAULT 'BUILD',
    "metadata" JSONB,
    "s3Key" TEXT,
    "deploymentId" TEXT NOT NULL,

    CONSTRAINT "BuildLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KubernetesResource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "resourceType" "public"."K8sResourceType" NOT NULL,
    "manifest" JSONB NOT NULL,
    "labels" JSONB,
    "annotations" JSONB,
    "status" TEXT NOT NULL,
    "phase" TEXT,
    "deploymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KubernetesResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."S3Object" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "size" INTEGER,
    "contentType" TEXT,
    "etag" TEXT,
    "objectType" "public"."S3ObjectType" NOT NULL,
    "projectId" TEXT,
    "deploymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "S3Object_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "public"."User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_subdomain_key" ON "public"."Project"("subdomain");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "public"."Project"("userId");

-- CreateIndex
CREATE INDEX "Project_subdomain_idx" ON "public"."Project"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "EnvVariable_projectId_key_key" ON "public"."EnvVariable"("projectId", "key");

-- CreateIndex
CREATE INDEX "Deployment_projectId_idx" ON "public"."Deployment"("projectId");

-- CreateIndex
CREATE INDEX "Deployment_status_idx" ON "public"."Deployment"("status");

-- CreateIndex
CREATE INDEX "Deployment_createdAt_idx" ON "public"."Deployment"("createdAt");

-- CreateIndex
CREATE INDEX "BuildLog_deploymentId_idx" ON "public"."BuildLog"("deploymentId");

-- CreateIndex
CREATE INDEX "BuildLog_timestamp_idx" ON "public"."BuildLog"("timestamp");

-- CreateIndex
CREATE INDEX "KubernetesResource_deploymentId_idx" ON "public"."KubernetesResource"("deploymentId");

-- CreateIndex
CREATE UNIQUE INDEX "KubernetesResource_name_namespace_resourceType_key" ON "public"."KubernetesResource"("name", "namespace", "resourceType");

-- CreateIndex
CREATE INDEX "S3Object_projectId_idx" ON "public"."S3Object"("projectId");

-- CreateIndex
CREATE INDEX "S3Object_deploymentId_idx" ON "public"."S3Object"("deploymentId");

-- CreateIndex
CREATE UNIQUE INDEX "S3Object_bucket_key_key" ON "public"."S3Object"("bucket", "key");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EnvVariable" ADD CONSTRAINT "EnvVariable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deployment" ADD CONSTRAINT "Deployment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuildLog" ADD CONSTRAINT "BuildLog_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "public"."Deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KubernetesResource" ADD CONSTRAINT "KubernetesResource_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "public"."Deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."S3Object" ADD CONSTRAINT "S3Object_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."S3Object" ADD CONSTRAINT "S3Object_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "public"."Deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
