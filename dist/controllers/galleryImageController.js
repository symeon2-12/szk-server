"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GalleryImage_1 = __importDefault(require("../model/GalleryImage"));
const createGalleryImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { galleryImages } = req.body;
    if (!galleryImages) {
        return res.status(400).json({ message: "gallery images urls required" });
    }
    for (const img of galleryImages) {
        const duplicate = yield GalleryImage_1.default.findOne({
            url: img,
        }).exec();
        if (duplicate)
            return res
                .status(409)
                .json({ message: "gallery image url already exists" }); //Conflict
    }
    // check for duplicate usernames in the db
    let resultArr = [];
    for (const img of galleryImages) {
        console.log(img);
        try {
            const result = yield GalleryImage_1.default.create({
                url: img,
            });
            resultArr.push(result);
        }
        catch (err) {
            console.error(err);
        }
    }
    res.status(201).json(resultArr);
});
const getAllGalleryImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const galleryImage = yield GalleryImage_1.default.find();
    if (!galleryImage)
        return res.status(204).json({ message: "No images found" });
    res.json(galleryImage);
});
const deleteGalleryImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ids = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.ids;
    if (!ids)
        return res.status(400).json({ message: "Gallery image ID required" });
    for (const id of ids) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Incorrect ID format" });
    }
    let resultArr = [];
    for (const id of ids) {
        const galleryImage = yield GalleryImage_1.default.findOne({ _id: id }).exec();
        if (!galleryImage) {
            return res.status(204).json({ message: "" });
        }
        const result = yield galleryImage.deleteOne({ _id: id });
        resultArr.push(result);
    }
    res.json(resultArr);
});
exports.default = { createGalleryImages, getAllGalleryImages, deleteGalleryImage };
