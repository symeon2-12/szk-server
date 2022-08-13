import express from "express";
import controller from "../controllers/filterController";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.post("/create", controller.createFilter);
router.get("/", controller.getAllFilters);
router.delete("/delete", controller.deleteFilter);

export = router;
