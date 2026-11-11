import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../db.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const db = await connectDB();

    const filter = { ownerId: new ObjectId(req.user._id) };

    const items = await db
      .collection("loans")
      .find(filter)
      .sort({ dateOut: -1 })
      .toArray();
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch loan items" });
  }
});

export default router;
