import { uploadFilesFromLocalDirectoryToS3, uploadZipToS3 } from "@deployr/aws";
import { client, Prisma } from "@deployr/db";
import AdmZip from "adm-zip";
import git from "simple-git";
import path from "path";
import fs from "fs";
import { rm } from "fs/promises";
import { producer } from "./cloner";

const CLONED_REPO_DIR = "cloned-repo";
const ZIP_DIR = "zip";
const CLONE_DEPTH = "1";
const PROJECT_TYPE_STATIC = "STATIC";
const PROJECT_TYPE_FRONTEND = "FRONTEND";

type ProjectType = Prisma.ProjectGetPayload<Prisma.ProjectCreateArgs>;

export async function handler(project: ProjectType) {
  if (!project || !project.id) return;

  // Set up file paths
  const projectId = project.id;
  const clonedRepoPath = path.join(__dirname, CLONED_REPO_DIR, projectId);
  const zipDirPath = path.join(__dirname, ZIP_DIR);
  const zipFilePath = path.join(zipDirPath, `${projectId}.zip`);

  // Clone repository
  const gitClient = git();
  await gitClient.clone(project.githubRepoUrl, clonedRepoPath, [
    "--depth",
    CLONE_DEPTH,
  ]);

  // Handle file processing based on project type
  if (project.projectType === PROJECT_TYPE_FRONTEND) {
    // Create zip directory if it doesn't exist
    if (!fs.existsSync(zipDirPath)) {
      fs.mkdirSync(zipDirPath, { recursive: true });
    }

    // Create and write zip file
    const zip = new AdmZip();
    zip.addLocalFolder(clonedRepoPath);
    await zip.writeZipPromise(zipFilePath);

    console.log(`Zip file created at: ${zipFilePath}`);

    const publicUrl = await uploadZipToS3(zipFilePath, projectId);
    console.log("uploaded to s3", publicUrl);

    // Add the public URL to the project
    await client.project.update({
      where: { id: projectId },
      data: {
        sourceCodePath: publicUrl,
      },
    });
  }

  if (project.projectType === PROJECT_TYPE_STATIC) {
    // TODO: Upload static files directly to S3
    console.log("Processing static files for direct S3 upload");
    const folderPath = await uploadFilesFromLocalDirectoryToS3(
      clonedRepoPath,
      projectId,
    );

    await client.project.update({
      where: { id: projectId },
      data: {
        buildArtifactsPath: folderPath,
      },
    });
  }

  //Add task to queue for build and deployment
  await producer.send({
    topic: process.env.KAFKA_DEPLOY_TOPIC || "deploy-request",
    messages: [
      { value: JSON.stringify({ projectId }), key: projectId.toString() },
    ],
  });

  // Delete cloned repo and zip file if exists
  if (fs.existsSync(clonedRepoPath))
    await rm(clonedRepoPath, { recursive: true });
  if (fs.existsSync(zipFilePath)) await rm(zipFilePath);
}
