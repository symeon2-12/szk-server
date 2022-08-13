import express from "express";
import controller from "../controllers/productController";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.post("/create", verifyJWT, controller.createProduct);
router.get("/", controller.getAllProducts);
router.get("/getbyid/:id", controller.getProduct);
router.delete("/delete", verifyJWT, controller.deleteProduct);
router.put("/update", verifyJWT, controller.updateProduct);

export = router;
