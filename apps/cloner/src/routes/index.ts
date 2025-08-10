import { Router } from "express";
import { createProject } from "../controllers";

const router: Router = Router();

// router.route("/detect-framework").get(createProject);
router.route("/project/create").post(createProject);

export default router;
