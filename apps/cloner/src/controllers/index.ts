import { createProjectSchema } from "@deployr/schemas/cloner";
import { asyncHandler } from "../util/asyncHandler";
import { client } from "@deployr/db";
import git from "simple-git";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";

export const createProject = asyncHandler(async (req, res) => {
  // Constants
  const CLONED_REPO_DIR = "cloned-repo";
  const ZIP_DIR = "zip";
  const CLONE_DEPTH = "1";
  const STATIC_HTML_FRAMEWORK = "STATIC_HTML";
  const PROJECT_TYPE_STATIC = "STATIC";
  const PROJECT_TYPE_FRONTEND = "FRONTEND";

  // Parse and validate request data
  const parsedData = createProjectSchema.safeParse(req.body);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const { data: validatedData } = parsedData;
  const { githubRepoUrl, envVariables, framework } = validatedData;

  // Check if project already exists
  const existingProject = await client.project.findUnique({
    where: { githubRepoUrl },
  });

  if (existingProject) {
    throw new Error("Project already exists");
  }

  // Prepare project data
  const projectData = {
    ...validatedData,
  };

  // Create project in database
  let project;

  if (envVariables?.length) {
    const envVariableData = envVariables.map(({ key, value }) => ({
      key,
      value,
    }));

    project = await client.project.create({
      data: {
        ...projectData,
        projectType:
          framework === STATIC_HTML_FRAMEWORK
            ? PROJECT_TYPE_STATIC
            : PROJECT_TYPE_FRONTEND,
        envVariables: {
          createMany: {
            data: envVariableData,
          },
        },
      },
    });
  } else {
    project = await client.project.create({
      data: {
        ...projectData,
        projectType:
          framework === STATIC_HTML_FRAMEWORK
            ? PROJECT_TYPE_STATIC
            : PROJECT_TYPE_FRONTEND,
        envVariables: {},
      },
    });
  }

  if (!project) {
    throw new Error("Project not created");
  }

  // Set up file paths
  const projectId = project.id;
  const clonedRepoPath = path.join(__dirname, CLONED_REPO_DIR, projectId);
  const zipDirPath = path.join(__dirname, ZIP_DIR);
  const zipFilePath = path.join(zipDirPath, `${projectId}.zip`);

  // Clone repository
  const gitClient = git();
  await gitClient.clone(githubRepoUrl, clonedRepoPath, [
    "--depth",
    CLONE_DEPTH,
  ]);

  console.log("Directory:", __dirname);

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
  }

  if (project.projectType === PROJECT_TYPE_STATIC) {
    // TODO: Upload static files directly to S3
    console.log("Processing static files for direct S3 upload");
  }

  // TODO: Add task to queue for build and deployment

  return res.status(200).json({
    success: true,
    project,
  });
});
