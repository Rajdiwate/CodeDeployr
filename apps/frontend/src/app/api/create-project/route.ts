import { NextRequest } from "next/server";
import { createProjectSchema } from "@deployr/schemas/cloner";
import { client } from "@deployr/db";
import { sendMessage } from "@/lib/kafka";

export async function POST(request: NextRequest) {
  try {
    const STATIC_HTML_FRAMEWORK = "STATIC_HTML";
    const PROJECT_TYPE_STATIC = "STATIC";
    const PROJECT_TYPE_FRONTEND = "FRONTEND";

    const body = await request.json();
    // Validate request data
    const parsedData = createProjectSchema.safeParse(body);
    if (!parsedData.success) {
      return Response.json(
        { success: false, error: parsedData.error.message },
        { status: 400 },
      );
    }

    const { data: validatedData } = parsedData;
    const { githubRepoUrl, envVariables, framework } = validatedData;

    // Check if project already exists
    const existingProject = await client.project.findUnique({
      where: { githubRepoUrl },
    });
    if (existingProject) {
      return Response.json(
        { success: false, error: "Project already exists" },
        { status: 409 },
      );
    }

    // Prepare project data
    let project;
    if (envVariables?.length) {
      const envVariableData = envVariables.map(({ key, value }) => ({
        key,
        value,
      }));
      project = await client.project.create({
        data: {
          ...validatedData,
          projectType:
            framework === STATIC_HTML_FRAMEWORK
              ? PROJECT_TYPE_STATIC
              : PROJECT_TYPE_FRONTEND,
          envVariables: {
            createMany: { data: envVariableData },
          },
        },
      });
    } else {
      project = await client.project.create({
        data: {
          ...validatedData,
          projectType:
            framework === STATIC_HTML_FRAMEWORK
              ? PROJECT_TYPE_STATIC
              : PROJECT_TYPE_FRONTEND,
          envVariables: {},
        },
      });
    }

    if (!project) {
      return Response.json(
        { success: false, error: "Project not created" },
        { status: 500 },
      );
    }

    // publish this to kafka topic "clone-request"
    try {
      await sendMessage(JSON.stringify(project), project.id);
    } catch (error) {
      console.log("error occured while producing to kafka", error);
      console.log("deleting the project...");
      await client.project.delete({
        where: { id: project.id },
      });
    }

    return Response.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return Response.json(
        { success: false, error: error.message || "Internal server error" },
        { status: 500 },
      );
    }
  }
}
