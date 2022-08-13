"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const router = express_1.default.Router();
router.post("/create", verifyJWT_1.default, verifyAdmin_1.default, userController_1.default.createUser);
// router.post("/create", verifyJWT, verifyAdmin, controller.createUser);
router.get("/", verifyJWT_1.default, userController_1.default.getAllUsers);
router.get("/get", verifyJWT_1.default, verifyAdmin_1.default, userController_1.default.getAllUsers); //test
router.get("/user/:id", verifyJWT_1.default, userController_1.default.getUser);
router.delete("/delete", verifyJWT_1.default, verifyAdmin_1.default, userController_1.default.deleteUser);
router.put("/changepassword", verifyJWT_1.default, userController_1.default.changePassword);
router.put("/resetpassword", verifyJWT_1.default, verifyAdmin_1.default, userController_1.default.resetPassword);
module.exports = router;
