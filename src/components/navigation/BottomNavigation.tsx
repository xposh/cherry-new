import { Search, Home, Cherry, Mail, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
              <Icon
                className="w-6 h-6"
                style={{
                  color: active ? "#ffffff" : "#6f6f6f",
                  strokeWidth: 1,
                }}
              />
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
