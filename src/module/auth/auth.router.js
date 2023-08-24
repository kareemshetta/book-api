import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as authController from "./auth.controller.js";
import * as authValidator from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";

const router = Router();
router.get("/", (req, res) => {
  res.json({ mes: "welcome auth" });
});
router.post(
  "/signup",
  validation(authValidator.signUpSchema),
  authController.signUp
);

router.post(
  "/signin",
  validation(authValidator.signInSchema),
  authController.signIn
);

export default router;
