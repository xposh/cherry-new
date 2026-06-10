import { useState, useEffect, useCallback } from "react";
import { Cherry, MapPin, MessageCircle, Globe, Award } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { useAuth } from "../../context/useAuth";
import {
  discoverService,
  type FullProfile,
} from "../../services/discoverService";

export function TalentMatchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const [talent, setTalent] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const { profile } = await discoverService.getProfile(id, authFetch);
      setTalent(profile);
    } catch (err) {
      console.error("Match details load error:", err);
      setTalent(null);
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

  if (!talent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Match not found</p>
      </div>
    );
  }

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
        {talent.profileImage && (
          <img
            src={talent.profileImage}
            alt={talent.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
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
          <h1 className="text-5xl font-light text-white mb-2">{talent.name}</h1>
          {talent.location && (
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5" />
              <span>{talent.location}</span>
            </div>
          )}
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

        {talent.about && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              About
            </h2>
            <p className="text-white/80 font-light leading-relaxed">
              {talent.about}
            </p>
          </section>
        )}

        {talent.skills && talent.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {talent.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 border border-white/30 text-white text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="grid md:grid-cols-2 gap-6">
          {talent.jobPreferences?.availableFrom && (
            <div className="border border-white/30 p-4">
              <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                Availability
              </p>
              <p className="text-white text-lg">
                {talent.jobPreferences.availableFrom}
              </p>
            </div>
          )}
          {talent.position && (
            <div className="border border-white/30 p-4">
              <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                Role
              </p>
              <p className="text-white text-lg">{talent.position}</p>
            </div>
          )}
        </section>

        {talent.recognitions && talent.recognitions.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Recognition
            </h2>
            {talent.recognitions.map((rec, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 border border-white/30 mb-2"
              >
                <Award className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white text-sm font-light">{rec.award}</p>
                  {rec.year && (
                    <p className="text-gray-500 text-xs">{rec.year}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {talent.socialLinks && talent.socialLinks.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Links
            </h2>
            {talent.socialLinks.map((link, i) => (
              <div key={i} className="border border-white/30 p-4 mb-2">
                <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                  {link.platform}
                </p>
                <a
                  href={
                    link.url.startsWith("http")
                      ? link.url
                      : `https://${link.url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/70 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {link.url}
                </a>
              </div>
            ))}
          </section>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
