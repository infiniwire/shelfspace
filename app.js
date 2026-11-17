import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import logger from "morgan";
import initializePassport from "./server/passport-config.js";
import authRoutes from "./server/routes/auth.js";
import mediaRoutes from "./server/routes/media.js";
import loanRoutes from "./server/routes/loans.js";
import path from "path";

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
app.use("/api/media", mediaRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

const distPath = path.join(import.meta.dirname, "frontend", "dist");
app.use(express.static(distPath));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

export default app;
