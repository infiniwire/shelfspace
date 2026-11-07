import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import logger from "morgan";
import initializePassport from "./server/passport-config.js";
import authRoutes from "./server/routes/auth.js";

const app = express();

initializePassport(passport);

app.use(logger("dev"));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);

export default app;
