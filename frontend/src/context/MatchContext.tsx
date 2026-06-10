/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./useAuth";
import { discoverService } from "../services/discoverService";

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
  likeProfile: (
    profileId: string,
    profileType: "talent" | "company",
  ) => Promise<void>;
  skipProfile: (
    profileId: string,
    profileType?: "talent" | "company",
  ) => Promise<void>;
  checkIfMatch: (profileId: string) => boolean;
  getMatches: () => Match[];
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);
export { MatchContext };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function MatchProvider({ children }: { children: ReactNode }) {
  const { authFetch } = useAuth();

  const [matches, setMatches] = useState<Match[]>(() => load("matches", []));
  const [likedProfiles, setLikedProfiles] = useState<string[]>(() =>
    load("likedProfiles", []),
  );
  const [skippedProfiles, setSkippedProfiles] = useState<string[]>(() =>
    load("skippedProfiles", []),
  );
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [latestMatch, setLatestMatch] = useState<Match | null>(null);

  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);
  useEffect(() => {
    localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
  }, [likedProfiles]);
  useEffect(() => {
    localStorage.setItem("skippedProfiles", JSON.stringify(skippedProfiles));
  }, [skippedProfiles]);

  const likeProfile = async (
    profileId: string,
    profileType: "talent" | "company",
  ) => {
    setLikedProfiles((prev) => [...prev, profileId]);
    try {
      const result = await discoverService.interact(
        profileId,
        "like",
        authFetch,
      );
      if (result.status === "match") {
        const newMatch: Match = {
          id: result.matchId ?? `match-${Date.now()}`,
          profileId,
          profileType,
          matchedAt: new Date().toISOString(),
          isMatch: true,
        };
        setMatches((prev) => [newMatch, ...prev]);
        setLatestMatch(newMatch);
        setShowMatchPopup(true);
        setTimeout(() => setShowMatchPopup(false), 3000);
      }
    } catch (err) {
      console.error("Like fehlgeschlagen:", err);
    }
  };

  const skipProfile = async (profileId: string) => {
    setSkippedProfiles((prev) => [...prev, profileId]);
    try {
      await discoverService.interact(profileId, "skip", authFetch);
    } catch (err) {
      console.error("Skip fehlgeschlagen:", err);
    }
  };

  const checkIfMatch = (profileId: string) =>
    matches.some((m) => m.profileId === profileId && m.isMatch);

  const getMatches = () => matches.filter((m) => m.isMatch);

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
  if (!context) throw new Error("useMatch must be used within MatchProvider");
  return context;
}

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
