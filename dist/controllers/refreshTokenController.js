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
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.cookies, req.body);
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    const foundUser = yield User_1.default.findOne({ refreshToken }).exec();
    // Detected refresh token reuse!
    if (!foundUser) {
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return res.status(403).json({ message: "jwt error" }); //Forbidden
            if (!decoded.name)
                return res
                    .status(403)
                    .json({ message: "cannot decode jwt with username" }); //Forbidden
            // Delete refresh tokens of hacked user
            const hackedUser = yield User_1.default.findOne({
                username: decoded.name,
            }).exec();
            hackedUser.refreshToken = [];
            const result = yield hackedUser.save();
            return res.status(403).json({ message: "used token" });
        }));
        return; //res already sent
    }
    const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
    // evaluate jwt
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // expired refresh token
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = yield foundUser.save();
        }
        if (err || foundUser.username !== decoded.name)
            return res.sendStatus(403);
        // Refresh token was still valid
        const admin = Object.values(foundUser.admin);
        const accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                name: decoded.name,
                admin: admin,
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const newRefreshToken = jsonwebtoken_1.default.sign({ name: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = yield foundUser.save();
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
    }));
});
exports.default = { handleRefreshToken };
