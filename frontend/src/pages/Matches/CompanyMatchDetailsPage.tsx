import { useState, useEffect, useCallback } from "react";
import {
  Cherry,
  MapPin,
  Building2,
  MessageCircle,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
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

      {/* Hero */}
      <div className="relative h-96 overflow-hidden">
        {(gallery[0]?.url || company.companyLogo) && (
          <img
            src={gallery[0]?.url ?? company.companyLogo}
            alt={company.companyName}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        {company.companyLogo && (
          <div className="absolute top-8 right-8">
            <img
              src={company.companyLogo}
              alt="Logo"
              className="w-20 h-20 border-2 border-white/20 object-cover bg-white"
            />
          </div>
        )}
        <div className="absolute bottom-8 left-8 right-8">
          <div
            className="inline-block px-4 py-1 border mb-3"
            style={{
              backgroundColor: "rgba(42,96,135,0.2)",
              borderColor: "rgba(42,96,135,0.4)",
            }}
          >
            <span
              className="text-sm uppercase tracking-wider"
              style={{ color: "#2A6087" }}
            >
              ✓ It's a Match
            </span>
          </div>
          <h1 className="text-5xl font-light text-white mb-2">
            {company.companyName}
          </h1>
          <div className="flex items-center gap-6 text-white/80">
            {company.industry && (
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>{company.industry}</span>
              </div>
            )}
            {company.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{company.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-8">
        {/* CTA */}
        <div className="border border-white/30 p-6">
          <h2 className="text-white text-2xl font-light mb-4">
            Start the Conversation
          </h2>
          <button
            onClick={() => navigate("/messages")}
            className="w-full flex items-center justify-center gap-3 p-4 bg-white text-black hover:bg-white/90 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="uppercase tracking-wider">Send Message</span>
          </button>
        </div>

        {company.jobTitle && (
          <section className="border border-white/30 p-6">
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
              Open Position
            </h2>
            <h3 className="text-white text-3xl font-light mb-4">
              {company.jobTitle}
            </h3>
            {company.description && (
              <p className="text-white/80 mb-4">{company.description}</p>
            )}
            {(company.workModel ?? []).length > 0 && (
              <div className="flex gap-2">
                {(company.workModel ?? []).map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1 bg-white/10 text-white text-sm"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {contact && (
          <section className="border border-white/30 p-6">
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
              Your Contact Person
            </h2>
            <div className="flex gap-4 items-start">
              {contact.photo && (
                <img
                  src={contact.photo}
                  alt={contact.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                />
              )}
              <div className="flex-1">
                <h3 className="text-white text-xl font-light">
                  {contact.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{contact.role}</p>
                {contact.message && (
                  <p className="text-white/80 italic mb-4">
                    "{contact.message}"
                  </p>
                )}
                <div className="space-y-2 text-sm">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </a>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 text-white/80 hover:text-white"
                    >
                      <Phone className="w-4 h-4" />
                      {contact.phone}
                    </a>
                  )}
                  {contact.website && (
                    <a
                      href={`https://${contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/80 hover:text-white"
                    >
                      <Globe className="w-4 h-4" />
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
