import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as bookController from "./book.controller.js";
import * as bookValidator from "./book.validation.js";
import { validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
const router = Router();
// get doesn't require to be protected
router.get("/", bookController.getAllbooks);
router.post(
  "/",
  auth,
  fileUpload(fileValidation.image).single("image"),
  validation(bookValidator.createBookSchema),
  bookController.createBook
);
router.patch(
  "/:id",
  auth,
  fileUpload(fileValidation.image).single("image"),
  validation(bookValidator.updateBookSchema),
  bookController.updateBook
);
// get doesn't require to be protected
router.get(
  "/:id",
  validation(bookValidator.deleteBookSchema),
  bookController.getSingleBook
);
router.delete(
  "/:id",
  auth,
  validation(bookValidator.deleteBookSchema),
  bookController.deleteBook
);
export default router;
