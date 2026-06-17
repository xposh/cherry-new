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
            color: "#B86B19",
            textShadow: "0 0 15px rgba(184, 107, 25, 0.4)",
          }}
        >
          {total}
        </p>
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "rgba(254,246,234,0.5)" }}
        >
          Profile Views
        </p>
        {increase > 0 && (
          <p
            className="text-sm mt-1"
            style={{
              color: "#BC4E4E",
              textShadow: "0 0 10px rgba(188, 78, 78, 0.3)",
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
            color: "#FF6F00",
            textShadow: "0 0 15px rgba(255, 111, 0, 0.4)",
          }}
        >
          {newMatches}
        </p>
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "rgba(254,246,234,0.5)" }}
        >
          New Matches
        </p>
      </div>
    </div>
  );
}
