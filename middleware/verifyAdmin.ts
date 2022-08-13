import { NextFunction, Request, Response } from "express";

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log("vf admin", req.body);

  console.log("ok2");
  if (!req?.body?.adminFromToken) return res.status(401).json({message: 'You are not admin'});
  console.log("ok");
  next();
};

export default verifyAdmin;
