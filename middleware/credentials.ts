import { NextFunction, Request, Response } from "express";
import { allowedOrigins } from "../config/corsOptions";

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin: string = req?.headers?.origin ? req?.headers?.origin : "none";
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};

export default credentials;
