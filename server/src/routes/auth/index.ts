import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import dotenv from "dotenv";
import { ensureAuthenticated } from "../../server";

dotenv.config();
const router = express.Router();
const redirectUrl = process.env.MAIN_REDIRECT_URL!;
const redirectUrlAuth = process.env.MAIN_REDIRECT_URL! + "/auth";

// Authentication routes
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: redirectUrlAuth,
  }),
  function (req, res) {
    // Handle successful authentication
    // Redirect to the desired page or store user information in the session
    // res.json({ message: "Authentication successful", user: req.user });
    res.redirect("http://localhost:5173");
  }
);

// Protected route (example)
router.get("/protected-route", ensureAuthenticated, function (req, res) {
  res.send("You are authenticated!");
});

router.get("/user", ensureAuthenticated, (req: any, res: Response) => {
  // Retrieve user data from the database or session
  console.log(req.user);
  const userData = {
    id: req.user.user.id,
    name: req.user.user.displayName,
    profileUrl: req.user.user.profileUrl,
    profileImage: req.user.user.profileImage,
  };
  res.json(userData);
});

router.get("/logout", (req: any, res) => {
  try {
    req.logout(function (err: any) {
      // res.redirect("http://localhost:5173/#/profile");
    });
    res.status(200).json({ message: "Logout User Success!" });
  } catch (error) {
    console.log("Error during logout Main:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  // res.redirect(redirectUrlAuth);
});

export default router;
