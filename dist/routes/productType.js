"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const productTypeController_1 = __importDefault(require("../controllers/productTypeController"));
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const router = express_1.default.Router();
router.post("/create", verifyJWT_1.default, productTypeController_1.default.createProductType);
router.get("/", productTypeController_1.default.getAllProductTypes);
router.delete("/delete", verifyJWT_1.default, productTypeController_1.default.deleteProductType);
router.put("/update", productTypeController_1.default.updateProductType);
module.exports = router;
