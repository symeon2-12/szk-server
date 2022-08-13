"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../model/User"));
const bcrypt = require("bcrypt");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { name, pwd, admin } = req.body;
    if (!name || !pwd) {
        return res
            .status(400)
            .json({ message: "username & password are required" });
    }
    // check for duplicate usernames in the db
    const duplicate = yield User_1.default.findOne({ username: name }).exec();
    if (duplicate)
        return res.status(409).json({ message: "user already exist" }); //Conflict
    try {
        const hashPwd = yield bcrypt.hash(pwd, 10);
        const result = yield User_1.default.create({
            username: name,
            password: hashPwd,
            admin: admin,
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find();
    if (!users)
        return res.status(204).json({ message: "No users found" });
    res.json(users);
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id))
        return res.status(400).json({ message: "User ID required" });
    const user = yield User_1.default.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res
            .status(204)
            .json({ message: `User ID ${req.params.id} not found` });
    }
    res.json(user);
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.id;
    if (!id)
        return res.status(400).json({ message: "User ID required" });
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Incorrect ID format" });
    const user = yield User_1.default.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ message: "" });
    }
    const result = yield user.deleteOne({ _id: req.body.id });
    res.json(`deleted user ${req.body.id}`);
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { oldpwd, newpwd, userFromToken } = req.body;
    if (!oldpwd || !newpwd || !userFromToken) {
        return res
            .status(400)
            .json({ message: "username & password are required" });
    }
    // check for duplicate usernames in the db
    const foundUser = yield User_1.default.findOne({ username: userFromToken }).exec();
    if (!foundUser)
        return res.status(409).json({ message: "user doesn't exist" });
    const match = yield bcrypt.compare(oldpwd, foundUser.password);
    if (!match)
        return res.status(409).json({ message: "old password incorrect" });
    try {
        const hashPwd = yield bcrypt.hash(newpwd, 10);
        const result = yield User_1.default.findOneAndUpdate({
            username: userFromToken,
        }, { password: hashPwd });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: "username required" });
    }
    // check for duplicate usernames in the db
    const foundUser = yield User_1.default.findOne({ username: username }).exec();
    if (!foundUser)
        return res.status(409).json({ message: "user doesn't exist" });
    try {
        const hashPwd = yield bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
        const result = yield User_1.default.findOneAndUpdate({
            username: username,
        }, { password: hashPwd });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
});
exports.default = {
    createUser,
    getAllUsers,
    getUser,
    deleteUser,
    changePassword,
    resetPassword,
};
