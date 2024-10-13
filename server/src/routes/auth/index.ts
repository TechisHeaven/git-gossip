import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { ensureAuthenticated } from "../../server";

dotenv.config();
const router = express.Router();
const redirectUrl = process.env.MAIN_REDIRECT_URL!;
const redirectUrlAuth = process.env.MAIN_REDIRECT_URL! + "auth";

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

    // console.log(req.user);
    const user = req.user! as {
      id: string;
      displayName: string;
      profileUrl: string;
      profileImage: string;
      photos: [{ value: string }];
      accessToken: string;
    };

    // Generate a token (JWT or any other method you prefer)
    const token = jwt.sign(
      {
        id: user.id,
        displayName: user.displayName,
        profileUrl: user.profileUrl,
        profileImage: user.profileImage || user.photos[0].value,
        accessToken: user.accessToken,
      },
      process.env.JWT_SECRET!, // Use a strong secret key for signing the token
      { expiresIn: "1h" }
    );

    // res.json({ message: "Authentication successful", token });
    res.redirect(`${redirectUrlAuth}?token=${token}`);
  }
);

// Protected route (example)
router.get("/protected-route", ensureAuthenticated, function (req, res) {
  res.send("You are authenticated!");
});

router.get("/user", ensureAuthenticated, (req: any, res: Response) => {
  // Retrieve user data from the database or session
  const userData = {
    id: req.user.id,
    name: req.user.displayName,
    profileUrl: req.user.profileUrl,
    profileImage: req.user.profileImage,
    accessToken: req.user.accessToken,
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
