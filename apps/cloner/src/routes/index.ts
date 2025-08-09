import { Router } from "express";
import { createProject, detectFramework } from "../controllers";

const router: Router = Router();

router.route("/detect-framework").get(detectFramework);
router.route("/project/create").post(createProject);

export default router;
