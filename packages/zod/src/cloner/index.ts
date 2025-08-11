import z from "zod";

export const detectFrameworkSchema = z.object({
  cloneUrl: z.url(),
  repoId: z.string(),
});

export const createProjectSchema = z.object({
  name: z.string(),
  githubRepoUrl: z.string(),
  githubRepoName: z.string(),
  githubBranch: z.string(),
  githubWebhookId: z.string().optional(),
  buildCommand: z.string().optional(),
  installCommand: z.string().optional(),
  startCommand: z.string().optional(),
  envVariables: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
  subdomain: z.string(),
});
