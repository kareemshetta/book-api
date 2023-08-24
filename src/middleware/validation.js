import joi from "joi";
import { Types } from "mongoose";
const dataMethods = ["body", "params", "query", "headers", "file"];

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};
export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().required(),
  id: joi.string().custom(validateObjectId),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
};

export const validation = (schema) => {
  return (request, response, next) => {
    console.log("files", request.files);
    // console.log(request.params);
    let inputs = {
      ...request.body,
      ...request.params,
      ...request.query,
    };

    if (request.file || request.files) {
      inputs.file = request.file || request.files;
    }

    const { error } = schema.validate(inputs, { abortEarly: false });
    try {
      if (error) {
        let errors = error.details.map((detail) => detail.message);

        throw new Error(errors, { cause: 400 });
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
};


