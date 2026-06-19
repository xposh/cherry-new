/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import { discoverService } from "../services/discoverService";
import { MatchScreen } from "../components/match/MatchScreen";

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
  const navigate = useNavigate();

  const [matches, setMatches] = useState<Match[]>(() => load("matches", []));
  const [likedProfiles, setLikedProfiles] = useState<string[]>(() =>
    load("likedProfiles", []),
  );
  const [skippedProfiles, setSkippedProfiles] = useState<string[]>(() =>
    load("skippedProfiles", []),
  );

  // ✅ NEU: ersetzt das alte, separate Inline-Modal (MatchPopup). Statt
  // eines simplen Popups wird jetzt die volle Match-Celebration
  // (MatchScreen) als globales Overlay gerendert — unabhängig davon, von
  // welcher Seite aus der Match ausgelöst wurde.
  const [pendingCelebration, setPendingCelebration] = useState<Match | null>(
    null,
  );

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
        setPendingCelebration(newMatch);
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

  // ✅ NEU: Wird aufgerufen, sobald die Celebration-Animation durchgelaufen
  // ist. Navigiert zur Match-Details-Seite — dem gleichen Pfad, den auch
  // CherryPicksPage für bestehende Matches verwendet.
  const handleCelebrationComplete = () => {
    if (!pendingCelebration) return;
    const { profileId, profileType } = pendingCelebration;
    setPendingCelebration(null);
    navigate(`/match-details/${profileType}/${profileId}`);
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
      {pendingCelebration && (
        <MatchScreen onComplete={handleCelebrationComplete} />
      )}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) throw new Error("useMatch must be used within MatchProvider");
  return context;
}
