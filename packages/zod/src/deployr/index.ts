import z from "zod";

export const createDeploymentSchema = z.object({
  branch: z.string(),
  projectId: z.string(),
});
