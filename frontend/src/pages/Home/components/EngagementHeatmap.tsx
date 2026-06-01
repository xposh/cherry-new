interface EngagementHeatmapProps {
  heatmap: Array<{ date: string; isActive: boolean }>;
}

export function EngagementHeatmap({ heatmap }: EngagementHeatmapProps) {
  return (
    <div className="mt-20">
      <p
        className="text-xs uppercase tracking-[0.3em] mb-8 text-center"
        style={{ color: "rgba(255,255,255,0.5)" }}
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
                  ? "#00FF88"
                  : "rgba(255,255,255,0.05)",
                boxShadow: day.isActive
                  ? "0 0 8px rgba(0, 255, 136, 0.3)"
                  : "none",
              }}
              title={day.date}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            4 Wochen zurück
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            Heute
          </p>
        </div>
      </div>
    </div>
  );
}
