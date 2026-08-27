import { Router, Request, Response } from "express";
import sql from "../util/db";
import { requireAuth } from "../authMiddleware";

const router = Router();

// ─── POST /conversations/start ────────────────────────────────────────────────
// Ich erstelle eine Konversation für den Match zwischen mir und dem Partner,
// oder gebe die bereits bestehende zurück (idempotent). Da meine conversations-
// Tabelle über match_id an matches gekoppelt ist (nicht direkt über
// talent_id/company_id), hole ich zuerst den Match, danach die Konversation.
router.post("/start", requireAuth, async (req: Request, res: Response) => {
  const userId = req.auth!.userId!;
  const role = req.auth!.role!;
  const { partnerId } = req.body as { partnerId: string };

  if (!partnerId) {
    return res.status(400).json({ error: "partnerId ist erforderlich" });
  }

  const talentId = role === "talent" ? userId : partnerId;
  const companyId = role === "talent" ? partnerId : userId;

  try {
    const [match] = await sql`
      SELECT id, status FROM matches
      WHERE talent_id = ${talentId}::uuid AND company_id = ${companyId}::uuid
    `;

    if (!match) {
      return res
        .status(404)
        .json({ error: "Kein Match zwischen diesen Usern gefunden" });
    }

    // Ich prüfe erst, ob für diesen Match schon eine Konversation existiert,
    // bevor ich eine neue anlege — verhindert Duplikate beim erneuten Klick.
    const [existing] = await sql`
      SELECT id FROM conversations WHERE match_id = ${match.id}
    `;

    let conversationId: string;
    if (existing) {
      conversationId = existing.id;
    } else {
      const [created] = await sql`
        INSERT INTO conversations (match_id)
        VALUES (${match.id})
        RETURNING id
      `;
      conversationId = created.id;
    }

    // Ich setze den Match auf 'accepted', sobald die erste Konversation
    // gestartet wird — das ist der natürliche Übergang von Interesse zu
    // aktivem Kontakt und macht response-reliability gleichzeitig korrekt.
    if (match.status === "pending") {
      await sql`UPDATE matches SET status = 'accepted' WHERE id = ${match.id}`;
    }

    return res.json({ conversationId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Server Fehler", detail: msg });
  }
});

// ─── GET /conversations ───────────────────────────────────────────────────────
// Ich liefere alle Konversationen des eingeloggten Users mit letzter Nachricht
// und Anzahl ungelesener Nachrichten — über den Umweg matches, weil
// conversations keine direkten talent_id/company_id Spalten hat.
router.get("/", requireAuth, async (req: Request, res: Response) => {
  const userId = req.auth!.userId!;
  const role = req.auth!.role!;

  try {
    const rows = await sql`
      SELECT
        c.id AS conversation_id,
        c.created_at,
        CASE WHEN ${role} = 'talent' THEN m.company_id ELSE m.talent_id END AS partner_id,
        CASE WHEN ${role} = 'talent'
          THEN cp.profile_data->>'companyName'
          ELSE tp.profile_data->>'name'
        END AS partner_name,
        CASE WHEN ${role} = 'talent'
          THEN cp.profile_data->>'companyLogo'
          ELSE tp.profile_data->>'profileImage'
        END AS partner_image,
        (
          SELECT message_text FROM messages
          WHERE conversation_id = c.id
          ORDER BY created_at DESC LIMIT 1
        ) AS last_message,
        (
          SELECT created_at FROM messages
          WHERE conversation_id = c.id
          ORDER BY created_at DESC LIMIT 1
        ) AS last_message_at,
        (
          SELECT COUNT(*) FROM messages
          WHERE conversation_id = c.id
            AND read_at IS NULL
            AND sender_id != ${userId}::uuid
        ) AS unread_count
      FROM conversations c
      JOIN matches m ON m.id = c.match_id
      LEFT JOIN talent_profiles tp ON tp.user_id = m.talent_id
      LEFT JOIN company_profiles cp ON cp.user_id = m.company_id
      WHERE m.talent_id = ${userId}::uuid OR m.company_id = ${userId}::uuid
      ORDER BY last_message_at DESC NULLS LAST, c.created_at DESC
    `;

    return res.json({ conversations: rows });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Server Fehler", detail: msg });
  }
});

// ─── GET /conversations/:id — Konversationsinfo für den Chat-Header ──────────
// Ich brauche diesen Endpoint, weil die ConversationPage den Partnernamen
// und das Profilbild für den Header-Bereich benötigt, ohne alle Konversationen
// laden zu müssen.
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const userId = req.auth!.userId!;
  const role = req.auth!.role!;
  const conversationId = req.params.id as string;

  try {
    const [row] = await sql`
      SELECT
        c.id,
        c.created_at,
        CASE WHEN ${role} = 'talent' THEN m.company_id ELSE m.talent_id END AS partner_id,
        CASE WHEN ${role} = 'talent'
          THEN cp.profile_data->>'companyName'
          ELSE tp.profile_data->>'name'
        END AS partner_name,
        CASE WHEN ${role} = 'talent'
          THEN cp.profile_data->>'companyLogo'
          ELSE tp.profile_data->>'profileImage'
        END AS partner_image
      FROM conversations c
      JOIN matches m ON m.id = c.match_id
      LEFT JOIN talent_profiles tp ON tp.user_id = m.talent_id
      LEFT JOIN company_profiles cp ON cp.user_id = m.company_id
      WHERE c.id = ${conversationId}::uuid
        AND (m.talent_id = ${userId}::uuid OR m.company_id = ${userId}::uuid)
    `;

    if (!row) {
      return res
        .status(403)
        .json({ error: "Kein Zugriff auf diese Konversation" });
    }

    return res.json({ conversation: row });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Server Fehler", detail: msg });
  }
});

