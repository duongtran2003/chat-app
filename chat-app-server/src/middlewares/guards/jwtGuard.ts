import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function jwtGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["jwt"];
  if (!token) {
    res.statusCode = 401;
    return res.json({
      "message": "invalid token",
    });
  }
  if (!process.env.SECRET) {
    res.statusCode = 500;
    return res.json({
      "message": "server has encountered an error",
    })
  }
  const claims = jwt.verify(req.cookies["jwt"], process.env.SECRET);
  if (!claims) {
    res.statusCode = 401;
    return res.json({
      "message": "invalid token",
    });
  }
  res.locals.claims = claims;
  next();
}

export {
  jwtGuard
}