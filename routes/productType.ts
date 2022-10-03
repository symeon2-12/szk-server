import express from "express";
import controller from "../controllers/productTypeController";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.post("/create", verifyJWT, controller.createProductType);
router.get("/", controller.getAllProductTypes);
router.delete("/delete", verifyJWT, controller.deleteProductType);
router.put("/update", controller.updateProductType);
// router.put("/update", verifyJWT, controller.updateProductType);

export = router;
