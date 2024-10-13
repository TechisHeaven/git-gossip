import express from "express";
import dotenv from "dotenv";
import { ensureAuthenticated } from "../../server";
import axios from "axios";

dotenv.config();
const router = express.Router();

router.get("/", ensureAuthenticated, async (req: any, res) => {
  const token = req.user.accessToken; // Assuming you have stored the access token in the user session
  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        page: 1,
        per_page: 100,
        type: "all", // Fetch all repository types (public, private, and forked)
      },
    });

    const sortedRepos = response.data.sort(
      (
        a: {
          updated_at: Date;
        },
        b: {
          updated_at: Date;
        }
      ) => {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      }
    );

    res.json(sortedRepos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ message: "Error fetching repositories" });
  }
});

export default router;
