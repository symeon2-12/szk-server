"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const productFamilyController_1 = __importDefault(require("../controllers/productFamilyController"));
const router = express_1.default.Router();
router.post("/create", productFamilyController_1.default.createProductFamily);
router.get("/", productFamilyController_1.default.getAllProductFamilies);
router.get("/bytype", productFamilyController_1.default.getProductFamiliesWithType);
router.delete("/delete", productFamilyController_1.default.deleteProductFamily);
module.exports = router;
