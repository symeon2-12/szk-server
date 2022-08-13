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
const Usage_1 = __importDefault(require("../model/Usage"));
const createUsage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usage } = req.body;
    if (!usage) {
        return res.status(400).json({ message: "usage required" });
    }
    // check for duplicate usernames in the db
    const duplicate = yield Usage_1.default.findOne({ usage: usage }).exec();
    if (duplicate)
        return res.status(409).json({ message: "usage already exist" }); //Conflict
    try {
        const result = yield Usage_1.default.create({
            usage: usage,
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
});
const getAllUsages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usages = yield Usage_1.default.find();
    if (!usages)
        return res.status(204).json({ message: "No usages found" });
    res.json(usages);
});
const deleteUsage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id;
    if (!id)
        return res.status(400).json({ message: "Usage ID required" });
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Incorrect ID format" });
    const usage = yield Usage_1.default.findOne({ _id: req.body.id }).exec();
    if (!usage) {
        return res.status(204).json({ message: "" });
    }
    const result = yield usage.deleteOne({ _id: req.body.id });
    res.json(result);
});
exports.default = { createUsage, getAllUsages, deleteUsage };
