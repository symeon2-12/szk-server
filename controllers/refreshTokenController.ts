import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import jwt from "jsonwebtoken";

const handleRefreshToken = async (req: Request, res: Response) => {
  console.log(req.cookies, req.body);
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();
  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) return res.status(403).json({ message: "jwt error" }); //Forbidden
        if (!decoded.name)
          return res
            .status(403)
            .json({ message: "cannot decode jwt with username" }); //Forbidden
        // Delete refresh tokens of hacked user
        const hackedUser = await User.findOne({
          username: decoded.name,
        }).exec();
        hackedUser!.refreshToken = [];
        const result = await hackedUser!.save();
        return res.status(403).json({ message: "used token" });
      }
    );
    return; //res already sent
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) {
        // expired refresh token
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || foundUser.username !== decoded.name)
        return res.sendStatus(403);

      // Refresh token was still valid
      const admin = Object.values(foundUser.admin);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            name: decoded.name,
            admin: admin,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        { name: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "30d" }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      // res.json({ accessToken });
      res.json({
        accessToken,
        user: { name: foundUser.username, admin: foundUser.admin },
      });
    }
  );
};

export default { handleRefreshToken };
