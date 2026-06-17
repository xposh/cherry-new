interface AnalyticsSectionProps {
  responseReliability: number;
  profileViewsTrend: Array<{ day: string; views: number }>;
  matchReadinessBreakdown: {
    profileScore: number;
    engagementScore: number;
    freshnessScore: number;
  };
}

export function AnalyticsSection({
  responseReliability,
  profileViewsTrend,
  matchReadinessBreakdown,
}: AnalyticsSectionProps) {
  return (
    <section className="py-32 px-8 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-xs uppercase tracking-[0.3em] mb-16 text-center"
          style={{ color: "rgba(254,246,234,0.5)" }}
        >
          Your Analytics
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {/* 1. Response Reliability Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <svg width="192" height="192" className="transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="rgba(78, 52, 46, 0.18)"
                  strokeWidth="2"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#FF6F00"
                  strokeWidth="2"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={
                    2 * Math.PI * 80 * (1 - responseReliability / 100)
                  }
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(255, 111, 0, 0.4))",
                  }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <p
                  className="text-5xl font-extralight"
                  style={{
                    color: "#FF6F00",
                    textShadow: "0 0 15px rgba(255, 111, 0, 0.4)",
                  }}
                >
                  {responseReliability}
                </p>
                <p
                  className="text-xs uppercase tracking-[0.2em] text-center"
                  style={{ color: "rgba(254,246,234,0.4)" }}
                >
                  %
                </p>
              </div>
            </div>
            <p
              className="text-xs uppercase tracking-[0.3em] text-center"
              style={{ color: "rgba(254,246,234,0.5)" }}
            >
              Response Reliability
            </p>
            <p
              className="text-sm mt-2 text-center"
              style={{ color: "rgba(254,246,234,0.7)" }}
            >
              Companies value your quick replies
            </p>
          </div>

          {/* 2. Profile Views Trend */}
          <div className="flex flex-col items-center w-full px-4">
            <div className="w-full h-32 mb-6 flex items-end justify-between gap-3">
              {profileViewsTrend.length > 0 ? (
                profileViewsTrend.map((item, i) => {
                  const maxViews = Math.max(
                    ...profileViewsTrend.map((t) => t.views),
                    1,
                  );
                  const barHeight = (item.views / maxViews) * 100;

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-1 h-full justify-end"
                    >
                      <div
                        className="w-full rounded-sm transition-all duration-500 ease-out hover:brightness-125"
                        style={{
                          height: `${barHeight}%`,
                          background:
                            "linear-gradient(180deg, #FF6F00 0%, #B86B19 100%)",
                          boxShadow: "0 0 15px rgba(255, 111, 0, 0.4)",
                        }}
                      />
                      <p
                        className="text-[10px] mt-4 font-light tracking-wider"
                        style={{ color: "rgba(254,246,234,0.4)" }}
                      >
                        {item.day.substring(0, 2)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-[#FEF6EA]/50 text-sm">No data yet</p>
              )}
            </div>

            <div className="text-center">
              <p
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "rgba(254,246,234,0.5)" }}
              >
                Profile Views (7 Days)
              </p>
            </div>
          </div>

          {/* 3. Match Readiness Breakdown */}
          <div className="flex flex-col items-center">
            <div className="space-y-6 w-full">
              {[
                {
                  label: "Profil",
                  value: matchReadinessBreakdown.profileScore,
                  max: 60,
                  color: "#FF6F00",
                },
                {
                  label: "Engagement",
                  value: matchReadinessBreakdown.engagementScore,
                  max: 30,
                  color: "#B86B19",
                },
                {
                  label: "Freshness",
                  value: matchReadinessBreakdown.freshnessScore,
                  max: 10,
                  color: "#BC4E4E",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg
                      width="64"
                      height="64"
                      className="transform -rotate-90"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="rgba(78, 52, 46, 0.18)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={
                          2 * Math.PI * 28 * (1 - item.value / item.max)
                        }
                        strokeLinecap="round"
                        style={{
                          filter: `drop-shadow(0 0 6px ${item.color}40)`,
                        }}
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <p
                        className="text-sm font-light"
                        style={{ color: item.color }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p
                      className="text-sm uppercase tracking-[0.2em] mb-1"
                      style={{ color: "rgba(254,246,234,0.7)" }}
                    >
                      {item.label}
                    </p>
                    <div className="w-full h-1 bg-[#4E342E]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(item.value / item.max) * 100}%`,
                          backgroundColor: item.color,
                          boxShadow: `0 0 8px ${item.color}40`,
                        }}
                      />
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "rgba(254,246,234,0.4)" }}
                    >
                      {item.value} / {item.max} Punkte
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p
              className="text-xs uppercase tracking-[0.3em] text-center mt-8"
              style={{ color: "rgba(254,246,234,0.5)" }}
            >
              Score Breakdown
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
