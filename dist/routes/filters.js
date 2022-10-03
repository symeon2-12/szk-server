"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const filterController_1 = __importDefault(require("../controllers/filterController"));
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const router = express_1.default.Router();
router.post("/create", verifyJWT_1.default, filterController_1.default.createFilter);
router.get("/", filterController_1.default.getAllFilters);
router.delete("/delete", verifyJWT_1.default, filterController_1.default.deleteFilter);
router.put("/update", verifyJWT_1.default, filterController_1.default.updateFilter);
module.exports = router;
