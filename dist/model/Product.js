"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const changeNoToRanges_1 = __importDefault(require("../utils/changeNoToRanges"));
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    productType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "productType",
    },
    productFamily: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "productFamily",
    },
    filters: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Filter",
        },
    ],
    seasonality: [
        {
            type: Number,
        },
    ],
    availability: {
        type: String,
    },
    price: {
        type: String,
    },
    description: {
        type: String,
    },
    imagesurls: [
        {
            type: String,
        },
    ],
    thumbnailurl: {
        type: String,
    },
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });
ProductSchema.virtual("seasonality_hr").get(function () {
    return (0, changeNoToRanges_1.default)(this.seasonality);
});
exports.default = mongoose_1.default.model("Product", ProductSchema);
