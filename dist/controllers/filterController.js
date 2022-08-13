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
const Filter_1 = __importDefault(require("../model/Filter"));
const Product_1 = __importDefault(require("../model/Product"));
const createFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter } = req.body;
    if (!filter) {
        return res.status(400).json({ message: "filter required" });
    }
    // check for duplicate usernames in the db
    const duplicate = yield Filter_1.default.findOne({ filter: filter }).exec();
    if (duplicate)
        return res.status(409).json({ message: "filter already exist" }); //Conflict
    try {
        const result = yield Filter_1.default.create({
            filter: filter,
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
});
const getAllFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = yield Filter_1.default.find();
    if (!filters)
        return res.status(204).json({ message: "No filters found" });
    res.json(filters.sort((a, b) => a.filter.localeCompare(b.filter)));
});
const deleteFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id;
    if (!id)
        return res.status(400).json({ message: "Filter ID required" });
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Incorrect ID format" });
    const filter = yield Filter_1.default.findOne({ _id: req.body.id }).exec();
    if (!filter) {
        return res.status(204).json({ message: "" });
    }
    try {
        const ProductsWithFilter = yield Product_1.default.find({
            filters: req.body.id,
        }).exec();
        for (const product of ProductsWithFilter) {
            const newFilters = product.filters.filter((filter) => filter.toString() !== req.body.id);
            yield product.updateOne({ filters: newFilters });
            console.log(`deleted filter from ${product.name}`);
        }
    }
    catch (err) {
        console.log(err);
    }
    const result = yield filter.deleteOne({ _id: req.body.id });
    res.json(result);
});
exports.default = { createFilter, getAllFilters, deleteFilter };
