import { client } from "@deployr/db";
import { createDeploymentSchema } from "@deployr/schemas/deployr";
import z from "zod";

type createDeploymentType = z.infer<typeof createDeploymentSchema>;

export const getProject = async (id: string) => {
  try {
    const project = await client.project.findUnique({ where: { id } });
    return project;
  } catch (error) {
    console.log("error getting project", error);
    return null;
  }
};

export const createDeployment = async (data: createDeploymentType) => {
  try {
    const deployment = await client.deployment.create({
      data: {
        branch: data.branch,
        projectId: data.projectId,
      },
    });

    return deployment;
  } catch (error) {
    console.log("error while creating deployment", error);
    return null;
  }
};
