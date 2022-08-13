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
const ProductType_1 = __importDefault(require("../model/ProductType"));
const ProductFamily_1 = __importDefault(require("../model/ProductFamily"));
const Product_1 = __importDefault(require("../model/Product"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // deconstruct body
    const { name, productFamily, productType, filters, seasonality, availability, price, description, imagesurls, thumbnailurl, } = req.body;
    const duplicate = yield Product_1.default.findOne({
        name: name,
    }).exec();
    if (duplicate)
        return res.status(409).json({ message: "product already exists" }); //Conflict
    if (productType) {
        const productTypeCheck = yield ProductType_1.default.exists({
            _id: productType,
        });
        if (!productTypeCheck)
            return res.status(409).json({ message: "product type check incorrect" });
    }
    if (productFamily) {
        const productFamilyCheck = yield ProductFamily_1.default.exists({
            _id: productFamily,
        });
        if (!productFamilyCheck)
            return res
                .status(409)
                .json({ message: "product family check incorrect" });
    }
    try {
        const result = yield Product_1.default.create({
            name: name,
            productFamily: productFamily,
            productType: productType,
            filters: filters,
            seasonality: seasonality,
            availability: availability,
            price: price,
            description: description,
            imagesurls: imagesurls,
            thumbnailurl: thumbnailurl,
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
});
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id)) {
        return res
            .status(400)
            .json({ message: "Product ID parameter is required." });
    }
    const product = yield Product_1.default.findOne({ _id: req.body.id }).exec();
    if (!product) {
        return res
            .status(409)
            .json({ message: `No product matches ID ${req.body.id}.` });
    }
    const product2 = yield Product_1.default.findOne({ name: req.body.name }).exec();
    if (product2 && (product2 === null || product2 === void 0 ? void 0 : product2.id) !== (product === null || product === void 0 ? void 0 : product.id)) {
        console.log({ message: `Naming conflict` });
        return res.status(409).json({ message: `Naming conflict`, aa: "bb" });
    }
    if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.name) {
        product.name = req.body.name;
        product.productType = req.body.productType;
        product.productFamily = req.body.productFamily;
        product.filters = req.body.filters;
        product.seasonality = req.body.seasonality;
        product.availability = req.body.availability;
        product.price = req.body.price;
        product.description = req.body.description;
        product.imagesurls = req.body.imagesurls;
        product.thumbnailurl = req.body.thumbnailurl;
    }
    const result = yield product.save();
    res.json(result);
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find()
        .populate("productType", "productType")
        .populate("productFamily", "productFamily")
        .populate("filters", "filter")
        .exec((err, list) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        else {
            res.status(200).json(list.sort((a, b) => a.name.localeCompare(b.name)));
        }
    });
});
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (!((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id))
        return res.status(400).json({ message: "Product ID required" });
    const product = yield Product_1.default.findOne({ _id: req.params.id })
        .populate("filters", "filter")
        .exec();
    if (!product) {
        return res
            .status(204)
            .json({ message: `Product ID ${req.params.id} not found` });
    }
    res.json(product);
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const id = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.id;
    if (!id)
        return res.status(400).json({ message: "Producyt ID required" });
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Incorrect ID format" });
    const product = yield Product_1.default.findOne({
        _id: req.body.id,
    }).exec();
    if (!product) {
        return res.status(204).json({ message: "" });
    }
    const result = yield product.deleteOne({ _id: req.body.id });
    res.json(result);
});
exports.default = {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    updateProduct,
};
