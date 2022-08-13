"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sortOther_1 = __importDefault(require("./../utils/sortOther"));
describe("sortOther", () => {
    it("List 1", () => {
        const list = ["Y", "Z", "inne", "a"];
        const result = list.sort(sortOther_1.default);
        expect(result).toEqual(["a", "Y", "Z", "inne"]);
    });
});
