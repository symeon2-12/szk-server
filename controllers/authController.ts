import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../model/User";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const handleLogin = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  // console.log(req.body);

  const { name, pwd } = req.body;
  if (!name || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await User.findOne({ username: name }).exec();
  if (!foundUser) return res.status(403).json({ message: "Błędny użytkownik" }); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const admin = foundUser.admin;
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          name: foundUser.username,
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

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt: any) => rt !== cookies.jwt); //find out rt type !!

    if (cookies?.jwt) {
      /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    //Filter expired tokens
    const filteredTokens = foundUser.refreshToken.filter((token) => {
      const decoded: any = jwt.decode(token as string);
      return decoded.exp * 1000 > Date.now();
    });
    // Saving refreshToken with current user
    foundUser.refreshToken = [...filteredTokens, newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    res.json({
      accessToken,
      user: { name: foundUser.username, admin: foundUser.admin },
    });
  } else {
    res.status(403).json({ message: "incorrect password" });
  }
};

const handleLogout = async (req: Request, res: Response) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt: any) => rt !== refreshToken
  );
  const result = await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.status(200).json({ message: "logged out" });
};

export default { handleLogin, handleLogout };
