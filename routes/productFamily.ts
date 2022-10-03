import express from "express";
import controller from "../controllers/productFamilyController";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.post("/create", verifyJWT, controller.createProductFamily);
router.get("/", controller.getAllProductFamilies);
router.get("/bytype", controller.getProductFamiliesWithType);
router.delete("/delete", verifyJWT, controller.deleteProductFamily);
router.put("/update", controller.updateProductFamily);
// router.put("/update", verifyJWT, controller.updateProductFamily);

export = router;
