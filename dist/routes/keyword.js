"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const keywordController_1 = __importDefault(require("../controllers/keywordController"));
const router = express_1.default.Router();
router.post("/create", keywordController_1.default.createKeyword);
router.get("/", keywordController_1.default.getAllKeywords);
router.delete("/delete", keywordController_1.default.deleteKeyword);
module.exports = router;
