import { useEffect, useState } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { Logo } from "../../components/Logo";
import { useAuth } from "../../context/useAuth";

interface ConversationPreview {
  conversation_id: string;
  partner_id: string;
  partner_name: string;
  partner_image: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function MessagesPage() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await authFetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setConversations(data.conversations ?? []);
        }
      } catch (err) {
        console.error("Konversationen konnten nicht geladen werden:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [authFetch]);

  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      <Logo />

      <div className="max-w-2xl mx-auto px-8 pt-30 md:px-6 md:pt-40 pb-8">
        {conversations.length > 0 && (
          <p className="text-white/40 text-sm mb-12 mt-12 tracking-wide text-left">
            {`${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-5 border-b border-white/5 animate-pulse"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <div className="divide-y divide-white/5">
            {conversations.map((conv) => (
              <button
                key={conv.conversation_id}
                onClick={() => navigate(`/messages/${conv.conversation_id}`)}
                className="w-full flex items-center gap-5 py-5 hover:bg-white/[0.03] transition-colors text-left rounded-lg"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 border border-white/10">
                    {conv.partner_image ? (
                      <img
                        src={conv.partner_image}
                        alt={conv.partner_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-light text-white/30">
                        {conv.partner_name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  {conv.unread_count > 0 && (
                    <div
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium text-black"
                      style={{ backgroundColor: "#FF6F00" }}
                    >
                      {conv.unread_count > 9 ? "9+" : conv.unread_count}
                    </div>
                  )}
                </div>

                {/* Inhalt */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className={`font-light truncate ${conv.unread_count > 0 ? "text-white" : "text-white/80"}`}
                    >
                      {conv.partner_name}
                    </p>
                    {conv.last_message_at && (
                      <span className="text-white/30 text-xs flex-shrink-0 ml-3">
                        {timeAgo(conv.last_message_at)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm truncate ${conv.unread_count > 0 ? "text-white/60" : "text-white/30"}`}
                  >
                    {conv.last_message ?? "Conversation started"}
                  </p>
                </div>

                <ChevronRight
                  className="w-4 h-4 text-white/20 flex-shrink-0"
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        ) : (
          // Ich zeige einen einladenden Empty State mit direktem Link zu Cherry Picks
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
              style={{ backgroundColor: "rgba(255,111,0,0.1)" }}
            >
              <MessageSquare
                className="w-9 h-9"
                style={{ color: "#FF6F00" }}
                strokeWidth={1}
              />
            </div>
            <h2 className="text-2xl font-light text-white mb-3">
              No messages yet
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-xs">
              Start a conversation with one of your matches to see it here.
            </p>
            <Link
              to="/cherry-picks"
              className="px-8 py-3 border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors uppercase tracking-[0.2em] text-sm"
            >
              View Matches
            </Link>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
