import { Search, Home, Cherry, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/useAuth";
import { discoverService } from "../../services/discoverService";

const CHERRY_PICKS_LAST_SEEN_KEY = "cherryPicksLastSeenAt";

interface ConversationPreview {
  unread_count: number;
}

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authFetch, user } = useAuth();
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [hasUnseenCherryPicks, setHasUnseenCherryPicks] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "discover", label: "Discover", icon: Search, path: "/discover" },
    {
      id: "cherry-picks",
      label: "Cherry Picks",
      icon: Cherry,
      path: "/cherry-picks",
    },
    { id: "messages", label: "Messages", icon: Mail, path: "/messages" },
    { id: "account", label: "Account", icon: User, path: "/account" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isMessagesRoute = location.pathname.startsWith("/messages");
  const isCherryPicksRoute = location.pathname.startsWith("/cherry-picks");

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function loadNotificationState() {
      try {
        const [conversationsRes, matches] = await Promise.all([
          authFetch("/api/conversations"),
          discoverService.getMatches(authFetch),
        ]);

        if (!isMounted) return;

        if (conversationsRes.ok) {
          const data = (await conversationsRes.json()) as {
            conversations?: ConversationPreview[];
          };
          const hasUnread = (data.conversations ?? []).some(
            (conversation) => conversation.unread_count > 0,
          );
          setHasUnreadMessages(hasUnread);
        } else {
          setHasUnreadMessages(false);
        }

        const latestMatchedAt = matches.reduce<string | null>((latest, match) => {
          if (!latest) return match.matchedAt;
          return new Date(match.matchedAt).getTime() > new Date(latest).getTime()
            ? match.matchedAt
            : latest;
        }, null);

        if (!latestMatchedAt) {
          setHasUnseenCherryPicks(false);
          return;
        }

        if (isCherryPicksRoute) {
          localStorage.setItem(CHERRY_PICKS_LAST_SEEN_KEY, latestMatchedAt);
          setHasUnseenCherryPicks(false);
          return;
        }

        const lastSeenMatchAt = localStorage.getItem(CHERRY_PICKS_LAST_SEEN_KEY);
        setHasUnseenCherryPicks(
          !lastSeenMatchAt ||
            new Date(latestMatchedAt).getTime() >
              new Date(lastSeenMatchAt).getTime(),
        );
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load bottom navigation notifications:", error);
        setHasUnreadMessages(false);
        setHasUnseenCherryPicks(false);
      }
    }

    loadNotificationState();
    const intervalId = window.setInterval(loadNotificationState, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [authFetch, isCherryPicksRoute, user]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/70 border-t border-white/10 z-50 backdrop-blur-sm">
      <div className="flex items-center justify-around h-20 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
            >
              <div className="relative">
                <Icon
                  className="w-6 h-6"
                  style={{
                    color: active ? "#ffc8dd" : "#6f6f6f",
                    strokeWidth: 1,
                  }}
                />
                {item.id === "messages" && hasUnreadMessages && !isMessagesRoute ? (
                  <span className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-[#39D5FF]" />
                ) : null}
                {item.id === "cherry-picks" &&
                hasUnseenCherryPicks &&
                !isCherryPicksRoute ? (
                  <span className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-[#39D5FF]" />
                ) : null}
              </div>
              <span
                className="text-[10px] tracking-wider"
                style={{
                  color: "#6f6f6f",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
