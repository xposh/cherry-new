import { Link, useLocation } from "react-router";
import { Compass, Heart, MessageCircle, User } from "lucide-react";

export function BottomNavigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/discover", icon: Compass, label: "Discover" },
    { path: "/cherry-picks", icon: Heart, label: "Cherry Picks" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/account", icon: User, label: "Account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 z-50">
      <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                active ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] uppercase tracking-wider font-light">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
