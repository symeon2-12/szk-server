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
const Product_1 = __importDefault(require("../model/Product"));
const ProductType_1 = __importDefault(require("../model/ProductType"));
const ProductFamily_1 = __importDefault(require("../model/ProductFamily"));
const createProductFamily = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productFamily, productType } = req.body;
    if (!productType) {
        return res.status(400).json({ message: "product type required" });
    }
    if (!productFamily) {
        return res.status(400).json({ message: "product family required" });
    }
    // check for duplicate in the db
    const duplicate = yield ProductFamily_1.default.findOne({
        productType: productType,
        productFamily: productFamily,
    }).exec();
    if (duplicate)
        return res.status(409).json({ message: "product family already exists" }); //Conflict
    const productTypeCheck = yield ProductType_1.default.exists({
        _id: productType,
    });
    if (!productTypeCheck)
        return res.status(409).json({ message: "product type check incorrect" }); //Conflict
    try {
        const result = yield ProductFamily_1.default.create({
            productFamily: productFamily,
            productType: productType,
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
});
const updateProductFamily = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id)) {
            return res
                .status(400)
                .json({ message: "Product family ID parameter is required." });
        }
        const productFamily = yield ProductFamily_1.default.findOne({
            _id: req.body.id,
        }).exec();
        if (!productFamily) {
            return res
                .status(409)
                .json({ message: `No product family matches ID ${req.body.id}.` });
        }
        const productFamily2 = yield ProductFamily_1.default.findOne({
            productFamily: req.body.productFamily,
            productType: req.body.productType,
        }).exec();
        if (productFamily2 && (productFamily2 === null || productFamily2 === void 0 ? void 0 : productFamily2.id) !== (productFamily === null || productFamily === void 0 ? void 0 : productFamily.id)) {
            console.log({ message: `Naming conflict` });
            return res.status(409).json({ message: `Naming conflict`, aa: "bb" });
        }
        const productTypeCheck = yield ProductType_1.default.exists({
            _id: req.body.productType,
        });
        if (!productTypeCheck)
            return res.status(409).json({ message: "product type check incorrect" }); //Conflict
        if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.productType) {
            productFamily.productFamily = req.body.productFamily;
            productFamily.productType = req.body.productType;
        }
        const result = yield productFamily.save();
        res.json(result);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const getAllProductFamilies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productFamilies = yield ProductFamily_1.default.find()
        .populate("productType", "productType")
        .exec((err, list) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        else {
            console.log(list.sort((a, b) => {
                console.log(a.productFamily.toLowerCase());
                return a.productFamily.toLowerCase() !== "inne"
                    ? a.productFamily.localeCompare(b.productFamily)
                    : 1;
            }));
            res.status(200).json(list.sort((a, b) => {
                if (a.productFamily.toLowerCase() === "inne")
                    return 1;
                if (b.productFamily.toLowerCase() === "inne")
                    return -1;
                return a.productFamily.localeCompare(b.productFamily);
            }));
        }
    });
});
const getProductFamiliesWithType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    console.log((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.productType);
    if (!((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.productType))
        return res.status(400).json({ message: "Product type required" });
    const productFamiliy = yield ProductFamily_1.default.find({
        productType: req.body.productType,
    }).exec();
    console.log(productFamiliy);
    if (!productFamiliy) {
        return res.status(204).json({
            message: `Product families with product type ${req.body.productType} not found`,
        });
    }
    res.json(productFamiliy.sort((a, b) => a.productFamily.localeCompare(b.productFamily)));
});
const deleteProductFamily = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const id = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.id;
    if (!id)
        return res.status(400).json({ message: "Family ID required" });
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Incorrect ID format" });
    const productFamily = yield ProductFamily_1.default.findOne({
        _id: req.body.id,
    }).exec();
    if (!productFamily) {
        return res.status(204).json({ message: "" });
    }
    const productFamilyUsed = yield Product_1.default.findOne({
        productFamily: req.body.id,
    }).exec();
    if (productFamilyUsed) {
        return res.status(400).json({
            message: `Product family used in ${productFamilyUsed.name}`,
        });
    }
    const result = yield productFamily.deleteOne({ _id: req.body.id });
    res.json(result);
});
exports.default = {
    createProductFamily,
    getAllProductFamilies,
    getProductFamiliesWithType,
    deleteProductFamily,
    updateProductFamily,
};
