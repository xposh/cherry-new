import { Search, SlidersHorizontal, MapPin, Cherry, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { Logo } from "../../components/Logo";
import { useAuth } from "../../context/useAuth";
import {
  discoverService,
  type DiscoverProfile,
} from "../../services/discoverService";

export function DiscoverPage() {
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();

  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    role: "",
    city: "",
    experience: "All levels",
    models: [] as string[],
  });

  const targetType = user?.role === "talent" ? "company" : "talent";

  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await discoverService.getFeed(authFetch);
      console.log("📦 Feed geladen:", data.length, "Profile");
      setProfiles(data);
    } catch (err) {
      console.error("❌ Feed Fehler:", err);
    } finally {
      setIsLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery || filters.city) {
        try {
          const data = await discoverService.search(
            searchQuery,
            filters.city,
            authFetch,
          );
          setProfiles(data);
        } catch (err) {
          console.error("❌ Suche Fehler:", err);
        }
      } else {
        loadFeed();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filters.city, authFetch, loadFeed]);

  const handleProfileClick = (e: React.MouseEvent, profileId: string) => {
    e.preventDefault();
    if (activeProfileId === profileId) {
      navigate(`/${targetType}/${profileId}`);
    } else {
      setActiveProfileId(profileId);
    }
  };

  const toggleModel = (model: string) => {
    setFilters((prev) => ({
      ...prev,
      models: prev.models.includes(model)
        ? prev.models.filter((m) => m !== model)
        : [...prev.models, model],
    }));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ role: "", city: "", experience: "All levels", models: [] });
    loadFeed();
  };

  const resolveImageUrl = (raw: string): string => {
    if (!raw) return "";
    let src = raw;
    if (src.startsWith("http://localhost:3000")) {
      src = src.replace("http://localhost:3000", "");
    }
    if (src.toLowerCase().includes("/photographer/")) {
      src = src.replace(/\/photographer\//i, "/Photographer/");
    }
    if (src.toLowerCase().includes("/recruter-hr/")) {
      src = src.replace(/\/recruter-hr\//i, "/Recruter-Hr/");
    }
    return src;
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 text-sm tracking-[0.3em] uppercase">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white font-['Helvetica_Neue',sans-serif] overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed left-0 right-0 z-30 top-22 px-16 md:top-20 md:px-4">
        <div className="flex h-10 items-center md:hidden">
          <div className="w-36 shrink-0" aria-hidden="true" />
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search for ${targetType === "talent" ? "talents" : "companies"}...`}
              className="w-full h-12 border border-white/30 bg-transparent pl-12 pr-14 outline-none placeholder:text-white/50 text-white text-base leading-none backdrop-blur-sm"
            />
            <button
              onClick={() => setShowFilter(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="hidden md:mx-auto md:block md:w-full md:max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search for ${targetType === "talent" ? "talents" : "companies"}...`}
              className="w-full h-14 border border-white/30 bg-transparent pl-12 pr-14 outline-none placeholder:text-white/50 text-white text-base backdrop-blur-sm"
            />
            <button
              onClick={() => setShowFilter(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <Logo />

      {/* GRID */}
      {profiles.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white/30 text-sm tracking-widest uppercase">
            No profiles found
          </p>
        </div>
      ) : (
        <section className="columns-2 md:columns-3 lg:columns-4 gap-0 pt-0 pb-24">
          {profiles.map((profile) => {
            const imageSrc = resolveImageUrl(profile.main_image_url || "");
            const isActive = activeProfileId === profile.id;

            return (
              <div
                key={profile.id}
                onClick={(e) => handleProfileClick(e, profile.id)}
                className="relative break-inside-avoid cursor-pointer group overflow-hidden"
                style={{ minHeight: "220px" }}
              >
                {/* IMAGE or PLACEHOLDER */}
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={profile.full_name}
                    className="w-full block object-cover transition duration-500 group-hover:scale-[1.03]"
                    style={{ minHeight: "220px" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = parent.querySelector(
                          "[data-placeholder]",
                        ) as HTMLElement | null;
                        if (placeholder) {
                          placeholder.style.display = "flex";
                        }
                      }
                    }}
                  />
                ) : null}

                {/* PLACEHOLDER (shown when no image or image fails) */}
                <div
                  data-placeholder
                  style={{
                    display: imageSrc ? "none" : "flex",
                    minHeight: "220px",
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
                  }}
                  className="w-full flex-col items-center justify-center gap-3 border border-white/10"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center border border-white/20"
                    style={{ background: "rgba(42,96,135,0.3)" }}
                  >
                    <span className="text-white/60 text-lg tracking-wider">
                      {getInitials(profile.full_name)}
                    </span>
                  </div>
                  <span className="text-white/50 text-xs uppercase tracking-widest px-4 text-center">
                    {profile.full_name}
                  </span>
                </div>

                {/* OVERLAY — only when image exists */}
                {imageSrc && (
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-300" />
                )}

                {/* MATCH BADGE */}
                {profile.is_match_preview && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-[8px] tracking-[1.5px] uppercase flex items-center gap-2">
                    <Cherry className="w-3 h-3 text-[#9e0000]" />
                    Match
                  </div>
                )}

                {/* INFO OVERLAY */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition duration-300 ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  }`}
                >
                  <h3 className="text-white text-base font-light">
                    {profile.full_name}
                  </h3>
                  <p className="text-white/70 text-sm font-light">
                    {profile.current_role}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-white/50 text-xs">
                    <MapPin className="w-3 h-3" />
                    {profile.city}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* FILTER SIDEBAR */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            onClick={() => setShowFilter(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-black border-l border-white/20 z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-light text-white uppercase tracking-wider">
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={filters.role}
                    onChange={(e) =>
                      setFilters({ ...filters, role: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white outline-none focus:border-white/40 transition-colors"
                    placeholder="e.g. Chef, Designer"
                  />
                </div>

                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters({ ...filters, city: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white outline-none focus:border-white/40 transition-colors"
                    placeholder="z.B. Hamburg, Berlin"
                  />
                </div>

                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Experience
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) =>
                      setFilters({ ...filters, experience: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white focus:border-white/40 focus:outline-none transition-colors appearance-none"
                  >
                    <option className="bg-black">All levels</option>
                    <option className="bg-black">Junior (0-2 years)</option>
                    <option className="bg-black">Mid (3-5 years)</option>
                    <option className="bg-black">Senior (5-8 years)</option>
                    <option className="bg-black">Expert (8+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Work Model
                  </label>
                  <div className="space-y-2">
                    {["Remote", "Office", "Hybrid"].map((model) => (
                      <label
                        key={model}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.models.includes(model)}
                          onChange={() => toggleModel(model)}
                          className="bg-white/5 border-white/20"
                        />
                        <span className="text-sm font-light text-white/70">
                          {model}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="w-full py-3 bg-white/10 border border-white/20 text-white uppercase tracking-wider hover:bg-white/20 transition-all"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full py-2 text-xs text-white/50 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNavigation />
      </div>
    </main>
  );
}
