import express from "express";
import auth from "../routes/auth";
import repo from "../routes/repo";

const router = express.Router();

router.use("/auth", auth);
router.use("/repo", repo);

export default router;
