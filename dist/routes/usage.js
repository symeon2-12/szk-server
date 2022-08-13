"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const usageController_1 = __importDefault(require("../controllers/usageController"));
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const router = express_1.default.Router();
router.post("/create", verifyJWT_1.default, usageController_1.default.createUsage);
router.get("/", usageController_1.default.getAllUsages);
router.delete("/delete", verifyJWT_1.default, usageController_1.default.deleteUsage);
module.exports = router;
