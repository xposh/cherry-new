"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../util/db"));
const authMiddleware_1 = require("../authMiddleware");
const router = (0, express_1.Router)();
// GET /featured-opportunities/feed
// Curator feed: active opportunities from OTHER users (not the authenticated user).
router.get("/feed", authMiddleware_1.requireAuth, async (req, res) => {
    const ownerId = req.auth.userId;
    const viewerRole = req.auth.role;
    const targetOwnerRole = viewerRole === "talent"
        ? "company"
        : viewerRole === "company"
            ? "talent"
            : null;
    if (!targetOwnerRole) {
        return res.json({ opportunities: [] });
    }
    try {
        const opportunities = await (0, db_1.default) `
      SELECT
        featured_opportunities.id,
        featured_opportunities.owner_id,
        COALESCE(featured_opportunities.owner_role::text, u.role::text) AS owner_role,
        featured_opportunities.title,
        featured_opportunities.description,
        featured_opportunities.image_url,
        featured_opportunities.video_url,
        featured_opportunities.deadline,
        featured_opportunities.is_active,
        featured_opportunities.deleted_at,
        featured_opportunities.created_at,
        featured_opportunities.updated_at,
        EXTRACT(EPOCH FROM featured_opportunities.deadline - now())::int AS time_remaining_seconds
      FROM featured_opportunities
      JOIN users u ON u.id = featured_opportunities.owner_id
      WHERE featured_opportunities.owner_id <> ${ownerId}::uuid
        AND featured_opportunities.is_active = true
        AND featured_opportunities.deleted_at IS NULL
        AND COALESCE(featured_opportunities.owner_role::text, u.role::text) = ${targetOwnerRole}
      ORDER BY
        CASE WHEN featured_opportunities.deadline > now() THEN 0 ELSE 1 END,
        featured_opportunities.updated_at DESC,
        featured_opportunities.deadline ASC
      LIMIT 20
    `;
        return res.json({ opportunities });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: "Server error", detail: msg });
    }
});
// GET /featured-opportunities/me
// Owner feed: active, non-deleted opportunities for the authenticated user.
router.get("/me", authMiddleware_1.requireAuth, async (req, res) => {
    const ownerId = req.auth.userId;
    try {
        const opportunities = await (0, db_1.default) `
      SELECT
        id,
        owner_id,
        owner_role,
        title,
        description,
        image_url,
        video_url,
        deadline,
        is_active,
        deleted_at,
        created_at,
        updated_at,
        EXTRACT(EPOCH FROM deadline - now())::int AS time_remaining_seconds
      FROM featured_opportunities
      WHERE owner_id = ${ownerId}::uuid
        AND is_active = true
        AND deleted_at IS NULL
        AND deadline > now()
      ORDER BY deadline ASC
    `;
        return res.json({ opportunities });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: "Server error", detail: msg });
    }
});
// GET /featured-opportunities
// Backward-compatible alias for owner feed.
router.get("/", authMiddleware_1.requireAuth, async (req, res) => {
    const ownerId = req.auth.userId;
    try {
        const opportunities = await (0, db_1.default) `
      SELECT
        id,
        owner_id,
        owner_role,
        title,
        description,
        image_url,
        video_url,
        deadline,
        is_active,
        deleted_at,
        created_at,
        updated_at,
        EXTRACT(EPOCH FROM deadline - now())::int AS time_remaining_seconds
      FROM featured_opportunities
      WHERE owner_id = ${ownerId}::uuid
        AND is_active = true
        AND deleted_at IS NULL
        AND deadline > now()
      ORDER BY deadline ASC
    `;
        return res.json({ opportunities });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: "Server error", detail: msg });
    }
});
// GET /featured-opportunities/profile/:ownerId
// Returns the active featured opportunity for the requested owner.
router.get("/profile/:ownerId", authMiddleware_1.requireAuth, async (req, res) => {
    const { ownerId } = req.params;
    try {
        const [opportunity] = await (0, db_1.default) `
        SELECT
          id,
          owner_id,
          owner_role,
          title,
          description,
          image_url,
          video_url,
          deadline,
          is_active,
          deleted_at,
          created_at,
          updated_at,
          EXTRACT(EPOCH FROM deadline - now())::int AS time_remaining_seconds
        FROM featured_opportunities
        WHERE owner_id = ${ownerId}::uuid
          AND is_active = true
          AND deleted_at IS NULL
          AND deadline > now()
        ORDER BY deadline ASC
        LIMIT 1
      `;
        return res.json({ opportunity: opportunity || null });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: "Server error", detail: msg });
    }
});
// GET /featured-opportunities/public/profile/:ownerId
// Public endpoint: returns active featured opportunity for the requested owner.
router.get("/public/profile/:ownerId", async (req, res) => {
    const { ownerId } = req.params;
    try {
        const [opportunity] = await (0, db_1.default) `
      SELECT
        id,
        owner_id,
        owner_role,
        title,
        description,
        image_url,
        video_url,
        deadline,
        is_active,
        deleted_at,
        created_at,
        updated_at,
        EXTRACT(EPOCH FROM deadline - now())::int AS time_remaining_seconds
      FROM featured_opportunities
      WHERE owner_id = ${ownerId}::uuid
        AND is_active = true
        AND deleted_at IS NULL
        AND deadline > now()
      ORDER BY deadline ASC
      LIMIT 1
    `;
        return res.json({ opportunity: opportunity || null });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: "Server error", detail: msg });
    }
});
// POST /featured-opportunities
// Creates a new featured opportunity for the authenticated user.
router.post("/", authMiddleware_1.requireAuth, async (req, res) => {
    const ownerId = req.auth.userId;
    const ownerRole = req.auth.role;
    const { title, description, image_url, video_url, deadline } = req.body;
    if (!title?.trim() || !deadline) {
        return res.status(400).json({
            error: "Title and deadline are required",
        });
    }
    const parsedDeadline = new Date(deadline);
    if (Number.isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({ error: "Invalid deadline" });
    }
    try {
        const [created] = await (0, db_1.default) `
      INSERT INTO featured_opportunities
        (owner_id, owner_role, title, description, image_url, video_url, deadline)
      VALUES (
        ${ownerId}::uuid,
        ${ownerRole},
        ${title.trim()},
        ${description ?? null},
        ${image_url ?? null},
        ${video_url ?? null},
        ${parsedDeadline.toISOString()}
      )
      RETURNING id, owner_id, owner_role, title, description, image_url, video_url, deadline, is_active, deleted_at, created_at, updated_at
    `;
        return res.status(201).json({ opportunity: created });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: "Server error", detail: msg });
    }
});
// PATCH /featured-opportunities/:id
// Updates an opportunity if the caller owns it.
router.patch("/:id", authMiddleware_1.requireAuth, async (req, res) => {
    const ownerId = req.auth.userId;
    const { id } = req.params;
    const { title, description, image_url, video_url, deadline, is_active } = req.body;
    if (deadline !== undefined) {
        const parsedDeadline = new Date(deadline);
        if (Number.isNaN(parsedDeadline.getTime())) {
            return res.status(400).json({ error: "Invalid deadline" });
        }
    }
    try {
        const [existing] = await (0, db_1.default) `
      SELECT owner_id FROM featured_opportunities
      WHERE id = ${id}::int
        AND deleted_at IS NULL
    `;
        if (!existing) {
            return res.status(404).json({ error: "Opportunity not found" });
        }
        if (existing.owner_id !== ownerId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const fields = {};
        if (title !== undefined)
            fields.title = title.trim();
        if (description !== undefined)
            fields.description = description;
        if (image_url !== undefined)
            fields.image_url = image_url;
        if (video_url !== undefined)
            fields.video_url = video_url;
        if (deadline !== undefined)
            fields.deadline = new Date(deadline).toISOString();
        if (is_active !== undefined)
            fields.is_active = is_active;
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ error: "No valid update fields provided" });
        }
        const [updated] = await (0, db_1.default) `
      UPDATE featured_opportunities
      SET
        title = COALESCE(${fields.title ?? null}, title),
        description = COALESCE(${fields.description ?? null}, description),
        image_url = COALESCE(${fields.image_url ?? null}, image_url),
        video_url = COALESCE(${fields.video_url ?? null}, video_url),
        deadline = COALESCE(${fields.deadline ?? null}, deadline),
        is_active = COALESCE(${fields.is_active ?? null}, is_active),
        updated_at = now()
      WHERE id = ${id}::int
      RETURNING id, owner_id, owner_role, title, description, image_url, video_url, deadline, is_active, deleted_at, created_at, updated_at
    `;
        return res.json({ opportunity: updated });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: "Server error", detail: msg });
    }
});
// DELETE /featured-opportunities/:id
// Soft delete an opportunity for the authenticated owner.
router.delete("/:id", authMiddleware_1.requireAuth, async (req, res) => {
    const ownerId = req.auth.userId;
    const { id } = req.params;
    try {
        const [existing] = await (0, db_1.default) `
      SELECT owner_id FROM featured_opportunities
      WHERE id = ${id}::int
        AND deleted_at IS NULL
    `;
        if (!existing) {
            return res.status(404).json({ error: "Opportunity not found" });
        }
        if (existing.owner_id !== ownerId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        await (0, db_1.default) `
      UPDATE featured_opportunities
      SET deleted_at = now(), updated_at = now(), is_active = false
      WHERE id = ${id}::int
    `;
        return res.status(204).send();
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ error: "Server error", detail: msg });
    }
});
exports.default = router;
