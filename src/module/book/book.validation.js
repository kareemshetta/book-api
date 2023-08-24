import joi from "joi";

import { generalFields } from "../../middleware/validation.js";

export const createBookSchema = joi
  .object({
    title: joi.string().min(3).max(30).required(),
    overview: joi.string().min(3).max(300).required(),
    author: joi.string().min(3).max(300).required(),
    createdBy: generalFields.id.required(),
    publishDate: joi.date(),
    file: generalFields.file,
  })
  .required();

export const updateBookSchema = joi
  .object({
    id: generalFields.id.required(),
    title: joi.string().min(3).max(30),
    overview: joi.string().min(3).max(300),
    author: joi.string().min(3).max(300),

    createdBy: generalFields.id,

    publishDate: joi.date(),
    file: generalFields.file,
  })
  .required();

export const deleteBookSchema = joi
  .object({
    id: generalFields.id.required(),
  })
  .required();
