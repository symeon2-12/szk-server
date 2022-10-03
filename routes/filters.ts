import express from "express";
import controller from "../controllers/filterController";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.post("/create", verifyJWT, controller.createFilter);
router.get("/", controller.getAllFilters);
router.delete("/delete", verifyJWT, controller.deleteFilter);
router.put("/update", verifyJWT, controller.updateFilter);

export = router;
