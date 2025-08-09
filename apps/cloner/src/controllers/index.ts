import { asyncHandler } from "../util/asyncHandler";

export const detectFramework = asyncHandler(() => {
  // get the repo url from req.query
  // clone the repo
  // store the repo in redis
  // detech the framework used in the repos using detectors(ask gpt to give detectors)
  // return the framework , svg of framework ,

  return new Promise(() => {});
});

export const createProject = asyncHandler(() => {
  return new Promise(() => {});
});
