import { useEffect, useState, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "../../components/Logo";
import { FeaturedOpportunityCard } from "../../components/FeaturedOpportunityCard";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router";
import { getSetupDraft } from "../../util/draftStorage";
import { MatchReadinessRing } from "./components/MatchReadinessRing";
import { ScreenTimeBalance } from "./components/ScreenTimeBalance";
import { ProfileViewsStats } from "./components/ProfileViewsStats";
import { ActivityFeedSection } from "./components/ActivityFeedSection";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { EngagementHeatmap } from "./components/EngagementHeatmap";

interface MatchReadiness {
  profileCompletenessScore: number;
  engagementScore: number;
  freshnessScore: number;
  totalReadinessScore: number;
}

interface ScreenTime {
  totalMinutes: number;
  status: string;
  color: string;
  remainingHealthyMinutes: number;
}

interface ProfileViewsData {
  total: number;
  weekTotal: number;
  increase: number;
  trend: Array<{ day: string; views: number }>;
}

interface Activity {
  activity_type: string;
  related_user_name: string;
  related_user_image?: string;
  activity_text: string;
  created_at: string;
}

interface Opportunity {
  company_name: string;
  company_city: string;
  company_country: string;
  job_role: string;
  image_url: string;
  video_url?: string;
}

interface FeaturedOpportunity {
  id: number;
  owner_id: string;
  owner_role: "talent" | "company";
  title: string;
  description: string;
  image_url?: string;
  video_url?: string;
  time_remaining_seconds: number;
}

export function TalentHomePage() {
  const { authFetch, user } = useAuth();
  const navigate = useNavigate();

  // State
  const [userName, setUserName] = useState<string>("");
  const [matchReadiness, setMatchReadiness] = useState<MatchReadiness>({
    profileCompletenessScore: 0,
    engagementScore: 0,
    freshnessScore: 0,
    totalReadinessScore: 0,
  });
  const [screenTime, setScreenTime] = useState<ScreenTime>({
    totalMinutes: 0,
    status: "Perfect Balance",
    color: "#D2C4AA",
    remainingHealthyMinutes: 60,
  });
  const [profileViews, setProfileViews] = useState<ProfileViewsData>({
    total: 0,
    weekTotal: 0,
    increase: 0,
    trend: [],
  });
  const [newMatches, setNewMatches] = useState<number>(0);
  const [responseReliability, setResponseReliability] = useState<number>(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [heatmap, setHeatmap] = useState<
    Array<{ date: string; isActive: boolean }>
  >([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [featuredOpportunity, setFeaturedOpportunity] =
    useState<FeaturedOpportunity | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [isHandpickedHeaderActive, setIsHandpickedHeaderActive] =
    useState(false);

  const sessionIdRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Refs
  const handpickedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const handpickedSectionRef = useRef<HTMLElement | null>(null);
  const handpickedScrollRef = useRef<HTMLDivElement | null>(null);
  const pageScrollRef = useRef<HTMLDivElement | null>(null);

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // AI Career Suggestions (rotates daily)
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

  const todayInsightIndex = new Date().getDate() % careerInsights.length;
  const todayInsight = careerInsights[todayInsightIndex];

  const pickFeaturedForViewer = (
    opportunities: FeaturedOpportunity[],
    viewerRole: "talent" | "company",
  ): FeaturedOpportunity | null => {
    if (!Array.isArray(opportunities) || opportunities.length === 0) return null;

    const targetOwnerRole = viewerRole === "talent" ? "company" : "talent";
    const roleFiltered = opportunities.filter(
      (opp) => opp.owner_role === targetOwnerRole,
    );

    if (roleFiltered.length === 0) return null;

    const idx = Math.floor(Math.random() * roleFiltered.length);
    return roleFiltered[idx] ?? null;
  };

  const handleHandpickedWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.currentTarget.scrollLeft += e.deltaY;
    e.preventDefault();
  };

  const scrollHandpickedNext = () => {
    const el = handpickedScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  // ========================================
  // FETCH DATA FROM BACKEND
  // ========================================
  useEffect(() => {
    async function fetchHomePageData() {
      try {
        setLoading(true);

        // 0. Get User Profile (for name)
        const profileRes = await authFetch("http://localhost:3000/profile");
        if (profileRes.ok) {
          const data = await profileRes.json();
          // Try to get name from backend profile first
          let firstName = data.profile?.name || data.profile?.firstName;

          // If not found, check localStorage for setup2 data
          if (!firstName) {
            const setupData = getSetupDraft("talentSetup2", user?.id);
            firstName = setupData?.formData?.firstName;
          }

          // Final fallback to email
          if (!firstName) {
            firstName = data.user?.email?.split("@")[0] || "User";
          }

          setUserName(firstName.split(" ")[0]); // Get first name only
        }

        // 1. Match Readiness
        const readinessRes = await authFetch(
          "http://localhost:3000/analytics/match-readiness",
        );
        if (readinessRes.ok) {
          const data = await readinessRes.json();
          setMatchReadiness(data);
        }

        // 2. Screen Time
        const screenTimeRes = await authFetch(
          "http://localhost:3000/analytics/screen-time",
        );
        if (screenTimeRes.ok) {
          const data = await screenTimeRes.json();
          setScreenTime(data);
        }

        // 3. Profile Views
        const viewsRes = await authFetch(
          "http://localhost:3000/analytics/profile-views",
        );
        if (viewsRes.ok) {
          const data = await viewsRes.json();
          setProfileViews(data);
        }

        // 4. New Matches
        const matchesRes = await authFetch(
          "http://localhost:3000/analytics/new-matches",
        );
        if (matchesRes.ok) {
          const data = await matchesRes.json();
          setNewMatches(data.newMatches);
        }

        // 5. Response Reliability
        const reliabilityRes = await authFetch(
          "http://localhost:3000/analytics/response-reliability",
        );
        if (reliabilityRes.ok) {
          const data = await reliabilityRes.json();
          setResponseReliability(data.responseReliability);
        }

        // 6. Activity Feed
        const activitiesRes = await authFetch(
          "http://localhost:3000/analytics/activity-feed",
        );
        if (activitiesRes.ok) {
          const data = await activitiesRes.json();
          setActivities(data.activities);
        }

        // 7. Engagement Heatmap
        const heatmapRes = await authFetch(
          "http://localhost:3000/analytics/engagement-heatmap",
        );
        if (heatmapRes.ok) {
          const data = await heatmapRes.json();
          setHeatmap(data.heatmap);
        }

        // 8. Handpicked Opportunities
        const opportunitiesRes = await authFetch(
          "http://localhost:3000/analytics/handpicked-opportunities",
        );
        if (opportunitiesRes.ok) {
          const data = await opportunitiesRes.json();
          setOpportunities(data.opportunities);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setLoading(false);
      }
    }

    fetchHomePageData();
  }, [authFetch, user?.id]);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedOpportunity() {
      try {
        if (!user?.id) {
          setFeaturedOpportunity(null);
          setFeaturedError(null);
          setFeaturedLoading(false);
          return;
        }

        setFeaturedLoading(true);
        setFeaturedError(null);

        let res = await authFetch("/api/featured-opportunities/feed");
        if (res.status === 404) {
          // Fallback when Vite /api proxy is not active.
          res = await authFetch("http://localhost:3000/featured-opportunities/feed");
        }
        if (!res.ok) {
          let errorMessage = "Failed to load featured opportunity";
          try {
            const payload = await res.json();
            if (typeof payload?.detail === "string" && payload.detail.trim()) {
              errorMessage = payload.detail;
            } else if (
              typeof payload?.error === "string" &&
              payload.error.trim()
            ) {
              errorMessage = payload.error;
            } else if (typeof payload?.msg === "string" && payload.msg.trim()) {
              errorMessage = payload.msg;
            }
          } catch {
            // Ignore JSON parse errors and keep default message.
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
        if (!isMounted) return;

        const viewerRole = user?.role === "talent" ? "talent" : "company";
        const picked = pickFeaturedForViewer(data.opportunities ?? [], viewerRole);
        setFeaturedOpportunity(picked);
      } catch (err: unknown) {
        if (!isMounted) return;
        setFeaturedError(
          err instanceof Error
            ? err.message
            : "Unable to load featured opportunity",
        );
        setFeaturedOpportunity(null);
      } finally {
        if (isMounted) setFeaturedLoading(false);
      }
    }

    loadFeaturedOpportunity();
    return () => {
      isMounted = false;
    };
  }, [authFetch, user?.id, user?.role]);

  // ========================================
  // SCREEN TIME TRACKING
  // ========================================
  useEffect(() => {
    // Start session
    async function startSession() {
      try {
        const res = await authFetch(
          "http://localhost:3000/analytics/screen-time/start",
          {
            method: "POST",
          },
        );
        if (res.ok) {
          const data = await res.json();
          sessionIdRef.current = data.sessionId;
        }
      } catch (error) {
        console.error("Error starting screen time session:", error);
      }
    }

    startSession();

    // End session on unmount
    return () => {
      if (sessionIdRef.current) {
        authFetch("http://localhost:3000/analytics/screen-time/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionIdRef.current }),
        }).catch((err) => console.error("Error ending session:", err));
      }
    };
  }, [authFetch]);

  // ========================================
  // INTERSECTION OBSERVER FOR VIDEOS
  // ========================================
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
      { threshold: 1.0 },
    );

    handpickedRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [opportunities]);

  useEffect(() => {
    if (loading) return;

    const rootEl = pageScrollRef.current;
    const sectionEl = handpickedSectionRef.current;
    if (!rootEl || !sectionEl) return;

    const updateHeaderState = () => {
      const triggerPoint = rootEl.scrollTop + rootEl.clientHeight * 0.65;
      const sectionTop = sectionEl.offsetTop;
      setIsHandpickedHeaderActive(triggerPoint >= sectionTop);
    };

    updateHeaderState();
    rootEl.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => {
      rootEl.removeEventListener("scroll", updateHeaderState);
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div
      ref={pageScrollRef}
      className="relative min-h-screen w-full bg-black overflow-auto pb-24"
    >
      <Logo />

      {/* HERO VIDEO SECTION */}
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
              style={{ color: "rgba(254,246,234,0.7)" }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1
              className="text-7xl font-light mb-6 tracking-tight"
              style={{ color: "#FEF6EA", lineHeight: "1.1" }}
            >
              {greeting},<br />
              {userName}
            </h1>
            <p
              className="text-xl font-light mb-12"
              style={{ color: "rgba(254,246,234,0.8)" }}
            >
              Your curated opportunities await
            </p>

            <button
              onClick={() => navigate("/discover")}
              className="px-12 py-4 bg-[#FEF6EA] text-black uppercase tracking-[0.2em] text-sm font-medium hover:bg-[#FEF6EA]/90 transition-all"
            >
              Start Discovering
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#FEF6EA]/60 text-xs uppercase tracking-wider mb-2">
            Scroll
          </p>
          <div className="w-px h-12 bg-[#FEF6EA]/30 mx-auto" />
        </div>
      </section>

      {/* MATCH READINESS SECTION */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <MatchReadinessRing score={matchReadiness.totalReadinessScore} />

            <div>
              <h2
                className="text-5xl font-light mb-6 tracking-tight"
                style={{ color: "#FEF6EA", lineHeight: "1.2" }}
              >
                You're making an impression
              </h2>
              <p
                className="text-lg font-light mb-12 leading-relaxed"
                style={{ color: "rgba(254,246,234,0.7)" }}
              >
                Your activity is resonating. Keep engaging with opportunities
                that align with your vision.
              </p>

              <ProfileViewsStats
                total={profileViews.total}
                increase={profileViews.increase}
                newMatches={newMatches}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED OPPORTUNITY */}
      <section className="relative h-screen w-full overflow-hidden">
        {featuredLoading ? (
          <div className="relative h-full bg-black flex items-center justify-center">
            <p className="text-white/40 text-sm tracking-[0.3em] uppercase">
              Loading featured opportunity...
            </p>
          </div>
        ) : featuredError ? (
          <div className="relative h-full bg-black flex items-center justify-center px-8 text-center">
            <div>
              <p className="text-white/70 text-sm mb-4">{featuredError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-white/20 text-white uppercase tracking-[0.2em] text-sm hover:border-white/40 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        ) : featuredOpportunity ? (
          <FeaturedOpportunityCard
            opportunity={featuredOpportunity}
            ctaLabel="View Profile"
            onClick={() =>
              navigate(
                featuredOpportunity.owner_role === "talent"
                  ? `/talent/${featuredOpportunity.owner_id}`
                  : `/company/${featuredOpportunity.owner_id}`,
              )
            }
            className="h-full"
          />
        ) : (
          <div className="relative h-full bg-black flex items-center justify-center px-8 text-center">
            <div>
              <p className="text-white/70 text-sm mb-4">
                No featured opportunity is available right now.
              </p>
              <button
                onClick={() => navigate("/account")}
                className="px-6 py-3 border border-white/20 text-white uppercase tracking-[0.2em] text-sm hover:border-white/40 transition-all"
              >
                Create Opportunity
              </button>
            </div>
          </div>
        )}
      </section>

      {/* HANDPICKED OPPORTUNITIES */}
      <section
        ref={handpickedSectionRef}
        className="relative bg-black h-screen w-full overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full z-30 pointer-events-none">
          <div className="absolute inset-0 h-64 bg-gradient-to-b from-black/90 via-black/40 to-transparent" />

          <div className="relative max-w-7xl mx-auto p-8 md:px-12 pt-14 flex items-end">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-0 transition-colors duration-700 ease-out"
                style={{
                  color: isHandpickedHeaderActive
                    ? "#ffc8dd"
                    : "rgba(254,246,234,0.5)",
                }}
              >
                Handpicked Opportunities - Curated For You
              </p>
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <button
            onClick={scrollHandpickedNext}
            className="pointer-events-auto flex items-center gap-2 text-[#ffc8dd] hover:text-[#ffe3ef] transition-colors uppercase tracking-[0.2em] text-sm"
          >
            View More
            <ArrowRight className="w-4 h-4" strokeWidth={1} />
          </button>
        </div>

        <div
          ref={handpickedScrollRef}
          onWheel={handleHandpickedWheel}
          className="flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {opportunities.length > 0 ? (
            opportunities.map((opp, i) => (
              <div
                key={i}
                ref={(el) => {
                  handpickedRefs.current[i] = el;
                }}
                className="h-full min-w-full shrink-0 relative snap-start group cursor-pointer"
              >
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={opp.image_url}
                    alt={opp.company_name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      opp.video_url ? "group-hover:opacity-0" : "opacity-100"
                    }`}
                  />

                  {opp.video_url && (
                    <video
                      loop
                      muted
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      <source src={opp.video_url} type="video/mp4" />
                    </video>
                  )}

                  <div className="absolute inset-0 bg-black/55 group-hover:bg-black/70 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end p-8 pb-32 max-w-7xl mx-auto w-full">
                  <h3 className="text-2xl font-light mb-2 tracking-tight text-[#ffc8dd]">
                    {opp.company_name}
                  </h3>
                  <p className="text-sm mb-1 text-[#ffc8dd]/80">
                    {opp.company_city}, {opp.company_country}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#ffc8dd]/65">
                    {opp.job_role}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-screen flex items-center justify-center">
              <p className="text-[#ffc8dd]/70">
                No opportunities available yet
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ACTIVITY FEED */}
      <ActivityFeedSection activities={activities} />

      {/* SCREEN TIME BALANCE */}
      <ScreenTimeBalance
        totalMinutes={screenTime.totalMinutes}
        status={screenTime.status}
        color={screenTime.color}
        remainingHealthyMinutes={screenTime.remainingHealthyMinutes}
      />

      {/* AI CAREER SUGGESTIONS */}
      <section className="py-20 px-8 relative overflow-hidden border-t border-black/10 bg-white">
        <div
          className="absolute inset-0"
          style={{
            background: "#FFFFFF",
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-start gap-6">
            <div
              className="text-5xl shrink-0"
              style={{
                filter: "drop-shadow(0 0 10px rgba(11, 31, 58, 0.18))",
              }}
            >
              {todayInsight.icon}
            </div>
            <div className="grow">
              <p
                className="text-xs uppercase tracking-[0.3em] mb-3"
                style={{ color: "rgba(0,0,0,0.55)" }}
              >
                AI Career Insight
              </p>
              <h3
                className="text-3xl font-light mb-4"
                style={{ color: "#0A0A0A" }}
              >
                {todayInsight.title}
              </h3>
              <p
                className="text-lg font-light mb-6"
                style={{ color: "rgba(0,0,0,0.72)" }}
              >
                {todayInsight.description}
              </p>
              <button
                className="group flex items-center gap-3 uppercase tracking-[0.2em] text-sm font-medium hover:gap-4 transition-all"
                style={{
                  color: "#0B1F3A",
                  textShadow: "0 0 10px rgba(11, 31, 58, 0.18)",
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
            style={{ color: "#FEF6EA" }}
            strokeWidth={1}
          />
          <p className="text-lg font-light" style={{ color: "#FEF6EA" }}>
            You've been active today. Take a break — opportunities will still be
            here tomorrow.
          </p>
        </div>
      </section>

      {/* ANALYTICS SECTION */}
      <AnalyticsSection
        responseReliability={responseReliability}
        profileViewsTrend={profileViews.trend}
        matchReadinessBreakdown={{
          profileScore: matchReadiness.profileCompletenessScore,
          engagementScore: matchReadiness.engagementScore,
          freshnessScore: matchReadiness.freshnessScore,
        }}
      />

      {/* ENGAGEMENT HEATMAP */}
      <div className="bg-black">
        <EngagementHeatmap heatmap={heatmap} />
      </div>
    </div>
  );
}
