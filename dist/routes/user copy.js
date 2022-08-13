"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const router = express_1.default.Router();
router.post("/create", userController_1.default.createUser);
router.get("/", userController_1.default.getAllUsers);
router.get("/:id", userController_1.default.getUser);
router.delete("/delete", userController_1.default.deleteUser);
module.exports = router;
