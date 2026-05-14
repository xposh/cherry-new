/*Speichert:
- likedProfiles (Profile die ich geliked habe)
- matches (gegenseitige Matches)
- pendingLikes (wartet auf Gegenmatch)

Funktionen:
- likeProfile(profileId)
- skipProfile(profileId)
- checkForMatch(profileId) */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

interface Match {
  id: string;
  profileId: string;
  profileType: "talent" | "company";
  matchedAt: string;
  isMatch: boolean;
}

interface MatchContextType {
  matches: Match[];
  likedProfiles: string[];
  skippedProfiles: string[];
  likeProfile: (profileId: string, profileType: "talent" | "company") => void;
  skipProfile: (profileId: string, profileType: "talent" | "company") => void;
  checkIfMatch: (profileId: string) => boolean;
  getMatches: () => Match[];
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [skippedProfiles, setSkippedProfiles] = useState<string[]>([]);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [latestMatch, setLatestMatch] = useState<Match | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedMatches = localStorage.getItem("matches");
    const savedLiked = localStorage.getItem("likedProfiles");
    const savedSkipped = localStorage.getItem("skippedProfiles");

    if (savedMatches) setMatches(JSON.parse(savedMatches));
    if (savedLiked) setLikedProfiles(JSON.parse(savedLiked));
    if (savedSkipped) setSkippedProfiles(JSON.parse(savedSkipped));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
  }, [likedProfiles]);

  useEffect(() => {
    localStorage.setItem("skippedProfiles", JSON.stringify(skippedProfiles));
  }, [skippedProfiles]);

  const likeProfile = (
    profileId: string,
    profileType: "talent" | "company",
  ) => {
    setLikedProfiles((prev) => [...prev, profileId]);

    // 50% chance of auto-match
    const isMatch = Math.random() > 0.5;

    if (isMatch) {
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        profileId,
        profileType,
        matchedAt: new Date().toISOString(),
        isMatch: true,
      };
      setMatches((prev) => [newMatch, ...prev]);
      setLatestMatch(newMatch);
      setShowMatchPopup(true);

      // Auto-hide popup after 3 seconds
      setTimeout(() => setShowMatchPopup(false), 3000);
    }
  };

  const skipProfile = (profileId: string) => {
    setSkippedProfiles((prev) => [...prev, profileId]);
  };

  const checkIfMatch = (profileId: string) => {
    return matches.some((m) => m.profileId === profileId && m.isMatch);
  };

  const getMatches = () => {
    return matches.filter((m) => m.isMatch);
  };

  return (
    <MatchContext.Provider
      value={{
        matches,
        likedProfiles,
        skippedProfiles,
        likeProfile,
        skipProfile,
        checkIfMatch,
        getMatches,
      }}
    >
      {children}
      {showMatchPopup && latestMatch && (
        <MatchPopup
          match={latestMatch}
          onClose={() => setShowMatchPopup(false)}
        />
      )}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useMatch must be used within MatchProvider");
  }
  return context;
}

// Match Popup Component
function MatchPopup({ onClose }: { match: Match; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-light text-white mb-2">It's a Match!</h2>
        <p className="text-white/80 mb-6">
          Beide Seiten haben Interesse. Jetzt könnt ihr Kontakt aufnehmen!
        </p>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all font-light uppercase tracking-wider"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
