import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, X, Check } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { useAuth } from "../../context/useAuth";
import { Logo } from "../../components/Logo";
import {
  discoverService,
  type FullProfile,
} from "../../services/discoverService";

export function CompanyProfileView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [company, setCompany] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const { profile: p } = await discoverService.getProfile(id, authFetch);
      setCompany(p);
    } catch (err) {
      console.error("Company load error:", err);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [id, authFetch]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollTop / window.innerHeight);
      setCurrentIndex(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [company]);

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
        navigate(`/match/company/${id}`);
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

  if (!company) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Company not found</p>
      </div>
    );
  }

  const gallery = company.galleryImages ?? [];
  const values = company.cultureValues ?? [];
  const benefits = company.benefits ?? {};
  const contact = company.contactPerson;
  const totalSlides = gallery.length + 2;

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Logo */}

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
        {/* Gallery Slides */}
        {gallery.map((img, i) => (
          <div
            key={i}
            className="h-screen w-full snap-start relative flex flex-col justify-end"
          >
            <img
              src={img.url}
              alt={img.caption}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {img.caption && (
              <div className="relative z-10 p-8 pb-32">
                <p className="text-white text-lg font-light leading-relaxed max-w-2xl">
                  {img.caption}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Company Info Slide */}
        <div className="h-screen w-full snap-start relative flex flex-col justify-end">
          {(gallery[0]?.url || company.companyLogo) && (
            <img
              src={gallery[0]?.url ?? company.companyLogo}
              alt={company.companyName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {company.companyLogo && gallery.length > 0 && (
            <div className="absolute top-8 right-8 z-10">
              <img
                src={company.companyLogo}
                alt="Logo"
                className="w-16 h-16 object-cover border border-white/20 bg-white"
              />
            </div>
          )}

          <div className="relative z-10 p-8 pb-32">
            <h1 className="text-5xl font-light text-white mb-2">
              {company.companyName}
            </h1>
            {company.location && (
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{company.location}</span>
              </div>
            )}
            <div className="space-y-2">
              {company.industry && (
                <p className="text-white text-lg">
                  <span className="text-gray-400">Industry: </span>
                  {company.industry}
                </p>
              )}
              {company.companySize && (
                <p className="text-white text-lg">
                  <span className="text-gray-400">Size: </span>
                  {company.companySize}
                </p>
              )}
              {company.claim && (
                <p className="text-white text-xl font-light mt-4 italic">
                  "{company.claim}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Info Slide */}
        <div className="min-h-screen w-full snap-start bg-black p-8 pb-32">
          <div className="max-w-2xl mx-auto space-y-8 pt-20">
            {company.description && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  About Us
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {company.description}
                </p>
              </section>
            )}

            {values.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Values
                </h2>
                <div className="flex flex-wrap gap-3">
                  {values.map((v) => (
                    <span
                      key={v}
                      className="px-4 py-2 border border-white text-white text-sm"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {company.jobTitle && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Open Position
                </h2>
                <div className="border-l-2 border-white pl-4">
                  <h3 className="text-xl text-white font-light">
                    {company.jobTitle}
                  </h3>
                  <p className="text-gray-400">
                    {company.jobLocation}{" "}
                    {company.startDate && `• ${company.startDate}`}
                  </p>
                  {(company.workModel ?? []).length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {(company.workModel ?? []).map((m) => (
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

            {Object.keys(benefits).length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(benefits).map(([cat, items]) => (
                    <div key={cat}>
                      <h3 className="text-white font-light mb-2 capitalize">
                        {cat === "arbeitsmodell"
                          ? "Work Model"
                          : cat === "finanziell"
                            ? "Financial"
                            : cat === "lifestyle"
                              ? "Lifestyle"
                              : cat === "mobilitat"
                                ? "Mobility"
                                : "Development"}
                      </h3>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        {(items as string[]).map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {contact && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider">
                  Contact Person
                </h2>
                <div className="border border-white/20 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {contact.photo && (
                      <img
                        src={contact.photo}
                        alt={contact.name}
                        className="w-16 h-16 rounded-full object-cover border border-white/20"
                      />
                    )}
                    <div>
                      <h3 className="text-xl text-white font-light">
                        {contact.name}
                      </h3>
                      <p className="text-gray-400">{contact.role}</p>
                    </div>
                  </div>
                  {contact.message && (
                    <p className="text-gray-300 italic mb-4">
                      "{contact.message}"
                    </p>
                  )}
                  <div className="space-y-1 text-gray-300 text-sm">
                    {contact.email && <p>{contact.email}</p>}
                    {contact.phone && <p>{contact.phone}</p>}
                    {contact.website && <p>{contact.website}</p>}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* X und ✓ Buttons — runde Kreise */}
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

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
