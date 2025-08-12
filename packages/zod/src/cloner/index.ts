import z from "zod";

export const detectFrameworkSchema = z.object({
  cloneUrl: z.url(),
  repoId: z.string(),
});

export const createProjectSchema = z.object({
  userId: z.string(),
  name: z.string(),
  githubRepoUrl: z.string(),
  githubRepoName: z.string(),
  framework: z.enum(["REACT", "STATIC_HTML"]),
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
