import express from "express";
import controller from "../controllers/userController";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const router = express.Router();

router.post("/create", verifyJWT, verifyAdmin, controller.createUser);
// router.post("/create", verifyJWT, verifyAdmin, controller.createUser);
router.get("/", verifyJWT, controller.getAllUsers);
router.get("/get", verifyJWT, verifyAdmin, controller.getAllUsers); //test
router.get("/user/:id", verifyJWT, controller.getUser);
router.delete("/delete", verifyJWT, verifyAdmin, controller.deleteUser);
router.put("/changepassword", verifyJWT, controller.changePassword);
router.put("/resetpassword", verifyJWT, verifyAdmin, controller.resetPassword);

export = router;
