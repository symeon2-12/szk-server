"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortOther = (a, b) => {
    return a.toLowerCase() !== "inne" ? a.localeCompare(b) : 1;
};
exports.default = sortOther;
