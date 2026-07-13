import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, X, Check } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { FeaturedOpportunityCard, type FeaturedOpportunityItem } from "../../components/FeaturedOpportunityCard";
import { useAuth } from "../../context/useAuth";
import { Logo } from "../../components/Logo";
import {
  discoverService,
  type FullProfile,
} from "../../services/discoverService";

export function TalentProfileView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authFetch, isAuthenticated } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredOpportunity, setFeaturedOpportunity] = useState<FeaturedOpportunityItem | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const result = isAuthenticated
        ? await discoverService.getProfile(id, authFetch)
        : await discoverService.getPublicProfile(id);
      const p = result.profile;
      setProfile(p);
    } catch (err) {
      console.error("Talent load error:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [id, authFetch, isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollTop / el.clientHeight);
      setCurrentIndex(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [profile]);

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      if (!id) return;
      try {
        setFeaturedLoading(true);
        setFeaturedError(null);

        const res = await fetch(`/api/featured-opportunities/public/profile/${id}`);
        if (!res.ok) {
          throw new Error("Unable to load featured opportunity");
        }

        const data = await res.json();
        if (!isMounted) return;

        setFeaturedOpportunity(data.opportunity ?? null);
      } catch (err: unknown) {
        if (!isMounted) return;
        setFeaturedError(err instanceof Error ? err.message : "Unable to load featured opportunity");
        setFeaturedOpportunity(null);
      } finally {
        if (!isMounted) return;
        setFeaturedLoading(false);
      }
    }

    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSkip = async () => {
    if (!id) return;
    try {
      await discoverService.interact(id, "skip", authFetch);
    } catch {}
    navigate("/discover");
  };

  const handleLike = async () => {
    if (!id) return;
    try {
      const result = await discoverService.interact(id, "like", authFetch);
      if (result.status === "match") {
        navigate(`/match-details/talent/${id}`);
      } else {
        navigate("/discover");
      }
    } catch {
      navigate("/discover");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 text-sm tracking-[0.3em] uppercase">
          Loading...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  const portfolioItems = profile.portfolioItems ?? [];
  const totalSlides = portfolioItems.length + 2;

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Autarkes Logo aus Logo.tsx */}
      <Logo />

      {/* Scroll Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-1">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`h-1 transition-all duration-300 ${
              i === currentIndex ? "w-8 bg-white" : "w-4 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Scrollable Slides */}
      <div
        ref={scrollRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Portfolio Slides */}
        {portfolioItems.map((item, i) => (
          <div
            key={i}
            className="h-screen w-full snap-start relative flex flex-col justify-end"
          >
            <img
              src={item.preview}
              alt={item.category}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {item.caption && (
              <div className="relative z-10 p-8 pb-32">
                <p className="text-white text-lg font-light leading-relaxed max-w-2xl">
                  {item.caption}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Bio Slide */}
        <div className="h-screen w-full snap-start relative flex flex-col justify-end">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="relative z-10 p-8 pb-32">
            <h1 className="text-5xl font-light text-white mb-2">
              {profile.name}
            </h1>
            {profile.age && (
              <p className="text-2xl text-gray-300 mb-4">{profile.age}</p>
            )}
            {profile.location && (
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="space-y-2">
              {profile.position && (
                <p className="text-white text-lg">
                  <span className="text-gray-400">Position: </span>
                  {profile.position}
                </p>
              )}
              {profile.specialty && (
                <p className="text-white text-lg">
                  <span className="text-gray-400">Specialty: </span>
                  {profile.specialty}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Info Slide */}
        <div className="h-screen w-full snap-start bg-black overflow-hidden relative">
          <div className="h-full w-full overflow-y-auto p-8 pb-32 pt-20 max-w-2xl mx-auto space-y-8">
            {profile.about && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  About
                </h2>
                <p className="text-gray-300 leading-relaxed">{profile.about}</p>
              </section>
            )}

            <section className="my-12">
              <h2 className="text-2xl font-light text-white mb-6 uppercase tracking-wider">
                Featured Showcase
              </h2>
              {featuredLoading ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
                  Loading featured opportunity...
                </div>
              ) : featuredError ? (
                <div className="rounded-3xl border border-red-500/20 bg-black/70 p-8 text-center text-red-300">
                  {featuredError}
                </div>
              ) : featuredOpportunity ? (
                <FeaturedOpportunityCard opportunity={featuredOpportunity} />
              ) : (
                <div className="relative overflow-hidden rounded-3xl border border-white/10">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-72 w-full object-cover grayscale"
                  >
                    <source src="/videos/HairdresserBlackWhite1.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-white/80">
                    No featured opportunity is available.
                  </div>
                </div>
              )}
            </section>

            {profile.experiences && profile.experiences.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Experience
                </h2>
                <div className="space-y-6">
                  {profile.experiences.map((exp, i) => (
                    <div key={exp.id ?? i}>
                      <h3 className="text-xl text-white font-light">
                        {exp.title}
                      </h3>
                      <p className="text-gray-400">
                        {exp.company} • {exp.period}
                      </p>
                      {exp.description && (
                        <p className="text-gray-300 mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 border border-white text-white text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {profile.languages && profile.languages.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Languages
                </h2>
                <div className="space-y-2">
                  {profile.languages.map((lang, i) => (
                    <p key={i} className="text-gray-300">
                      {lang.language} {lang.level && `• ${lang.level}`}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {profile.recognitions && profile.recognitions.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Recognition
                </h2>
                <ul className="space-y-2 text-gray-300">
                  {profile.recognitions.map((rec, i) => (
                    <li key={i}>
                      • {rec.award} {rec.year && `(${rec.year})`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {profile.jobPreferences && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Availability
                </h2>
                <div className="space-y-2">
                  {profile.jobPreferences.availableFrom && (
                    <p className="text-gray-300">
                      Available from: {profile.jobPreferences.availableFrom}
                    </p>
                  )}
                  {profile.jobPreferences.workModel &&
                    profile.jobPreferences.workModel.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.jobPreferences.workModel.map((m) => (
                          <span
                            key={m}
                            className="px-3 py-1 border border-white/30 text-white text-sm"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* X und ✓ Buttons */}
      {isAuthenticated ? (
        <>
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
            <button
              onClick={handleSkip}
              className="w-16 h-16 rounded-full bg-black border-2 border-white flex items-center justify-center hover:bg-white transition-all group"
              aria-label="Pass"
            >
              <X
                className="w-8 h-8 text-white group-hover:text-black"
                strokeWidth={2}
              />
            </button>
            <button
              onClick={handleLike}
              className="w-16 h-16 rounded-full bg-black border-2 border-white flex items-center justify-center hover:bg-white transition-all group"
              aria-label="Like"
            >
              <Check
                className="w-8 h-8 text-white group-hover:text-black"
                strokeWidth={2}
              />
            </button>
          </div>

          <BottomNavigation />
        </>
      ) : null}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
