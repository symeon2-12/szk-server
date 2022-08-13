"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const refreshTokenController_1 = __importDefault(require("../controllers/refreshTokenController"));
const router = express_1.default.Router();
router.get("/", refreshTokenController_1.default.handleRefreshToken);
module.exports = router;
