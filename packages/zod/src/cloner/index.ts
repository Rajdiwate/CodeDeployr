import z from "zod";

export const detectFrameworkSchema = z.object({
  cloneUrl: z.url(),
  repoId: z.string(),
});
