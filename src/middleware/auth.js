import userModel from "../module/user/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
export const auth = asyncHandler(async (request, response, next) => {
  const { authorization } = request.headers;
  // console.log(authorization);
  if (!authorization?.startsWith(process.env.BEARER_KEY)) {
    throw new Error(`In-valid bearer key`, { cause: 401 });
  }
  const token = authorization.split(" ")[1];
  console.log(authorization);
  // console.log("token", token);
  if (!token) {
    throw new Error(`In-valid token`, { cause: 401 });
  }

  const decoded = verifyToken({ token });

  if (!decoded?.id) {
    throw new Error(`In-valid token payload`, { cause: 401 });
  }
  console.log("okey");
  const user = await userModel
    .findById(decoded.id)
    .select("userName role _id email ");
  if (!user) {
    throw new Error(`not registered user`, { cause: 401 });
  }
  console.log("user", !user.passwordChangedAt);
  if (user.passwordChangedAt) {
    const passwordTimeInMinutes = parseInt(
      user.passwordChangedAt.getTime() / 1000
    );

    if (passwordTimeInMinutes > parseInt(decoded.iat)) {
      throw new Error(`expired Token`, { cause: 401 });
    }
  }
  request.decoded = user;

  next();
});

export default auth;
