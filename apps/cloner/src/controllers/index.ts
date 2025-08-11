// import { detectFrameworkSchema } from "@deployr/schemas/cloner";
import { asyncHandler } from "../util/asyncHandler";

export const createProject = asyncHandler(async (req, res) => {
  // const { cloneUrl, repoId } = req.query;
  // const parsedData = detectFrameworkSchema.safeParse({ cloneUrl, repoId });

  // if (!parsedData.success) {
  //   throw new Error(parsedData.error.message);
  // }
  // console.log(parsedData.data);

  //create a Project in db.
  // clone the repo using simple-git and store in local folder
  // create a zip of the folder and upload it to s3
  // Add the task in the queue to build and deploy the project

  console.log(req.body);

  return res.status(200).json({
    success: true,
  });
});