// ─── GET /conversations/:id/messages ─────────────────────────────────────────
// Ich prüfe den Zugriff über den Join zu matches, weil conversations selbst
// keine talent_id/company_id besitzt, an denen ich direkt prüfen könnte.
router.get(
  "/:id/messages",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.auth!.userId!;
    const conversationId = req.params.id as string;

    try {
      const [conv] = await sql`
        SELECT c.id FROM conversations c
        JOIN matches m ON m.id = c.match_id
        WHERE c.id = ${conversationId}::uuid
          AND (m.talent_id = ${userId}::uuid OR m.company_id = ${userId}::uuid)
      `;

      if (!conv) {
        return res
          .status(403)
          .json({ error: "Kein Zugriff auf diese Konversation" });
      }

      await sql`
        UPDATE messages
        SET read_at = NOW()
        WHERE conversation_id = ${conversationId}::uuid
          AND sender_id != ${userId}::uuid
          AND read_at IS NULL
      `;

      const messages = await sql`
        SELECT
          id,
          sender_id,
          message_text AS content,
          (read_at IS NOT NULL) AS is_read,
          created_at,
          sender_id = ${userId}::uuid AS is_own
        FROM messages
        WHERE conversation_id = ${conversationId}::uuid
        ORDER BY created_at ASC
      `;

      return res.json({ messages });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return res.status(500).json({ error: "Server Fehler", detail: msg });
    }
  },
);

// ─── POST /conversations/:id/messages ────────────────────────────────────────
router.post(
  "/:id/messages",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.auth!.userId!;
    const role = req.auth!.role!;
    const conversationId = req.params.id as string;
    const { content } = req.body as { content: string };

    if (!content?.trim()) {
      return res.status(400).json({ error: "Nachricht darf nicht leer sein" });
    }

    try {
      const [conv] = await sql`
        SELECT c.id, m.id AS match_id, m.created_at AS match_created_at FROM conversations c
        JOIN matches m ON m.id = c.match_id
        WHERE c.id = ${conversationId}::uuid
          AND (m.talent_id = ${userId}::uuid OR m.company_id = ${userId}::uuid)
      `;

      if (!conv) {
        return res
          .status(403)
          .json({ error: "Kein Zugriff auf diese Konversation" });
      }

      const [message] = await sql`
        INSERT INTO messages (conversation_id, sender_id, message_text)
        VALUES (${conversationId}::uuid, ${userId}::uuid, ${content.trim()})
        RETURNING id, sender_id, message_text AS content, (read_at IS NOT NULL) AS is_read, created_at
      `;

      const respondedField = role === "talent" ? "talent_responded" : "company_responded";
      const responseTimeField =
        role === "talent" ? "talent_response_time_hours" : "company_response_time_hours";

      await sql`
        UPDATE matches
        SET
          ${sql(respondedField)} = TRUE,
          ${sql(responseTimeField)} = COALESCE(
            ${sql(responseTimeField)},
            GREATEST(
              0,
              FLOOR(EXTRACT(EPOCH FROM (NOW() - ${conv.match_created_at})) / 3600)::int
            )
          ),
          last_message_from = ${userId}::uuid,
          last_message_at = NOW(),
          updated_at = NOW()
        WHERE id = ${conv.match_id}
      `;

      return res.status(201).json({ message: { ...message, is_own: true } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return res.status(500).json({ error: "Server Fehler", detail: msg });
    }
  },
);

export default router;
