import {
  Cherry,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Eye,
  Sparkles,
} from "lucide-react";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { Logo } from "../../components/Logo";
import { useMatch } from "../../context/MatchContext";
import { useAuth } from "../../context/AuthContext";

export function HomePage() {
  const { getMatches } = useMatch();
  const { userRole } = useAuth();
  const matches = getMatches();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const userName = "Markus";

  const profileViews = 12;
  const profileViewsIncrease = 5;
  const newMatches = matches.length;
  const activityScore = 78;

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-24">
      <Logo />

      {/* HERO VIDEO SECTION - Full Screen */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* REPLACE: Add your video file path */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.6)" }}
        >
          <source src="/videos/HairdresserBlackWhite1.mp4" type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          <img
            src="/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8 max-w-4xl">
            <p
              className="text-sm uppercase tracking-[0.3em] mb-4"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1
              className="text-7xl font-light mb-6 tracking-tight"
              style={{
                color: "#FFFFFF",
                lineHeight: "1.1",
              }}
            >
              {greeting},<br />
              {userName}
            </h1>
            <p
              className="text-xl font-light mb-12"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Your curated opportunities await
            </p>

            <button
              onClick={() => (window.location.href = "/discover")}
              className="px-12 py-4 bg-white text-black uppercase tracking-[0.2em] text-sm font-medium hover:bg-white/90 transition-all"
            >
              Start Discovering
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
            Scroll
          </p>
          <div className="w-px h-12 bg-white/30 mx-auto" />
        </div>
      </section>

      {/* PERFORMANCE SECTION - Full Width with Padding */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left: Ring Chart */}
            <div className="relative flex flex-col items-center justify-center">
              <svg width="280" height="280" className="transform -rotate-90">
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient
                    id="ringGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FF10F0" />
                    <stop offset="100%" stopColor="#FF1493" />
                  </linearGradient>
                </defs>
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="2"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={
                    2 * Math.PI * 120 * (1 - activityScore / 100)
                  }
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(255, 16, 240, 0.6))",
                  }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <p
                  className="text-8xl font-extralight mb-2"
                  style={{
                    color: "#FF10F0",
                    textShadow: "0 0 20px rgba(255, 16, 240, 0.5)",
                  }}
                >
                  {activityScore}
                </p>
                <p
                  className="text-xs uppercase tracking-[0.3em] text-center"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Profile Score
                </p>
              </div>
            </div>

            {/* Right: Stats & Message */}
            <div>
              <h2
                className="text-5xl font-light mb-6 tracking-tight"
                style={{ color: "#FFFFFF", lineHeight: "1.2" }}
              >
                You're making an impression
              </h2>
              <p
                className="text-lg font-light mb-12 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Your activity is resonating. Keep engaging with opportunities
                that align with your vision.
              </p>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 gap-8">
                <div className="border-l border-white/10 pl-6">
                  <p
                    className="text-5xl font-light mb-2"
                    style={{
                      color: "#FF10F0",
                      textShadow: "0 0 15px rgba(255, 16, 240, 0.4)",
                    }}
                  >
                    {profileViews}
                  </p>
                  <p
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Profile Views
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{
                      color: "#FF10F0",
                      textShadow: "0 0 10px rgba(255, 16, 240, 0.3)",
                    }}
                  >
                    ↗ +{profileViewsIncrease} this week
                  </p>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <p
                    className="text-5xl font-light mb-2"
                    style={{
                      color: "#FF10F0",
                      textShadow: "0 0 15px rgba(255, 16, 240, 0.4)",
                    }}
                  >
                    {newMatches}
                  </p>
                  <p
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    New Matches
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED OPPORTUNITY - Video Background */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* REPLACE: Featured opportunity video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/InteriorDesigner1.mp4" type="video/mp4" />
          {/* Fallback */}
          <img
            src="/barkeeper-sommelier/IMG_4431.JPG"
            alt="Featured"
            className="w-full h-full object-cover"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="p-16 max-w-3xl">
            <div className="mb-6">
              <span
                className="inline-block px-4 py-1 border text-xs uppercase tracking-[0.3em] mb-4"
                style={{
                  borderColor: "#FF10F0",
                  color: "#FF10F0",
                  boxShadow: "0 0 15px rgba(255, 16, 240, 0.3)",
                }}
              >
                Featured Opportunity
              </span>
            </div>
            <h3
              className="text-6xl font-light mb-4 tracking-tight"
              style={{ color: "#FFFFFF", lineHeight: "1.1" }}
            >
              Private Dinner
              <br />
              Hamburg
            </h3>
            <p
              className="text-xl font-light mb-2"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              An exclusive culinary experience
            </p>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              3 days remaining
            </p>

            <button className="group flex items-center gap-3 text-white uppercase tracking-[0.2em] text-sm font-medium hover:gap-4 transition-all">
              Explore Details
              <ArrowRight
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                strokeWidth={1}
              />
            </button>
          </div>
        </div>
      </section>

      {/* HANDPICKED SECTION - Grid with Hover Videos */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-3"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Curated For You
              </p>
              <h2
                className="text-5xl font-light tracking-tight"
                style={{ color: "#FFFFFF" }}
              >
                Handpicked Opportunities
              </h2>
            </div>
            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-sm">
              View All
              <ArrowRight className="w-4 h-4" strokeWidth={1} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-96 mb-6 overflow-hidden">
                  {/* REPLACE: Profile videos - on hover, video plays */}
                  <video
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  >
                    <source src={`/videos/profile-${i}.mp4`} type="video/mp4" />
                  </video>
                  <img
                    src="/Photographer/IMG_4417.JPG"
                    alt="Profile"
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                </div>
                <div>
                  <h3
                    className="text-2xl font-light mb-2 tracking-tight"
                    style={{ color: "#FFFFFF" }}
                  >
                    Anna Schmidt
                  </h3>
                  <p
                    className="text-sm mb-1"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Berlin, Germany
                  </p>
                  <p
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    UX Designer
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITY FEED - Minimal & Clean */}
      <section className="py-32 px-8 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-12"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Recent Activity
          </h2>

          <div className="space-y-0">
            <div className="py-8 border-t border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
              <div className="flex items-center gap-6">
                <Eye
                  className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors"
                  strokeWidth={1}
                />
                <div>
                  <p className="text-lg font-light text-white mb-1">
                    5 new profiles viewed today
                  </p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    2 hours ago
                  </p>
                </div>
              </div>
            </div>

            <div className="py-8 border-t border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src="/Photographer/IMG_4417.JPG"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg font-light text-white mb-1">
                    Anna Schmidt liked your profile
                  </p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    5 hours ago
                  </p>
                </div>
              </div>
              <ArrowRight
                className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors"
                strokeWidth={1}
              />
            </div>

            <div className="py-8 border-t border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
              <div className="flex items-center gap-6">
                <Cherry
                  className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors"
                  strokeWidth={1}
                />
                <div>
                  <p className="text-lg font-light text-white mb-1">
                    2 companies saved you to cherry picks
                  </p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    Yesterday
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHT BANNER - Neon Pink Accent */}
      <section className="py-20 px-8 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 16, 240, 0.15) 0%, rgba(255, 20, 147, 0.08) 100%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Sparkles
            className="w-8 h-8 mx-auto mb-6"
            style={{
              color: "#FF10F0",
              filter: "drop-shadow(0 0 10px rgba(255, 16, 240, 0.5))",
            }}
            strokeWidth={1}
          />
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Weekly Insight
          </p>
          <p className="text-3xl font-light" style={{ color: "#FFFFFF" }}>
            Your peak activity time is Tuesday, 10–12pm
          </p>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
}
