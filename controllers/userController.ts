import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../model/User";

const bcrypt = require("bcrypt");

const createUser = async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, pwd, admin } = req.body;
  if (!name || !pwd) {
    return res
      .status(400)
      .json({ message: "username & password are required" });
  }

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: name }).exec();
  if (duplicate) return res.status(409).json({ message: "user already exist" }); //Conflict

  try {
    const hashPwd = await bcrypt.hash(pwd, 10);
    const result = await User.create({
      username: name,
      password: hashPwd,
      admin: admin,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const getUser = async (req: Request, res: Response) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(user);
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req?.body?.id;
  if (!id) return res.status(400).json({ message: "User ID required" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Incorrect ID format" });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.status(204).json({ message: "" });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(`deleted user ${req.body.id}`);
};

const changePassword = async (req: Request, res: Response) => {
  console.log(req.body);
  const { oldpwd, newpwd, userFromToken } = req.body;
  if (!oldpwd || !newpwd || !userFromToken) {
    return res
      .status(400)
      .json({ message: "username & password are required" });
  }

  // check for duplicate usernames in the db
  const foundUser = await User.findOne({ username: userFromToken }).exec();
  if (!foundUser)
    return res.status(409).json({ message: "user doesn't exist" });

  const match = await bcrypt.compare(oldpwd, foundUser.password);

  if (!match)
    return res.status(409).json({ message: "old password incorrect" });

  try {
    const hashPwd = await bcrypt.hash(newpwd, 10);
    const result = await User.findOneAndUpdate(
      {
        username: userFromToken,
      },
      { password: hashPwd }
    );

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const resetPassword = async (req: Request, res: Response) => {
  console.log(req.body);
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "username required" });
  }

  // check for duplicate usernames in the db
  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser)
    return res.status(409).json({ message: "user doesn't exist" });

  try {
    const hashPwd = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
    const result = await User.findOneAndUpdate(
      {
        username: username,
      },
      { password: hashPwd }
    );

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

export default {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  changePassword,
  resetPassword,
};
