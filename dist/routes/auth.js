"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = express_1.default.Router();
router.post("/login", authController_1.default.handleLogin);
router.get("/logout", authController_1.default.handleLogout);
module.exports = router;
