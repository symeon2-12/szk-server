import express from "express";
import controller from "../controllers/galleryImageController";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.post("/create", controller.createGalleryImages);
router.get("/", controller.getAllGalleryImages);
router.delete("/delete", controller.deleteGalleryImage);
// router.post("/create", verifyJWT, controller.createGalleryImage);
// router.get("/", controller.getAllGalleryImages);
// router.delete("/delete", verifyJWT, controller.deleteGalleryImage);

export = router;
