// @file: frontend/src/components/match/MatchScreen.tsx
import { Cherry } from "lucide-react";
import { useEffect } from "react";

interface MatchScreenProps {
  onComplete: () => void;
}

/**
 * Vollbild-Match-Celebration. Wird vom MatchProvider als globales Overlay
 * gerendert, NICHT als eigene Route. Ein Match kann von überall im Produkt
 * ausgelöst werden (Discover, Profilansicht etc.), daher muss die
 * Celebration den aktuellen Bildschirm überlagern, statt davon weg zu
 * navigieren. Nach Ablauf der Animation übernimmt der Aufrufer (MatchContext)
 * die Navigation zur Match-Details-Seite über onComplete.
 */
export function MatchScreen({ onComplete }: MatchScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div style={{ animation: "popIn 1s ease-out forwards" }}>
          <Cherry
            className="w-48 h-48 relative z-10"
            style={{ color: "#FF6F00" }}
            strokeWidth={0.5}
          />
        </div>

        <div
          className="text-center"
          style={{ animation: "popIn 1s ease-out forwards" }}
        >
          <h1 className="font-light tracking-widest uppercase text-[#FEF6EA] text-[36px]">
            Cherry!
          </h1>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
