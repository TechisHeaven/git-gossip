import express from "express";
import auth from "../routes/auth";
import repo from "../routes/repo";
import room from "../routes/room";

const router = express.Router();

router.use("/auth", auth);
router.use("/repo", repo);
router.use("/room", room);

export default router;
