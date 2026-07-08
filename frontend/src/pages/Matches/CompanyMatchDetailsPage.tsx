import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Building2,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { useAuth } from "../../context/useAuth";
import {
  discoverService,
  type FullProfile,
} from "../../services/discoverService";

export function CompanyMatchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const [company, setCompany] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const { profile } = await discoverService.getProfile(id, authFetch);
      setCompany(profile);
    } catch (err) {
      console.error("Match details load error:", err);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [id, authFetch]);

  useEffect(() => {
    load();
  }, [load]);

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
        <p className="text-gray-400">Match not found</p>
      </div>
    );
  }

  const gallery = company.galleryImages ?? [];
  const contact = company.contactPerson;

  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      {/* Fixed Header mit Back-Button, Logo und Match-Badge */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-10 pb-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full border border-white/10 hover:border-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.5} />
        </button>
        <div className="pointer-events-auto">
          <Logo />
        </div>
        <div
          className="pointer-events-none px-3 py-1.5 border text-xs uppercase tracking-[0.2em]"
          style={{
            backgroundColor: "rgba(255,111,0,0.15)",
            borderColor: "rgba(255,111,0,0.4)",
            color: "#FF6F00",
          }}
        >
          ✓ Cherry pick!
        </div>
      </div>

      {/* Hero — 65vh wie bei TalentMatchDetailsPage */}
      <div className="relative h-[65vh] overflow-hidden">
        {(gallery[0]?.url || company.companyLogo) && (
          <img
            src={gallery[0]?.url ?? company.companyLogo}
            alt={company.companyName}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        {company.companyLogo && (
          <div className="absolute top-20 right-6">
            <img
              src={company.companyLogo}
              alt="Logo"
              className="w-16 h-16 border border-white/20 object-contain bg-white/10 backdrop-blur-sm p-1"
            />
          </div>
        )}
        <div className="absolute bottom-8 left-8 right-8">
          {company.industry && (
            <p
              className="text-sm uppercase tracking-[0.3em] mb-3"
              style={{ color: "rgba(255,111,0,0.9)" }}
            >
              {company.industry}
            </p>
          )}
          <h1
            className="text-6xl font-light text-white mb-3"
            style={{ lineHeight: "1.05" }}
          >
            {company.companyName}
          </h1>
          <div className="flex items-center gap-6 text-white/70 flex-wrap">
            {company.industry && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-base">{company.industry}</span>
              </div>
            )}
            {company.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-base">{company.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        {/* CTA in Markenfarbe */}
        <button
          onClick={() => navigate(`/messages/start/${id}`)}
          className="w-full flex items-center justify-center gap-3 py-5 transition-all active:scale-[0.98] uppercase tracking-[0.25em] text-sm font-medium"
          style={{ backgroundColor: "#FF6F00", color: "#000" }}
        >
          <MessageCircle className="w-5 h-5" strokeWidth={2} />
          Start the Conversation
        </button>

        {company.jobTitle && (
          <section className="border border-white/10 p-6">
            <h2 className="text-xs font-light text-white/40 mb-5 uppercase tracking-[0.3em]">
              Open Position
            </h2>
            <h3 className="text-white text-3xl font-light mb-4">
              {company.jobTitle}
            </h3>
            {company.description && (
              <p className="text-white/70 mb-4 font-light leading-relaxed">
                {company.description}
              </p>
            )}
            {(company.workModel ?? []).length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {(company.workModel ?? []).map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1.5 border border-white/15 text-white/70 text-sm"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {contact && (
          <section className="border border-white/10 p-6">
            <h2 className="text-xs font-light text-white/40 mb-5 uppercase tracking-[0.3em]">
              Your Contact Person
            </h2>
            <div className="flex gap-5 items-start">
              {contact.photo && (
                <img
                  src={contact.photo}
                  alt={contact.name}
                  className="w-20 h-20 rounded-full object-cover border border-white/20 flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="text-white text-xl font-light mb-1">
                  {contact.name}
                </h3>
                <p className="text-white/40 text-sm mb-4 uppercase tracking-wider">
                  {contact.role}
                </p>
                {contact.message && (
                  <p className="text-white/70 italic mb-5 font-light leading-relaxed">
                    "{contact.message}"
                  </p>
                )}
                <div className="space-y-3 text-sm">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    {contact.email}
                  </a>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                    >
                      <Phone
                        className="w-4 h-4 flex-shrink-0"
                        strokeWidth={1.5}
                      />
                      {contact.phone}
                    </a>
                  )}
                  {contact.website && (
                    <a
                      href={
                        contact.website.startsWith("http")
                          ? contact.website
                          : `https://${contact.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                    >
                      <Globe
                        className="w-4 h-4 flex-shrink-0"
                        strokeWidth={1.5}
                      />
                      {contact.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
