import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    userId: string;
  }
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  // next();

  const authHeaderRead = req.headers.authorization || req.headers.Authorization;
  const authHeader =
    typeof authHeaderRead === "string" ? authHeaderRead : "no authorization";
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No Bearer header" });
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded: any) => {
      if (err) return res.status(403).json(err); //invalid token
      req.body.userFromToken = decoded.UserInfo.name;
      req.body.adminFromToken = decoded.UserInfo.admin;
      next();
    }
  );
};

export default verifyJWT;
