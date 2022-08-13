"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyAdmin = (req, res, next) => {
    var _a;
    console.log("vf admin", req.body);
    console.log("ok2");
    if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.adminFromToken))
        return res.status(401).json({ message: 'You are not admin' });
    console.log("ok");
    next();
};
exports.default = verifyAdmin;
