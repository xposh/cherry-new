import { Cherry, X, Check, MapPin, Calendar, Globe } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { mockTalents } from "../../data/mockTalents";
import { useMatch } from "../../context/MatchContext";

export function TalentProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { likeProfile, skipProfile } = useMatch();

  const talent = mockTalents.find((t) => t.id === id);

  if (!talent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  const handleSkip = () => {
    skipProfile(talent.id, "talent");
    navigate("/discover");
  };

  const handleLike = () => {
    likeProfile(talent.id, "talent");
    navigate("/discover");
  };

  return (
    <div className="relative min-h-screen w-full bg-black pb-32">
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

      {/* Hero Image */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={talent.profileImage}
          alt={talent.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-5xl font-light text-white mb-2">{talent.name}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <span className="text-lg">{talent.age} years old</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{talent.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
        {/* About */}
        <section>
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
            About
          </h2>
          <p className="text-white/80 text-lg font-light leading-relaxed">
            {talent.bio}
          </p>
        </section>

        {/* Gallery */}
        {talent.galleryImages.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Gallery
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {talent.galleryImages.map((img, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-64 object-cover border border-white/30"
                  />
                  <p className="text-gray-400 text-sm">{img.caption}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
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

        {/* Details */}
        <section>
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
            Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-white/30 p-4">
              <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                Experience
              </p>
              <p className="text-white text-lg">{talent.experience}</p>
            </div>
            <div className="border border-white/30 p-4">
              <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                Education
              </p>
              <p className="text-white text-lg">{talent.education}</p>
            </div>
            <div className="border border-white/30 p-4">
              <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                Availability
              </p>
              <p className="text-white text-lg">{talent.availability}</p>
            </div>
            <div className="border border-white/30 p-4">
              <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                Work Preference
              </p>
              <div className="flex gap-2">
                {talent.workPreference.map((pref) => (
                  <span
                    key={pref}
                    className="px-3 py-1 bg-white/10 text-white text-sm"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section>
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
            Languages
          </h2>
          <div className="space-y-2">
            {talent.languages.map((lang) => (
              <p key={lang} className="text-white/80">
                {lang}
              </p>
            ))}
          </div>
        </section>

        {/* Optional Info */}
        {(talent.hourlyRate || talent.portfolioLink) && (
          <section className="grid md:grid-cols-2 gap-6">
            {talent.hourlyRate && (
              <div className="border border-white/30 p-4">
                <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                  Hourly Rate
                </p>
                <p className="text-white text-2xl font-light">
                  {talent.hourlyRate}
                </p>
              </div>
            )}
            {talent.portfolioLink && (
              <div className="border border-white/30 p-4">
                <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                  Portfolio
                </p>
                <a
                  href={`https://${talent.portfolioLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {talent.portfolioLink}
                </a>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Action Buttons - Fixed Bottom */}
      <div className="fixed bottom-24 left-0 right-0 px-8 pb-6">
        <div className="max-w-md mx-auto flex gap-6">
          <button
            onClick={handleSkip}
            className="flex-1 h-16 border-2 border-white/30 flex items-center justify-center hover:border-white/60 transition-all group"
            style={{ backgroundColor: "transparent" }}
          >
            <X className="w-10 h-10 text-white" strokeWidth={1} />
          </button>
          <button
            onClick={handleLike}
            className="flex-1 h-16 border-2 border-white flex items-center justify-center hover:bg-white/10 transition-all group"
            style={{ backgroundColor: "transparent" }}
          >
            <Check className="w-10 h-10 text-white" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
