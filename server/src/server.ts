import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import GitHubStrategy from "passport-github";
import session from "express-session";
import * as middlewares from "./middleware";
import api from "./routes";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(helmet());
const allowedOrigins = [
  "chrome-extension://oplnbcbbpbbnoejiicbpkncgegjncnai", // Allow your extension
  "http://localhost:5173", // Allow your local development server (if applicable)
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET! || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 3600000,
    },
  })
);

// Configure Passport.js for GitHub authentication
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/v1/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle the user profile here

      (profile as any).accessToken = accessToken;
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (userSession: any, done) {
  const user = {
    id: userSession.id,
    displayName: userSession.displayName,
    username: userSession.username,
    location: userSession.location,
    profileUrl: userSession.profileUrl,
    profileImage: userSession.photos[0].value,
    accessToken: userSession.accessToken,
  };
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  // Retrieve user information from your database or session storage
  // ...
  done(null, { user });
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", api);

export function ensureAuthenticated(req: any, res: any, next: () => any) {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Assuming 'Bearer TOKEN'

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided. Unauthorized access." });
  }

  // Verify the token using your JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid token. Unauthorized access." });
    }

    // If the token is valid, attach the user data to the request object
    req.user = decoded as any;
  });
  console.log(req.user);
  if (req.user) {
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }
  // res.redirect(process.env.MAIN_REDIRECT_URL!);
  return res.status(401).json({
    message: "Not Authenticated",
  });
  // res.json("not authenicated");
}

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
