import { Cherry, MapPin } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "../../components/Logo";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { useMatch } from "../../context/MatchContext";
import { useAuth } from "../../context/useAuth";
import { mockTalents } from "../../data/mockTalents";
import { mockCompanies } from "../../data/mockCompanies";

export function CherryPicksPage() {
  const { getMatches } = useMatch();
  const { user } = useAuth();
  const matches = getMatches();

  if (!user) {
    console.log("user not logged in!");
    return null;
  }
  const isViewingTalents = user.role === "talent";

  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      {/* Logo */}
      <Logo />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <Cherry className="w-8 h-8 text-white" />
          <h1 className="text-4xl font-light text-white uppercase tracking-wider">
            Cherry Picks
          </h1>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const profile = isViewingTalents
                ? mockTalents.find((t) => t.id === match.profileId)
                : mockCompanies.find((c) => c.id === match.profileId);

              if (!profile) return null;

              const isTalent = "name" in profile;
              const linkTo = isTalent
                ? `/match/talent/${profile.id}`
                : `/match/company/${profile.id}`;

              return (
                <Link
                  key={match.id}
                  to={linkTo}
                  className="border border-white/30 overflow-hidden hover:border-white transition-all group"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={
                        isTalent ? profile.profileImage : profile.companyLogo
                      }
                      alt={isTalent ? profile.name : profile.companyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-light text-white mb-2">
                        {isTalent ? profile.name : profile.companyName}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-white/30">
                    <p className="text-gray-400 text-xs">
                      Matched on{" "}
                      {new Date(match.matchedAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Cherry className="w-24 h-24 text-white/20 mb-6" />
            <p className="text-gray-400 text-lg text-center">No matches yet</p>
            <p className="text-gray-500 text-sm text-center mt-2 mb-6">
              Start discovering to find your perfect match
            </p>
            <Link
              to="/discover"
              className="px-6 py-3 bg-white text-black hover:bg-white/90 transition-all uppercase tracking-wider"
            >
              Discover Profiles
            </Link>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
