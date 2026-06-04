// @file: frontend/src/components/matching/MatchScreen.tsx
import { Cherry } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function MatchScreen() {
  const navigate = useNavigate();
  const { id, targetType } = useParams<{ id: string; targetType: string }>();

  useEffect(() => {
    // Nach genau 3 Sekunden zur rollenspezifischen Match-Detailseite weiterleiten
    const timer = setTimeout(() => {
      if (targetType === "company") {
        navigate(`/match-details/company/${id}`);
      } else {
        navigate(`/match-details/talent/${id}`);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, id, targetType]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      {/* Logo-Bereich */}
      <div className="absolute top-8 left-8 z-30">
        <h2
          className="text-2xl tracking-[0.3em] uppercase flex items-center gap-1"
          style={{ color: "#2A6087" }}
        >
          CHE
          <Cherry className="w-6 h-6" style={{ color: "#2A6087" }} />Y
        </h2>
      </div>

      {/* Match-Animation Frame */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div style={{ animation: "popIn 1s ease-out forwards" }}>
          <Cherry
            className="w-48 h-48 relative z-10"
            style={{ color: "#2A6087" }}
            strokeWidth={0.5}
          />
        </div>

        <div
          className="text-center"
          style={{ animation: "popIn 1s ease-out forwards" }}
        >
          <h1 className="font-light tracking-[0.1em] uppercase text-white text-[36px]">
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
