"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const galleryImageController_1 = __importDefault(require("../controllers/galleryImageController"));
const router = express_1.default.Router();
router.post("/create", galleryImageController_1.default.createGalleryImages);
router.get("/", galleryImageController_1.default.getAllGalleryImages);
router.delete("/delete", galleryImageController_1.default.deleteGalleryImage);
module.exports = router;
