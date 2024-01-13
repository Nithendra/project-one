import { Router } from "express";
import * as user from "../controllers/user.controllers.js";
import { jwtAuth } from "../middlewares/jwtAuth.middlewares.js";

const router = Router();

router.route("/register").post(user.registerUser);
router.route("/login").post(user.loginUser);
router.route("/logout").post(jwtAuth, user.logoutUser);

export default router;
