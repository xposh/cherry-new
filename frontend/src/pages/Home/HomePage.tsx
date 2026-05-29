import { useEffect, useRef } from "react";
import { Cherry, ArrowRight, Eye, Sparkles, Clock } from "lucide-react";
import { Logo } from "../../components/Logo";

export function HomePage() {
  const userName = "Markus";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Match Readiness Score (60% Profil / 30% Engagement / 10% Freshness)
  const matchReadinessScore = 78;

  // Screen Time Balance
  const screenTimeMinutes = 42; // Diese Woche
  const maxHealthyMinutes = 60;
  const remainingMinutes = maxHealthyMinutes - screenTimeMinutes;

  // Farb-System für Screen Time
  const getScreenTimeColor = (minutes: number) => {
    if (minutes <= 60) return { color: "#00FF88", label: "Perfect Balance" };
    if (minutes <= 120) return { color: "#FFA500", label: "Mindful Usage" };
    return { color: "#FF3366", label: "Consider Taking a Break" };
  };

  const screenTimeStatus = getScreenTimeColor(screenTimeMinutes);

  // Profile Stats
  const profileViews = 12;
  const profileViewsIncrease = 5;
  const newMatches = 3;

  // AI Career Suggestions (rotiert alle 24h)
  const careerInsights = [
    {
      icon: "🎯",
      title: "Hidden Match: Interior Design",
      description:
        "Based on your photography portfolio, 3 interior design studios viewed your profile.",
      action: "Explore",
    },
    {
      icon: "🌍",
      title: "Geographic Insight",
      description:
        "Hamburg has 2× more opportunities in your field than Berlin this month.",
      action: "View Hamburg Jobs",
    },
    {
      icon: "💼",
      title: "Adjacent Career Path",
      description:
        "Your barista experience + communication skills match well with Hospitality Manager roles.",
      action: "See Similar Paths",
    },
  ];

  // Heute wird zufällig eine Suggestion angezeigt
  const todayInsightIndex = new Date().getDate() % careerInsights.length;
  const todayInsight = careerInsights[todayInsightIndex];

  // Intersection Observer für Handpicked Videos (100% Viewport)
  const handpickedRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (entry.isIntersecting && entry.intersectionRatio >= 1) {
            video?.play();
          } else {
            video?.pause();
          }
        });
      },
      { threshold: 1.0 }, // 100% sichtbar
    );

    handpickedRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-24">
      <Logo />
      {/* HERO VIDEO SECTION - Full Screen */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.6)" }}
        >
          <source src="/videos/HairdresserBlackWhite1.mp4" type="video/mp4" />
          <img
            src="/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </video>

        <div className="absolute inset-0 bg-black/40" />

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

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
            Scroll
          </p>
          <div className="w-px h-12 bg-white/30 mx-auto" />
        </div>
      </section>

      {/* MATCH READINESS SECTION - Ring Chart */}
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
                    2 * Math.PI * 120 * (1 - matchReadinessScore / 100)
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
                  {matchReadinessScore}
                </p>
                <p
                  className="text-xs uppercase tracking-[0.3em] text-center"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Match Readiness
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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/CherryPrivateDinner.mp4" type="video/mp4" />
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

      {/* HANDPICKED SECTION - Nur dunkler Verlauf oben hinzugefügt */}
      <section className="relative bg-black h-screen w-full overflow-hidden">
        {/* FIXED HEADER BEREICH */}
        <div className="absolute top-0 left-0 w-full z-30 pointer-events-none">
          {/* Der gewünschte dunkle Hintergrundverlauf */}
          <div className="absolute inset-0 h-64 bg-gradient-to-b from-black/90 via-black/40 to-transparent" />

          <div className="relative max-w-7xl mx-auto p-8 md:px-12 pt-14 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-3 text-white/50">
                Curated For You
              </p>
              <h2 className="text-5xl font-light tracking-tight text-white">
                Handpicked Opportunities
              </h2>
            </div>
            <button className="pointer-events-auto flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-sm">
              View All
              <ArrowRight className="w-4 h-4" strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* SCROLL-CONTAINER */}
        <div
          className="h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[
            {
              name: "Anna Schmidt Brautstudio",
              city: "Hamburg, Germany",
              role: "Hairstylist",
              img: "/hairdresser/IMG_4483.JPG",
              vid: null,
            },
            {
              name: "Marcus Kleine Studio",
              city: "Hamburg, Germany",
              role: "Salon Manager & Lead Stylist",
              img: "/Photographer/IMG_4417.JPG",
              vid: null,
            },
            {
              name: "Salon Valcov",
              city: "München, Germany",
              role: "Hairstylist Balayage Specialist",
              img: "/hairdresser/IMG_4485.JPG",
              vid: null, // Video entfernt wie besprochen
            },
          ].map((talent, i) => (
            <div
              key={i}
              ref={(el) => {
                handpickedRefs.current[i] = el;
              }}
              className="h-screen w-full relative snap-start group cursor-pointer"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={talent.img}
                  alt={talent.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    talent.vid ? "group-hover:opacity-0" : "opacity-100"
                  }`}
                />

                {/* Conditional Rendering: Nur wenn talent.vid existiert */}
                {talent.vid && (
                  <video
                    loop
                    muted
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <source src={talent.vid} type="video/mp4" />
                  </video>
                )}

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-end p-8 pb-32 max-w-7xl mx-auto w-full">
                <h3 className="text-2xl font-light mb-2 tracking-tight text-white">
                  {talent.name}
                </h3>
                <p className="text-sm mb-1 text-white/60">{talent.city}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {talent.role}
                </p>
              </div>
            </div>
          ))}
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
                    src="/hairdresser/IMG_4425.JPG"
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

      {/* SCREEN TIME BALANCE SECTION */}
      <section className="py-20 px-8 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${screenTimeStatus.color}15 0%, ${screenTimeStatus.color}08 100%)`,
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Clock
            className="w-8 h-8 mx-auto mb-6"
            style={{
              color: screenTimeStatus.color,
              filter: `drop-shadow(0 0 10px ${screenTimeStatus.color}50)`,
            }}
            strokeWidth={1}
          />
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Screen Time This Week
          </p>
          <p
            className="text-7xl font-extralight mb-4"
            style={{
              color: screenTimeStatus.color,
              textShadow: `0 0 20px ${screenTimeStatus.color}50`,
            }}
          >
            {screenTimeMinutes} min
          </p>
          <p className="text-2xl font-light mb-2" style={{ color: "#FFFFFF" }}>
            {screenTimeStatus.label}
          </p>
          {remainingMinutes > 0 && (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              {remainingMinutes} minutes remaining to stay healthy
            </p>
          )}
        </div>
      </section>

      {/* AI CAREER SUGGESTIONS - Rotiert täglich */}
      <section className="py-20 px-8 relative overflow-hidden border-t border-white/5">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 16, 240, 0.15) 0%, rgba(255, 20, 147, 0.08) 100%)",
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-start gap-6">
            <div
              className="text-5xl flex-shrink-0"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255, 16, 240, 0.5))",
              }}
            >
              {todayInsight.icon}
            </div>
            <div className="flex-grow">
              <p
                className="text-xs uppercase tracking-[0.3em] mb-3"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                AI Career Insight
              </p>
              <h3
                className="text-3xl font-light mb-4"
                style={{ color: "#FFFFFF" }}
              >
                {todayInsight.title}
              </h3>
              <p
                className="text-lg font-light mb-6"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {todayInsight.description}
              </p>
              <button
                className="group flex items-center gap-3 uppercase tracking-[0.2em] text-sm font-medium hover:gap-4 transition-all"
                style={{
                  color: "#FF10F0",
                  textShadow: "0 0 10px rgba(255, 16, 240, 0.3)",
                }}
              >
                {todayInsight.action}
                <ArrowRight
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WELLNESS REMINDER */}
      <section className="py-16 px-8 bg-black border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles
            className="w-6 h-6 mx-auto mb-4"
            style={{ color: "rgba(255,255,255,255)" }}
            strokeWidth={1}
          />
          <p
            className="text-lg font-light"
            style={{ color: "rgba(255,255,255,255)" }}
          >
            You've been active today. Take a break — opportunities will still be
            here tomorrow.
          </p>
        </div>
      </section>

      {/* VISUELLE AUSWERTUNGEN - Oura Ring Style */}
      <section className="py-32 px-8 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-xs uppercase tracking-[0.3em] mb-16 text-center"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Your Analytics
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* 1. Response Reliability Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6">
                <svg width="192" height="192" className="transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#00FF88"
                    strokeWidth="2"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - 0.85)}
                    strokeLinecap="round"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))",
                    }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <p
                    className="text-5xl font-extralight"
                    style={{
                      color: "#00FF88",
                      textShadow: "0 0 15px rgba(0, 255, 136, 0.4)",
                    }}
                  >
                    85
                  </p>
                  <p
                    className="text-xs uppercase tracking-[0.2em] text-center"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    %
                  </p>
                </div>
              </div>
              <p
                className="text-xs uppercase tracking-[0.3em] text-center"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Response Reliability
              </p>
              <p
                className="text-sm mt-2 text-center"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Companies value your quick replies
              </p>
            </div>

            {/* 2. Profile Views Trend - Dynamisches Balken-Diagramm */}
            <div className="flex flex-col items-center w-full px-4">
              {/* Der Container braucht eine feste Höhe, damit die %-Werte der Balken greifen */}
              <div className="w-full h-32 mb-6 flex items-end justify-between gap-3">
                {[
                  { day: "Mo", views: 8 },
                  { day: "Di", views: 12 },
                  { day: "Mi", views: 15 }, // Peak
                  { day: "Do", views: 10 },
                  { day: "Fr", views: 14 },
                  { day: "Sa", views: 6 },
                  { day: "So", views: 4 },
                ].map((item, i) => {
                  // Berechnung: Aktuelle Views / Max Views (15) * 100
                  const barHeight = (item.views / 15) * 100;

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-1 h-full justify-end"
                    >
                      <div
                        className="w-full rounded-sm transition-all duration-500 ease-out hover:brightness-125"
                        style={{
                          height: `${barHeight}%`,
                          background:
                            "linear-gradient(180deg, #FF10F0 0%, #FF1493 100%)",
                          boxShadow: "0 0 15px rgba(255, 16, 240, 0.4)",
                        }}
                      />
                      <p
                        className="text-[10px] mt-4 font-light tracking-wider"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {item.day}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <p
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Profile Views (7 Days)
                </p>
                <p
                  className="text-sm mt-3 font-light"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  Peak: <span className="text-[#FF10F0]">15 views</span> on
                  Wednesday
                </p>
              </div>
            </div>

            {/* 3. Match Readiness Breakdown - Mini Ringe */}
            <div className="flex flex-col items-center">
              <div className="space-y-6 w-full">
                {[
                  { label: "Profil", value: 60, max: 60, color: "#FF10F0" },
                  { label: "Engagement", value: 12, max: 30, color: "#00FF88" },
                  { label: "Freshness", value: 6, max: 10, color: "#FFA500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg
                        width="64"
                        height="64"
                        className="transform -rotate-90"
                      >
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.05)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 28}
                          strokeDashoffset={
                            2 * Math.PI * 28 * (1 - item.value / item.max)
                          }
                          strokeLinecap="round"
                          style={{
                            filter: `drop-shadow(0 0 6px ${item.color}40)`,
                          }}
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <p
                          className="text-sm font-light"
                          style={{ color: item.color }}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p
                        className="text-sm uppercase tracking-[0.2em] mb-1"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {item.label}
                      </p>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(item.value / item.max) * 100}%`,
                            backgroundColor: item.color,
                            boxShadow: `0 0 8px ${item.color}40`,
                          }}
                        />
                      </div>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {item.value} / {item.max} Punkte
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p
                className="text-xs uppercase tracking-[0.3em] text-center mt-8"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Score Breakdown
              </p>
            </div>
          </div>

          {/* Engagement Heatmap - Letzte 28 Tage */}
          <div className="mt-20">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-8 text-center"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Activity Overview (Last 28 Days)
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const isActive = Math.random() > 0.6;
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded transition-all hover:scale-110"
                      style={{
                        backgroundColor: isActive
                          ? "#00FF88"
                          : "rgba(255,255,255,0.05)",
                        boxShadow: isActive
                          ? "0 0 8px rgba(0, 255, 136, 0.3)"
                          : "none",
                      }}
                      title={`Day ${i + 1}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-4">
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  4 Wochen zurück
                </p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Heute
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
