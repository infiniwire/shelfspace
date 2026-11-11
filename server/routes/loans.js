import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../db.js";
import requireAuth from "../middleware/requireAuth.js";
import { statusFilter } from "../utils/loanStatus.js";
import { getLoanStatus } from "../utils/loanStatus.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const db = await connectDB();
    const now = new Date();
    const { status } = req.query;

    const statusConditions = statusFilter(status, now);

    if (status && !statusConditions) {
      return res.status(400).json({ error: "Unknown status filter" });
    }

    const filter = {
      ownerId: new ObjectId(req.user._id),
      ...statusConditions,
    };

    const items = await db
      .collection("loans")
      .find(filter)
      .sort({ dateOut: -1 })
      .toArray();
    const loans = items.map((loan) => ({
      ...loan,
      status: getLoanStatus(loan, now),
    }));
    res.json(loans);
  } catch {
    res.status(500).json({ error: "Failed to fetch loan items" });
  }
});

// GET /api/loans/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const db = await connectDB();
    const item = await db.collection("loans").findOne({
      _id: new ObjectId(req.params.id),
      ownerId: new ObjectId(req.user._id),
    });
    if (!item) return res.status(404).json({ error: "Loan not found" });
    res.json(item);
  } catch {
    res.status(400).json({ error: "Invalid item id" });
  }
});

export default router;
