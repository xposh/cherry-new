// @file: frontend/src/pages/Messages/ConversationPage.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Send, ChevronUp, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../context/useAuth";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  is_own: boolean;
}

interface ConversationInfo {
  id: string;
  partner_id: string;
  partner_name: string;
  partner_image: string | null;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(isoString: string): string {
  const d = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// Ich gruppiere Nachrichten nach Datum, damit Datumstrennlinien
// zwischen Tageswechseln automatisch eingefügt werden.
function groupMessagesByDate(messages: Message[]) {
  const groups: { label: string; items: Message[] }[] = [];
  let currentLabel = "";
  for (const msg of messages) {
    const label = formatDateLabel(msg.created_at);
    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, items: [msg] });
    } else {
      groups[groups.length - 1].items.push(msg);
    }
  }
  return groups;
}

// Ich speichere den aktuellen Zeitstempel in State, damit der Render
// rein bleibt — Date.now() direkt im Render ist ein Seiteneffekt.
function use24hTimer(messages: Message[]): string | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (messages.length === 0) return null;
  const last = messages[messages.length - 1];
  if (!last.is_own) return null;

  const deadline = new Date(last.created_at).getTime() + 24 * 3_600_000;
  const diff = deadline - now;
  if (diff <= 0) return "Awaiting reply";

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m left to reply`;
}

// Vorgefertigte Schnellantworte — spart Zeit und senkt die Hemmschwelle
// für die erste Nachricht (bewährt in B2B-Kommunikations-Apps).
const QUICK_REPLIES = [
  "I'd love to learn more! 🎯",
  "Can we schedule a call?",
  "I'll send you my portfolio.",
  "Thank you for reaching out!",
  "Let's connect this week.",
];

export function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const [convInfo, setConvInfo] = useState<ConversationInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = use24hTimer(messages);

  // Ich lade die Konversationsinfo (Partnername, Bild) für den Header.
  useEffect(() => {
    if (!conversationId) return;
    // ✅ FIX: /api/ Präfix konsistent mit AuthProvider-Konvention
    authFetch(`/api/conversations/${conversationId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setConvInfo(d.conversation);
      })
      .catch(console.error);
  }, [conversationId, authFetch]);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      // ✅ FIX: führendes "/" ergänzt — ohne es trifft die Anfrage Vite statt das Backend
      const res = await authFetch(
        `/api/conversations/${conversationId}/messages`,
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

  // Ich scrolle nach jeder neuen Nachricht automatisch nach unten.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ich polle alle 5 Sekunden — einfach und zuverlässig für MVP.
  useEffect(() => {
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const handleSend = async (overrideText?: string) => {
    const content = (overrideText ?? input).trim();
    if (!content || sending || !conversationId) return;

    setSending(true);
    if (!overrideText) setInput("");
    setShowQuickReplies(false);

    // Optimistisches Update: Nachricht sofort sichtbar, bevor der Server
    // antwortet — das macht den Chat responsiv und schnell.
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      sender_id: "self",
      content,
      is_read: false,
      created_at: new Date().toISOString(),
      is_own: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      // ✅ FIX: /api/ Präfix konsistent mit den anderen Calls
      const res = await authFetch(
        `/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? data.message : m)),
        );
      } else {
        // Bei Fehler: optimistische Nachricht entfernen und Input zurücksetzen
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        if (!overrideText) setInput(content);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      if (!overrideText) setInput(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // Ich sende einen Meeting-Request als strukturierten Text — kein
  // zusätzliches Backend nötig, aber visuell hervorgehoben dargestellt.
  const handleMeetingRequest = () => {
    handleSend(
      "📅 Meeting Request\nI'd like to schedule a call to discuss further. Please share your availability!",
    );
  };

  const groups = groupMessagesByDate(messages);

  return (
    <div className="fixed inset-0 bg-black flex flex-col pb-24">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-white/5 bg-black">
        <div className="flex items-center gap-4 px-5 pt-14 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/5 transition-colors rounded-full flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" strokeWidth={1.5} />
          </button>

          {/* Partner Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/10 flex-shrink-0 flex items-center justify-center">
            {convInfo?.partner_image ? (
              <img
                src={convInfo.partner_image}
                alt={convInfo?.partner_name ?? ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white/40 font-light text-lg">
                {convInfo?.partner_name?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-light truncate text-base leading-tight">
              {convInfo?.partner_name ?? "Loading..."}
            </p>
            {/* 24h Response Timer — zeigt wann eine Antwort erwartet wird */}
            {timer && (
              <p className="text-xs mt-0.5" style={{ color: "#FF6F00" }}>
                ⏱ {timer}
              </p>
            )}
          </div>

          {/* Meeting-Request-Button im Header */}
          <button
            onClick={handleMeetingRequest}
            className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:border-white/20 transition-colors rounded-sm flex-shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Schedule
            </span>
          </button>
        </div>
      </div>

      {/* ─── Nachrichtenliste ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/20 text-sm tracking-[0.3em] uppercase">
              Loading...
            </p>
          </div>
        ) : groups.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: "rgba(255,111,0,0.08)" }}
            >
              <span className="text-3xl">👋</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed">
              Start the conversation with
              <br />
              {convInfo?.partner_name ?? "your match"}.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              {/* Datumstrennlinie */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[11px] text-white/20 uppercase tracking-widest flex-shrink-0">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="space-y-1">
                {group.items.map((msg, i) => {
                  const prev = i > 0 ? group.items[i - 1] : null;
                  const isFirstInSequence = !prev || prev.is_own !== msg.is_own;
                  const isMeetingRequest = msg.content.startsWith("📅");

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${msg.is_own ? "justify-end" : "justify-start"} ${isFirstInSequence ? "mt-4" : "mt-0.5"}`}
                    >
                      {/* Partner-Avatar nur bei erstem Eintrag in einer Sequenz */}
                      {!msg.is_own && (
                        <div className="w-8 mr-2 flex-shrink-0 self-end pb-4">
                          {isFirstInSequence ? (
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center">
                              {convInfo?.partner_image ? (
                                <img
                                  src={convInfo.partner_image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white/40 text-xs">
                                  {convInfo?.partner_name?.[0]?.toUpperCase() ??
                                    "?"}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="w-7" />
                          )}
                        </div>
                      )}

                      <div
                        className={`flex flex-col max-w-[72%] ${msg.is_own ? "items-end" : "items-start"}`}
                      >
                        {/* Meeting-Request erhält spezielles Styling */}
                        {isMeetingRequest ? (
                          <div
                            className={`px-4 py-3 rounded-2xl ${msg.is_own ? "rounded-br-sm" : "rounded-bl-sm"}`}
                            style={
                              msg.is_own
                                ? {
                                    backgroundColor: "rgba(255,111,0,0.15)",
                                    border: "1px solid rgba(255,111,0,0.3)",
                                  }
                                : {
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                  }
                            }
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar
                                className="w-4 h-4 flex-shrink-0"
                                style={{ color: "#FF6F00" }}
                                strokeWidth={1.5}
                              />
                              <span
                                className="text-xs uppercase tracking-wider font-medium"
                                style={{ color: "#FF6F00" }}
                              >
                                Meeting Request
                              </span>
                            </div>
                            {msg.content
                              .split("\n")
                              .slice(1)
                              .map((line, li) => (
                                <p
                                  key={li}
                                  className="text-sm font-light text-white/80 leading-relaxed"
                                >
                                  {line}
                                </p>
                              ))}
                          </div>
                        ) : (
                          <div
                            className={`px-4 py-3 text-sm font-light leading-relaxed rounded-2xl ${
                              msg.is_own
                                ? "rounded-br-sm text-black"
                                : "rounded-bl-sm text-white/90"
                            }`}
                            style={
                              msg.is_own
                                ? { backgroundColor: "#FF6F00" }
                                : {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                  }
                            }
                          >
                            {msg.content}
                          </div>
                        )}

                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-white/20">
                            {formatTime(msg.created_at)}
                          </span>
                          {msg.is_own && msg.is_read && (
                            <span
                              className="text-[10px]"
                              style={{ color: "#FF6F00" }}
                            >
                              ✓✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ─── Quick Replies ────────────────────────────────────────────────── */}
      {showQuickReplies && (
        <div className="flex-shrink-0 flex gap-2 px-4 pb-2 overflow-x-auto mb-24">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="flex-shrink-0 px-4 py-2 rounded-full border border-white/10 text-white/60 text-sm hover:border-white/25 hover:text-white/90 transition-all whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* ─── Input-Bereich ────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-white/5 px-4 pt-3 pb-8 mb-24">
        <div className="flex items-center gap-3">
          {/* Quick-Reply-Toggle */}
          <button
            onClick={() => setShowQuickReplies((v) => !v)}
            className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
              showQuickReplies
                ? "text-[#FF6F00]"
                : "text-white/25 hover:text-white/50"
            }`}
            style={
              showQuickReplies
                ? { backgroundColor: "rgba(255,111,0,0.12)" }
                : {}
            }
          >
            <ChevronUp
              className={`w-4 h-4 transition-transform duration-200 ${showQuickReplies ? "" : "rotate-180"}`}
              strokeWidth={2}
            />
          </button>

          {/* Eingabefeld */}
          <div className="flex-1 flex items-center bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Write a message..."
              className="flex-1 bg-transparent text-white/90 placeholder:text-white/20 focus:outline-none text-sm font-light"
            />
          </div>

          {/* Senden-Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="p-2.5 rounded-full transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
            style={{
              backgroundColor:
                input.trim() && !sending ? "#FF6F00" : "rgba(255,255,255,0.05)",
            }}
          >
            <Send
              className={`w-4 h-4 ${input.trim() && !sending ? "text-black" : "text-white/30"}`}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
