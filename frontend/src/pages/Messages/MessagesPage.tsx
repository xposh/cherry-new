import { useEffect, useState } from "react";
import { Mail, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
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
        const res = await authFetch("http://localhost:3000/conversations");
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

      <div className="max-w-4xl mx-auto px-8 pt-40 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <Mail className="w-8 h-8 text-[#FEF6EA]" strokeWidth={1} />
          <h1 className="text-3xl font-light text-[#FEF6EA] uppercase tracking-widest">
            Messages
          </h1>
        </div>

        {loading ? (
          <p className="text-[#FEF6EA]/40 text-center py-20">Loading...</p>
        ) : conversations.length > 0 ? (
          <div className="space-y-0 border-t border-white/10">
            {conversations.map((conv) => (
              <button
                key={conv.conversation_id}
                onClick={() => navigate(`/messages/${conv.conversation_id}`)}
                className="w-full flex items-center gap-5 py-6 border-b border-white/10 hover:bg-white/5 transition-colors text-left px-2"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-white/20">
                  {conv.partner_image ? (
                    <img
                      src={conv.partner_image}
                      alt={conv.partner_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#FEF6EA]/50 text-lg font-light">
                      {conv.partner_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[#FEF6EA] font-light truncate">
                      {conv.partner_name}
                    </p>
                    {conv.last_message_at && (
                      <span className="text-[#FEF6EA]/40 text-xs flex-shrink-0 ml-4">
                        {timeAgo(conv.last_message_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-[#FEF6EA]/50 text-sm truncate">
                    {conv.last_message ?? "No messages yet"}
                  </p>
                </div>

                {/* Unread badge + chevron */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {conv.unread_count > 0 && (
                    <span className="bg-[#FF6F00] text-black text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                  <ChevronRight
                    className="w-4 h-4 text-[#FEF6EA]/30"
                    strokeWidth={1}
                  />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Mail
              className="w-24 h-24 text-[#FEF6EA]/20 mb-6"
              strokeWidth={0.5}
            />
            <p className="text-[#FEF6EA]/50 text-lg text-center">
              No messages yet
            </p>
            <p className="text-[#FEF6EA]/30 text-sm text-center mt-2">
              Start matching to begin conversations
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
