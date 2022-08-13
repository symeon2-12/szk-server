import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
const { logEvents } = require("./logEvents");

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send(err.message);
};

export default errorHandler;
