import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { connectDB } from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const db = await connectDB();
    const existing = await db.collection("users").findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db
      .collection("users")
      .insertOne({ email, passwordHash, createdAt: new Date() });

    req.login({ _id: result.insertedId, email }, (err) => {
      if (err)
        return res.status(500).json({ error: "Login after signup failed" });
      res.status(201).json({ email });
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ email: req.user.email });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out" });
  });
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ error: "Not logged in" });
  res.json({ email: req.user.email });
});

export default router;
