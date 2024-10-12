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

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "chrome-extension://oplnbcbbpbbnoejiicbpkncgegjncnai",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET! || "your_secret_key",
    resave: false,
    saveUninitialized: false,
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
      console.log(profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (userSession: any, done) {
  const user = {
    id: userSession.id,
    displayName: userSession.displayName,
    username: userSession.username,
    profileUrl: userSession.profileUrl,
    profileImage: userSession.photos[0].value,
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
  if (req.isAuthenticated()) {
    return next();
  }
  // res.redirect(process.env.MAIN_REDIRECT_URL!);
  res.status(401).json({
    message: "Not Authenticated",
  });
  // res.json("not authenicated");
}

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
