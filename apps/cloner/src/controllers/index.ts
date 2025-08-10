import { detectFrameworkSchema } from "@deployr/schemas/cloner";
import { asyncHandler } from "../util/asyncHandler";

export const detectFramework = asyncHandler(async (req, res) => {
  const { cloneUrl, repoId } = req.query;
  const parsedData = detectFrameworkSchema.safeParse({ cloneUrl, repoId });

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }
  console.log(parsedData.data);
  // get the repo url from req.query
  // clone the repo
  // store the repo in redis
  // detech the framework used in the repos using detectors(ask gpt to give detectors)
  // return the framework , svg of framework ,

  return res.status(200).json({
    success: true,
  });
});

export const createProject = asyncHandler(() => {
  return new Promise(() => {});
});
