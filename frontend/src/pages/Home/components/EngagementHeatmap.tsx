interface EngagementHeatmapProps {
  heatmap: Array<{ date: string; isActive: boolean }>;
}

export function EngagementHeatmap({ heatmap }: EngagementHeatmapProps) {
  return (
    <div className="mt-20">
      <p
        className="text-xs uppercase tracking-[0.3em] mb-8 text-center"
        style={{ color: "rgba(254,246,234,0.5)" }}
      >
        Activity Overview (Last 28 Days)
      </p>
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-7 gap-2">
          {heatmap.map((day, i) => (
            <div
              key={i}
              className="aspect-square rounded transition-all hover:scale-110"
              style={{
                backgroundColor: day.isActive
                  ? "#B89C72"
                  : "rgba(209, 180, 140, 0.12)",
                boxShadow: day.isActive
                  ? "0 0 8px rgba(184, 156, 114, 0.38)"
                  : "none",
              }}
              title={day.date}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <p className="text-xs" style={{ color: "rgba(254,246,234,0.4)" }}>
            4 Wochen zurück
          </p>
          <p className="text-xs" style={{ color: "rgba(254,246,234,0.4)" }}>
            Heute
          </p>
        </div>
      </div>
    </div>
  );
}
