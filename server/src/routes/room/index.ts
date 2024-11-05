import express from "express";
import dotenv from "dotenv";
import { ensureAuthenticated } from "../../server";
import axios from "axios";

dotenv.config();
const router = express.Router();

router.get("/", ensureAuthenticated, async (req: any, res) => {});

export default router;
