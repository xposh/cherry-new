interface MatchReadinessRingProps {
  score: number;
}

export function MatchReadinessRing({ score }: MatchReadinessRingProps) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="280" height="280" className="transform -rotate-90">
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="rgba(78, 52, 46, 0.18)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6F00" />
            <stop offset="100%" stopColor="#B86B19" />
          </linearGradient>
        </defs>
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="2"
          strokeDasharray={2 * Math.PI * 120}
          strokeDashoffset={2 * Math.PI * 120 * (1 - score / 100)}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 12px rgba(255, 111, 0, 0.6))" }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <p
          className="text-8xl font-extralight mb-2"
          style={{
            color: "#FF6F00",
            textShadow: "0 0 20px rgba(255, 111, 0, 0.5)",
          }}
        >
          {score}
        </p>
        <p
          className="text-xs uppercase tracking-[0.3em] text-center"
          style={{ color: "rgba(254,246,234,0.5)" }}
        >
          Match Readiness
        </p>
      </div>
    </div>
  );
}
