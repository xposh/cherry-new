import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Logo } from "../../components/Logo";
import { useAuth } from "../../context/useAuth";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  is_own: boolean;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await authFetch(
        `http://localhost:3000/conversations/${conversationId}/messages`,
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } catch (err) {
      console.error("Nachrichten konnten nicht geladen werden:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, authFetch]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Nach dem Laden und nach neuen Nachrichten ans Ende scrollen.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Einfaches Polling alle 5 Sekunden — ausreichend für ein MVP ohne
  // WebSocket-Komplexität, hält den Chat für beide Seiten aktuell.
  useEffect(() => {
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !conversationId) return;

    setSending(true);
    const optimisticContent = input.trim();
    setInput("");

    // Optimistisches Update: Nachricht sofort anzeigen, bevor der Server
    // antwortet, damit sich der Chat responsiv anfühlt.
    const optimisticMessage: Message = {
      id: `optimistic-${Date.now()}`,
      sender_id: "self",
      content: optimisticContent,
      is_read: false,
      created_at: new Date().toISOString(),
      is_own: true,
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await authFetch(
        `http://localhost:3000/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: optimisticContent }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        // Optimistische Nachricht durch die echte Server-Antwort ersetzen.
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMessage.id ? data.message : m)),
        );
      }
    } catch (err) {
      console.error("Nachricht konnte nicht gesendet werden:", err);
      // Optimistische Nachricht bei Fehler entfernen.
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setInput(optimisticContent);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-white/10 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 transition-colors rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-[#FEF6EA]" strokeWidth={1.5} />
        </button>
        <Logo />
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {loading ? (
          <p className="text-[#FEF6EA]/40 text-center text-sm">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-[#FEF6EA]/30 text-center text-sm pt-8">
            Sende die erste Nachricht.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.is_own ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm font-light leading-relaxed ${
                  msg.is_own
                    ? "bg-[#FF6F00] text-black rounded-br-sm"
                    : "bg-white/10 text-[#FEF6EA] rounded-bl-sm"
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    msg.is_own ? "text-black/50" : "text-[#FEF6EA]/40"
                  }`}
                >
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-3 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 bg-white/5 border border-white/20 rounded-2xl px-4 py-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-[#FEF6EA] placeholder:text-[#FEF6EA]/30 focus:outline-none text-sm font-light"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="p-2 bg-[#FF6F00] rounded-full hover:bg-[#FF6F00]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
