import { expressjwt as jwt } from "express-jwt";
import { config } from "dotenv";

config();
const secret = process.env.SECRET;

function getTokenFromHeader(req) {
  if (req.headers.authorization?.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

const auth = {
  required: jwt({
    secret: secret,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret: secret,
    algorithms: ["HS256"],
    requestProperty: "payload",
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

export default auth;
