import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../context/useAuth";

/**
 * Diese Seite rendert nichts Sichtbares. Sie empfängt die partnerId aus dem
 * URL-Parameter, startet eine Konversation über das Backend und leitet sofort
 * zur ConversationPage weiter. Die gesamte Business-Logik (Idempotenz,
 * Match-Status-Update) liegt im Backend-Endpoint POST /conversations/start.
 */
export function StartConversationPage() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  useEffect(() => {
    if (!partnerId) {
      navigate("/messages", { replace: true });
      return;
    }

    let isMounted = true;

    async function start() {
      try {
        const res = await authFetch("/api/conversations/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partnerId }),
        });

        if (!isMounted) return;

        if (res.ok) {
          const { conversationId } = await res.json();
          navigate(`/messages/${conversationId}`, { replace: true });
        } else {
          navigate("/messages", { replace: true });
        }
      } catch {
        if (isMounted) navigate("/messages", { replace: true });
      }
    }

    start();
    return () => {
      isMounted = false;
    };
  }, [partnerId, authFetch, navigate]);

  // Minimales Lade-Overlay, damit der Übergang nicht wie ein weißer Blitz wirkt.
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white/30 text-sm tracking-[0.3em] uppercase">
        Opening chat...
      </p>
    </div>
  );
}
