import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { ensureAuthenticated } from "../../server";
import { StringLiteral } from "typescript";
import { db } from "../../db";
import { users } from "../../db/schemas";
import { sessions } from "../../db/schema";
import { sql } from "drizzle-orm";

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
  async function (req, res) {
    // Handle successful authentication
    // Redirect to the desired page or store user information in the session
    // res.json({ message: "Authentication successful", user: req.user });

    // console.log(req.user);
    const user = req.user! as {
      id: string;
      email: string;
      displayName: string;
      profileUrl: string;
      profileImage: string;
      photos: [{ value: string }];
      accessToken: string;
      username: string;
      location: string;
    };

    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(sql`${users.githubId} = ${user.id}`)
        .execute();

      let userId;
      if (existingUser.length === 0) {
        // User does not exist, create a new user
        await db
          .insert(users)
          .values({
            githubId: user.id,
            name: user.displayName,
            email: user.email, // Assuming the email is available in user object
            accessToken: user.accessToken,
          })
          .execute();
        const newUser = await db
          .select()
          .from(users)
          .where(sql`${users.githubId} = ${user.id}`);
        userId = newUser[0].id!;
      } else {
        // Update existing user information
        await db
          .update(users)
          .set({
            name: user.displayName,
            accessToken: user.accessToken,
            updatedAt: new Date(), // Set the updated timestamp
          })
          .where(sql`${users.githubId} = ${user.id}`)
          .execute();

        const newUser = await db
          .select()
          .from(users)
          .where(sql`${users.githubId} = ${user.id}`);

        userId = newUser[0].id!;
      }
      //check if a session already exists and its expiration
      const currentSession = await db
        .select()
        .from(sessions)
        .where(sql`${sessions.userId} = ${userId}`)
        .execute();

      let sessionToken;
      // After ensuring the user is created or updated, create a session
      // const sessionToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      //   expiresIn: "1h",
      // });
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Set expiration for 1 hour
      if (currentSession.length > 0) {
        const session = currentSession[0];
        // If the session has expired, delete it
        if (new Date(session.expiresAt!) < new Date()) {
          await db
            .delete(sessions)
            .where(sql`${sessions.id} = ${session.id}`)
            .execute();
        } else {
          // Update the existing session
          sessionToken = session.sessionToken; // Reuse the existing token or generate a new one
          await db
            .update(sessions)
            .set({
              expiresAt,
              accessToken: user.accessToken,
            })
            .where(sql`${sessions.id} = ${session.id}`)
            .execute();
        }
      }

      // If no valid session exists, create a new one
      if (!sessionToken) {
        sessionToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });
        await db
          .insert(sessions)
          .values({
            userId,
            sessionToken,
            accessToken: user.accessToken,
            expiresAt,
          })
          .execute();
      }

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          profileUrl: user.profileUrl,
          username: user.username,
          location: user.location,
          profileImage: user.profileImage || user.photos[0].value,
          accessToken: user.accessToken,
        },
        process.env.JWT_SECRET!, // Use a strong secret key for signing the token
        { expiresIn: "1h" }
      );

      res.redirect(`${redirectUrlAuth}?token=${token}`);
    } catch (error) {
      console.error("Error during GitHub authentication:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
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
    username: req.user.username,
    location: req.user.location,
    profileUrl: req.user.profileUrl,
    profileImage: req.user.profileImage,
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
