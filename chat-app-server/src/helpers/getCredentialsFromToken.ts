import jwt from "jsonwebtoken";

function getCredFromToken(cookie: string) {
  const token: string = cookie.split("=")[1];
  if (!process.env.SECRET) {
    return "no key";
  }
  const claims = jwt.verify(token, process.env.SECRET);
  if (!claims) {
    return "invalid";
  }
  return claims;
}

export default getCredFromToken;