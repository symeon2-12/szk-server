"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions_1 = require("../config/corsOptions");
const credentials = (req, res, next) => {
    var _a, _b;
    const origin = ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.origin) ? (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.origin : "none";
    if (corsOptions_1.allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
};
exports.default = credentials;
