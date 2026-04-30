import { Cherry, MapPin, MessageCircle, Globe } from "lucide-react";
import { useParams } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { mockTalents } from "../../data/mockTalents";

export function TalentMatchDetailsPage() {
  const { id } = useParams();
  const talent = mockTalents.find((t) => t.id === id);

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
        <img
          src={talent.profileImage}
          alt={talent.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div
            className="inline-block px-4 py-1 border mb-3"
            style={{
              backgroundColor: "rgba(42, 96, 135, 0.2)",
              borderColor: "rgba(42, 96, 135, 0.4)",
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
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-5 h-5" />
            <span>{talent.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-8">
        {/* Contact CTA */}
        <div className="border border-white/30 p-6">
          <h2 className="text-white text-2xl font-light mb-4">
            Start the Conversation
          </h2>
          <button className="w-full flex items-center justify-center gap-3 p-4 bg-white text-black hover:bg-white/90 transition-all">
            <MessageCircle className="w-5 h-5" />
            <span className="uppercase tracking-wider">Send Message</span>
          </button>
        </div>

        {/* Profile Details */}
        <section>
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
            About
          </h2>
          <p className="text-white/80 font-light leading-relaxed">
            {talent.bio}
          </p>
        </section>

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

        <section className="grid md:grid-cols-2 gap-6">
          <div className="border border-white/30 p-4">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
              Experience
            </p>
            <p className="text-white text-lg">{talent.experience}</p>
          </div>
          <div className="border border-white/30 p-4">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
              Availability
            </p>
            <p className="text-white text-lg">{talent.availability}</p>
          </div>
        </section>

        {talent.portfolioLink && (
          <section className="border border-white/30 p-4">
            <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">
              Portfolio
            </p>
            <a
              href={`https://${talent.portfolioLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 flex items-center gap-2"
            >
              <Globe className="w-5 h-5" />
              {talent.portfolioLink}
            </a>
          </section>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
