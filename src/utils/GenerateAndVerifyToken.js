import jwt from "jsonwebtoken";

export const generateToken = ({
  payload = {},
  signature = process.env.TOKEN_SIGNATURE,
  expiresIn = 60 * 60,
} = {}) => {
  console.log(process.env.TOKEN_SIGNATURE);
  console.log(payload);
  const token = jwt.sign(payload, "kareem123", {
    expiresIn: parseInt(expiresIn),
  });
  console.log(token);
  return token;
};

export const verifyToken = ({
  token,
  signature = process.env.TOKEN_SIGNATURE,
} = {}) => {
  // console.log("token", token, );
  const decoded = jwt.verify(token, "kareem123");
  console.log(decoded, "decoded");
  return decoded;
};
