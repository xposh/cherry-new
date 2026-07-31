import { useEffect, useState } from "react";
import { Cherry, MapPin, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { useAuth } from "../../context/useAuth";
import {
  discoverService,
  type MatchListItem,
} from "../../services/discoverService";

export function CherryPicksPage() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMatches() {
      try {
        const result = await discoverService.getMatches(authFetch);
        if (isMounted) setMatches(result);
      } catch (err) {
        console.error("Cherry Picks konnten nicht geladen werden:", err);
        if (isMounted) setError("Matches konnten nicht geladen werden.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMatches();
    return () => {
      isMounted = false;
    };
  }, [authFetch]);

  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      <Logo />

      <div className="max-w-2xl mx-auto px-6 pt-30 md:pt-40 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-400 text-center py-20">{error}</p>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <div key={match.matchId} className="relative group">
                <Link
                  to={`/match-details/${match.partnerType}/${match.partnerId}`}
                  className=" relative overflow-hidden aspect-full bg-white/5 "
                >
                  {match.image ? (
                    <img
                      src={match.image}
                      alt={match.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Cherry className="w-12 h-12 text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Name + Location */}
                  <div className="absolute bottom-3 left-0 right-0 p-6 pb-16">
                    <h3 className="text-[18px] uppercase tracking-[2px] font-light text-[#f7fdf4] mb-2 leading-tight">
                      {match.name}
                    </h3>
                    {match.location && (
                      <div className="flex items-center gap-1.5 text-white/50 mb-7">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span className="text-[9px]">{match.location}</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Ich setze den Chat-Button unten über die Karte, damit man
                    direkt aus der Liste heraus eine Konversation starten kann */}
                <div className="absolute bottom-3 left-0 right-0 p-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/messages/start/${match.partnerId}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm uppercase tracking-[0.2em] transition-all bg-transparent border border-amber-50 text-white/50"
                  >
                    <MessageCircle className="w-4 h-4" strokeWidth={2} />
                    Message
                  </button>
                </div>

                {/* Match-Datum */}
                <div className="absolute top-7 left-7">
                  <span className="text-[10px] uppercase tracking-widest text-white bg-black/50 px-2 py-1">
                    {new Date(match.matchedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <Cherry
              className="w-16 h-16 mb-6"
              style={{ color: "rgba(255,111,0,0.3)" }}
              strokeWidth={0.9}
            />
            <p className="text-white text-2xl font-light text-center mb-2">
              No matches yet
            </p>
            <p className="text-white/30 text-sm text-center mb-10">
              Start discovering to find your perfect match
            </p>
            <Link
              to="/discover"
              className="px-8 py-3 border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors uppercase tracking-[0.2em] text-sm"
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
