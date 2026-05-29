import { Cherry, Mail } from "lucide-react";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { Logo } from "../../components/Logo";

export function MessagesPage() {
  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      {/* Logo */}
      <Logo />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <Mail className="w-8 h-8 text-white" />
          <h1 className="text-4xl font-light text-white uppercase tracking-wider">
            Messages
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <Mail className="w-24 h-24 text-white/20 mb-6" />
          <p className="text-gray-400 text-lg text-center">No messages yet</p>
          <p className="text-gray-500 text-sm text-center mt-2">
            Start matching to begin conversations
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
