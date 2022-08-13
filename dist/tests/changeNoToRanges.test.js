"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const changeNoToRanges_1 = __importDefault(require("../utils/changeNoToRanges"));
describe("changeNoTorange", () => {
    it("No months", () => {
        const result = (0, changeNoToRanges_1.default)([]);
        expect(result).toEqual("niedostępne");
    });
    it("All months", () => {
        const result = (0, changeNoToRanges_1.default)([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        expect(result).toEqual("cały rok");
    });
    it("test 3", () => {
        const result = (0, changeNoToRanges_1.default)([1, 2]);
        expect(result).toEqual("styczeń-luty");
    });
    it("test 4", () => {
        const result = (0, changeNoToRanges_1.default)([2, 4, 5]);
        expect(result).toEqual("luty,kwiecień-maj");
    });
    it("test 4", () => {
        const result = (0, changeNoToRanges_1.default)([1, 4, 10, 11, 12]);
        expect(result).toEqual("styczeń,kwiecień,październik-grudzień");
    });
});
