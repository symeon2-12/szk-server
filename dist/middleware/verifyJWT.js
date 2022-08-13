"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    // next();
    const authHeaderRead = req.headers.authorization || req.headers.Authorization;
    const authHeader = typeof authHeaderRead === "string" ? authHeaderRead : "no authorization";
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")))
        return res.status(401).json({ message: "No Bearer header" });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json(err); //invalid token
        req.body.userFromToken = decoded.UserInfo.name;
        req.body.adminFromToken = decoded.UserInfo.admin;
        next();
    });
};
exports.default = verifyJWT;
