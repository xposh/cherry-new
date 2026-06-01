interface ProfileViewsStatsProps {
  total: number;
  increase: number;
  newMatches: number;
}

export function ProfileViewsStats({
  total,
  increase,
  newMatches,
}: ProfileViewsStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="border-l border-white/10 pl-6">
        <p
          className="text-5xl font-light mb-2"
          style={{
            color: "#FF10F0",
            textShadow: "0 0 15px rgba(255, 16, 240, 0.4)",
          }}
        >
          {total}
        </p>
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Profile Views
        </p>
        {increase > 0 && (
          <p
            className="text-sm mt-1"
            style={{
              color: "#FF10F0",
              textShadow: "0 0 10px rgba(255, 16, 240, 0.3)",
            }}
          >
            ↗ +{increase} this week
          </p>
        )}
      </div>
      <div className="border-l border-white/10 pl-6">
        <p
          className="text-5xl font-light mb-2"
          style={{
            color: "#FF10F0",
            textShadow: "0 0 15px rgba(255, 16, 240, 0.4)",
          }}
        >
          {newMatches}
        </p>
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          New Matches
        </p>
      </div>
    </div>
  );
}
