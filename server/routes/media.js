import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../db.js";
import requireAuth from "../middleware/requireAuth.js";
import { validateMediaItem } from "../validators/mediaValidators.js";

const router = express.Router();

// GET /api/media?status=Reading&genre=Sci-Fi&mediaType=Book&search=dune
router.get("/", requireAuth, async (req, res) => {
  try {
    const db = await connectDB();
    const { status, genre, mediaType, search } = req.query;

    const filter = { ownerId: new ObjectId(req.user._id) };
    if (status) filter.status = status;
    if (genre) filter.genre = genre;
    if (mediaType) filter.mediaType = mediaType;
    if (search) filter.title = { $regex: search, $options: "i" };

    const items = await db
      .collection("media")
      .find(filter)
      .sort({ addedDate: -1 })
      .toArray();
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch media items" });
  }
});

// GET /api/media/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const db = await connectDB();
    const item = await db.collection("media").findOne({
      _id: new ObjectId(req.params.id),
      ownerId: new ObjectId(req.user._id),
    });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch {
    res.status(400).json({ error: "Invalid item id" });
  }
});

// POST /api/media
router.post("/", requireAuth, async (req, res) => {
  const errors = validateMediaItem(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const db = await connectDB();
    const newItem = {
      ...req.body,
      ownerId: new ObjectId(req.user._id),
      addedDate: new Date(),
    };
    const result = await db.collection("media").insertOne(newItem);
    res.status(201).json({ _id: result.insertedId, ...newItem });
  } catch {
    res.status(500).json({ error: "Failed to create media item" });
  }
});

// PUT /api/media/:id
router.put("/:id", requireAuth, async (req, res) => {
  const errors = validateMediaItem(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const db = await connectDB();
    // eslint-disable-next-line no-unused-vars
    const { addedDate, ownerId, _id, ...updateFields } = req.body;

    const result = await db.collection("media").findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        ownerId: new ObjectId(req.user._id),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) return res.status(404).json({ error: "Item not found" });
    res.json(result);
  } catch {
    res.status(400).json({ error: "Invalid item id" });
  }
});

// DELETE /api/media/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("media").deleteOne({
      _id: new ObjectId(req.params.id),
      ownerId: new ObjectId(req.user._id),
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch {
    res.status(400).json({ error: "Invalid item id" });
  }
});

export default router;
