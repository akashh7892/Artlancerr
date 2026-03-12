/**
 * routes/public.js
 *
 * Unauthenticated public endpoints used by the /home preview page.
 * Uses your existing Artist and Opportunity (via opportunityRoutes model) models.
 *
 * Mounted at: /api/public  (in server.js)
 *
 * GET /api/public/artists        - paginated, searchable artist list
 * GET /api/public/opportunities  - paginated, searchable open opportunities
 */

const express = require("express");
const router = express.Router();
const Artist = require("../models/Artist");
const Opportunity = require("../models/Opportunity"); // adjust path if yours differs

/* ─── small helper ──────────────────────────────────────────────────────── */
const toInt = (val, fallback) => {
  const n = parseInt(val, 10);
  return isNaN(n) || n < 1 ? fallback : n;
};

/* ═══════════════════════════════════════════════════════════════════════════
   GET /api/public/artists
   ─────────────────────────────────────────────────────────────────────────
   Query params:
     search       – searches name, artCategory, location, bio  (case-insensitive)
     artCategory  – filter by role / art category              (partial match)
     page         – default 1
     limit        – default 12, max 24
═══════════════════════════════════════════════════════════════════════════ */
router.get("/artists", async (req, res) => {
  try {
    const page = toInt(req.query.page, 1);
    const limit = Math.min(toInt(req.query.limit, 12), 24);
    const skip = (page - 1) * limit;

    const filter = {};

    // category filter
    if (req.query.artCategory && req.query.artCategory !== "All") {
      filter.artCategory = { $regex: req.query.artCategory, $options: "i" };
    }

    // free-text search
    if (req.query.search && req.query.search.trim()) {
      const re = { $regex: req.query.search.trim(), $options: "i" };
      const searchClauses = [
        { name: re },
        { artCategory: re },
        { location: re },
        { bio: re },
      ];
      // merge with existing filter properly
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchClauses }];
        delete filter.$or;
      } else {
        filter.$or = searchClauses;
      }
    }

    const [artists, total] = await Promise.all([
      Artist.find(filter)
        .select(
          "name artCategory location avatar rating experience bio rates skills",
        )
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Artist.countDocuments(filter),
    ]);

    res.json({
      artists,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("[GET /api/public/artists]", err);
    res.status(500).json({ message: "Server error fetching artists" });
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   GET /api/public/opportunities
   ─────────────────────────────────────────────────────────────────────────
   Query params:
     search    – searches title, description, category, location  (case-insensitive)
     category  – filter by category / artCategory field           (partial match)
     page      – default 1
     limit     – default 10, max 20
═══════════════════════════════════════════════════════════════════════════ */
router.get("/opportunities", async (req, res) => {
  try {
    const page = toInt(req.query.page, 1);
    const limit = Math.min(toInt(req.query.limit, 10), 20);
    const skip = (page - 1) * limit;

    // Only show active/open listings
    const filter = {
      status: { $in: ["open", "active", "published"] },
    };

    // category filter
    if (req.query.category && req.query.category !== "All") {
      const catRe = { $regex: req.query.category, $options: "i" };
      filter.$or = [{ category: catRe }, { artCategory: catRe }];
    }

    // free-text search
    if (req.query.search && req.query.search.trim()) {
      const re = { $regex: req.query.search.trim(), $options: "i" };
      const searchClauses = [
        { title: re },
        { description: re },
        { category: re },
        { artCategory: re },
        { location: re },
        { projectType: re },
      ];
      if (filter.$or) {
        // already has a category $or — combine with $and
        filter.$and = [{ $or: filter.$or }, { $or: searchClauses }];
        delete filter.$or;
      } else {
        filter.$or = searchClauses;
      }
    }

    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter)
        .select(
          "title description category artCategory projectType " +
            "budgetMin budgetMax budget location deadline endDate " +
            "maxSlots availableSlots applicationCount status hirer",
        )
        .populate("hirer", "name companyName avatar") // populate hirer name for display
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Opportunity.countDocuments(filter),
    ]);

    res.json({
      opportunities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("[GET /api/public/opportunities]", err);
    res.status(500).json({ message: "Server error fetching opportunities" });
  }
});

module.exports = router;
