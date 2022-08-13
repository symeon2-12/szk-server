"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const productController_1 = __importDefault(require("../controllers/productController"));
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const router = express_1.default.Router();
router.post("/create", verifyJWT_1.default, productController_1.default.createProduct);
router.get("/", productController_1.default.getAllProducts);
router.get("/getbyid/:id", productController_1.default.getProduct);
router.delete("/delete", verifyJWT_1.default, productController_1.default.deleteProduct);
router.put("/update", verifyJWT_1.default, productController_1.default.updateProduct);
module.exports = router;
