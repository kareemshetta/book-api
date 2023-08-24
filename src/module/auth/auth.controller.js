import UserModel from "../user/user.model.js";

import { compare, hash } from "../../utils/HashAndCompare.js";
import { generateToken } from "../../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const signUp = asyncHandler(async (request, response, next) => {
  const { password, email } = request.body;

  if (await UserModel.findOne({ email })) {
    throw new Error(`User ${email} already exists`, { cause: 409 });
  }

  const hashed = hash({ plaintext: password });
  //hash
  request.body.password = hashed;
  const user = await new UserModel(request.body).save();
  if (!user) {
    throw new Error("no user added check your data", { cause: 404 });
  }

  response
    .status(201)
    .json({ message: "success check your email for verification" });
});

export const signIn = asyncHandler(async (request, response, next) => {
  const { password, email } = request.body;
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new Error(` sorry there's no account found check your credentials`, {
      cause: 404,
    });
  }
  console.log(password, user.password);
  const match = compare({ plaintext: password, hashValue: user.password });
  console.log(match);
  if (match) {
    const accessToken = generateToken({
      payload: { email, id: user._id },
      expiresIn: 60 * 60,
    });
    const refreshToken = generateToken({
      payload: { email, id: user._id },
      expiresIn: 60 * 60 * 24 * 365,
    });

    return response
      .status(200)
      .json({ message: "success", accessToken, refreshToken });
  } else {
    throw new Error(` sorry there's no account found check your credentials`, {
      cause: 404,
    });
  }
});
