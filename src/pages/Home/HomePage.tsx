import { Cherry, TrendingUp, Users } from "lucide-react";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";

export function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      {/* Logo */}
      <div className="fixed top-8 left-8 z-50">
        <h2
          className="text-2xl tracking-[0.3em] uppercase flex items-center gap-1"
          style={{ color: "#2A6087" }}
        >
          CHE
          <Cherry className="w-6 h-6" style={{ color: "#2A6087" }} />Y
        </h2>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-white uppercase tracking-wider mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">Find your perfect match today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border border-white/30 p-6">
            <TrendingUp className="w-8 h-8 text-white mb-3" />
            <p className="text-3xl font-light text-white mb-1">0</p>
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              Matches
            </p>
          </div>
          <div className="border border-white/30 p-6">
            <Users className="w-8 h-8 text-white mb-3" />
            <p className="text-3xl font-light text-white mb-1">10</p>
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              Profiles
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/discover")}
              className="w-full p-4 border border-white/30 hover:border-white transition-all text-left"
            >
              <p className="text-white text-lg">Start Discovering</p>
              <p className="text-gray-400 text-sm">Browse available profiles</p>
            </button>
            <button
              onClick={() => (window.location.href = "/cherry-picks")}
              className="w-full p-4 border border-white/30 hover:border-white transition-all text-left"
            >
              <p className="text-white text-lg">View Matches</p>
              <p className="text-gray-400 text-sm">See your cherry picks</p>
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
