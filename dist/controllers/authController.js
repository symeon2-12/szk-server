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
const User_1 = __importDefault(require("../model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    // console.log(req.body);
    const { name, pwd } = req.body;
    if (!name || !pwd)
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    const foundUser = yield User_1.default.findOne({ username: name }).exec();
    if (!foundUser)
        return res.status(403).json({ message: "Błędny użytkownik" }); //Unauthorized
    // evaluate password
    const match = yield bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const admin = foundUser.admin;
        // create JWTs
        const accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                name: foundUser.username,
                admin: admin,
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const newRefreshToken = jsonwebtoken_1.default.sign({ name: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
        // Changed to let keyword
        let newRefreshTokenArray = !(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)
            ? foundUser.refreshToken
            : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt); //find out rt type !!
        if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt) {
            /*
                  Scenario added here:
                      1) User logs in but never uses RT and does not logout
                      2) RT is stolen
                      3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
                  */
            const refreshToken = cookies.jwt;
            const foundToken = yield User_1.default.findOne({ refreshToken }).exec();
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
            const decoded = jsonwebtoken_1.default.decode(token);
            return decoded.exp * 1000 > Date.now();
        });
        // Saving refreshToken with current user
        foundUser.refreshToken = [...filteredTokens, newRefreshToken];
        const result = yield foundUser.save();
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
    }
    else {
        res.status(403).json({ message: "incorrect password" });
    }
});
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    const foundUser = yield User_1.default.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
        return res.sendStatus(204);
    }
    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
    const result = yield foundUser.save();
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.status(200).json({ message: "logged out" });
});
exports.default = { handleLogin, handleLogout };
