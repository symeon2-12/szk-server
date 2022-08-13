"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const filterController_1 = __importDefault(require("../controllers/filterController"));
const router = express_1.default.Router();
router.post("/create", filterController_1.default.createFilter);
router.get("/", filterController_1.default.getAllFilters);
router.delete("/delete", filterController_1.default.deleteFilter);
module.exports = router;
