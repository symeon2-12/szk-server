import express from "express";
import controller from "../controllers/refreshTokenController";

const router = express.Router();

router.get("/", controller.handleRefreshToken);

export = router;
