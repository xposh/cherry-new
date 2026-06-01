import { useEffect, useState, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "../../components/Logo";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router";
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

// Mock Talent Profile (für Company Handpicked)
interface TalentProfile {
  name: string;
  position: string;
  location: string;
  image_url: string;
  video_url?: string;
}

interface FeaturedTalent {
  name: string;
  position: string;
  description: string;
  availability: string;
  video_url?: string;
  image_url: string;
}

export function CompanyHomePage() {
  const { authFetch } = useAuth();
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
    color: "#00FF88",
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

  const [loading, setLoading] = useState(true);
  const sessionIdRef = useRef<number | null>(null); // Keep only one declaration

  // Refs
  const handpickedRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // MOCK DATA - Handpicked Talent Profiles (bis du Backend einbaust)
  const mockTalents: TalentProfile[] = [
    {
      name: "Sarah Miller",
      position: "Senior Hairstylist",
      location: "Hamburg, Germany",
      image_url: "/hairdresser/IMG_4483.JPG",
    },
    {
      name: "Max Weber",
      position: "Barista & Coffee Expert",
      location: "Berlin, Germany",
      image_url: "/Photographer/IMG_4417.JPG",
    },
    {
      name: "Anna Schmidt",
      position: "Balayage Specialist",
      location: "München, Germany",
      image_url: "/hairdresser/IMG_4485.JPG",
    },
  ];

  // MOCK DATA - Featured Talent (bis du Backend einbaust)
  const mockFeaturedTalent: FeaturedTalent = {
    name: "Lisa Meier",
    position: "Executive Chef",
    description: "Award-winning culinary artist",
    availability: "Available immediately",
    image_url: "/barkeeper-sommelier/IMG_4431.JPG",
    video_url: "/videos/CherryPrivateDinner.mp4",
  };

  // AI Career Suggestions (für Companies angepasst)
  const careerInsights = [
    {
      icon: "🎯",
      title: "Top Talent Alert",
      description:
        "3 senior designers matching your requirements just became available in Hamburg.",
      action: "View Profiles",
    },
    {
      icon: "🌍",
      title: "Geographic Insight",
      description:
        "Hamburg talent pool grew by 15% this month in hospitality sector.",
      action: "Explore Hamburg",
    },
    {
      icon: "💼",
      title: "Hiring Trend",
      description:
        "Companies in your industry are hiring 2× faster for remote positions.",
      action: "See Trends",
    },
  ];

  const todayInsightIndex = new Date().getDate() % careerInsights.length;
  const todayInsight = careerInsights[todayInsightIndex];

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
          // Company: Extract first name from company name
          const fullName = data.profile?.companyName || "Company";
          setUserName(fullName.split(" ")[0]);
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

        // NOTE: Handpicked & Featured sind MOCK DATA oben definiert
        // Du kannst später Backend Calls hinzufügen wenn du das anpasst

        setLoading(false);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setLoading(false);
      }
    }

    fetchHomePageData();
  }, [authFetch]);

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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-24">
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
              style={{ color: "#FFFFFF", lineHeight: "1.1" }}
            >
              {greeting},<br />
              {userName}
            </h1>
            <p
              className="text-xl font-light mb-12"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Your curated talent pool awaits
            </p>

            <button
              onClick={() => navigate("/discover")}
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

      {/* MATCH READINESS SECTION */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <MatchReadinessRing score={matchReadiness.totalReadinessScore} />

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
                Your company profile is resonating. Keep engaging with talent
                that aligns with your vision.
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

      {/* FEATURED TALENT */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          {mockFeaturedTalent.video_url && (
            <source src={mockFeaturedTalent.video_url} type="video/mp4" />
          )}
          <img
            src={mockFeaturedTalent.image_url}
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
                Featured Talent
              </span>
            </div>
            <h3
              className="text-6xl font-light mb-4 tracking-tight"
              style={{ color: "#FFFFFF", lineHeight: "1.1" }}
            >
              {mockFeaturedTalent.name}
              <br />
              {mockFeaturedTalent.position}
            </h3>
            <p
              className="text-xl font-light mb-2"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {mockFeaturedTalent.description}
            </p>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {mockFeaturedTalent.availability}
            </p>

            <button className="group flex items-center gap-3 text-white uppercase tracking-[0.2em] text-sm font-medium hover:gap-4 transition-all">
              View Profile
              <ArrowRight
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                strokeWidth={1}
              />
            </button>
          </div>
        </div>
      </section>

      {/* HANDPICKED TALENTS */}
      <section className="relative bg-black h-screen w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full z-30 pointer-events-none">
          <div className="absolute inset-0 h-64 bg-gradient-to-b from-black/90 via-black/40 to-transparent" />

          <div className="relative max-w-7xl mx-auto p-8 md:px-12 pt-14 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-3 text-white/50">
                Curated For You
              </p>
              <h2 className="text-5xl font-light tracking-tight text-white">
                Handpicked Talent
              </h2>
            </div>
            <button className="pointer-events-auto flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-[0.2em] text-sm">
              View All
              <ArrowRight className="w-4 h-4" strokeWidth={1} />
            </button>
          </div>
        </div>

        <div
          className="h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {mockTalents.map((talent, i) => (
            <div
              key={i}
              ref={(el) => {
                handpickedRefs.current[i] = el;
              }}
              className="h-screen w-full relative snap-start group cursor-pointer"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={talent.image_url}
                  alt={talent.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    talent.video_url ? "group-hover:opacity-0" : "opacity-100"
                  }`}
                />

                {talent.video_url && (
                  <video
                    loop
                    muted
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <source src={talent.video_url} type="video/mp4" />
                  </video>
                )}

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-end p-8 pb-32 max-w-7xl mx-auto w-full">
                <h3 className="text-2xl font-light mb-2 tracking-tight text-white">
                  {talent.name}
                </h3>
                <p className="text-sm mb-1 text-white/60">{talent.location}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {talent.position}
                </p>
              </div>
            </div>
          ))}
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

      {/* AI INSIGHTS */}
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
                AI Hiring Insight
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
            You've been active today. Take a break — great talent will still be
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
