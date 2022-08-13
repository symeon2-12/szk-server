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
const Keyword_1 = __importDefault(require("../model/Keyword"));
const createKeyword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword } = req.body;
    if (!keyword) {
        return res.status(400).json({ message: "keyword required" });
    }
    // check for duplicate usernames in the db
    const duplicate = yield Keyword_1.default.findOne({
        keyword: keyword,
    }).exec();
    if (duplicate)
        return res.status(409).json({ message: "keyword already exist" }); //Conflict
    try {
        const result = yield Keyword_1.default.create({
            keyword: keyword,
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
    }
});
const getAllKeywords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keywords = yield Keyword_1.default.find();
    if (!keywords)
        return res.status(204).json({ message: "No usages found" });
    res.json(keywords.sort((a, b) => a.keyword.localeCompare(b.keyword)));
});
const deleteKeyword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id;
    if (!id)
        return res.status(400).json({ message: "Keyword ID required" });
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Incorrect ID format" });
    const keyword = yield Keyword_1.default.findOne({ _id: req.body.id }).exec();
    if (!keyword) {
        return res.status(204).json({ message: "" });
    }
    const result = yield keyword.deleteOne({ _id: req.body.id });
    res.json(result);
});
exports.default = { createKeyword, getAllKeywords, deleteKeyword };
