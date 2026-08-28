import { Clock } from "lucide-react";

interface ScreenTimeBalanceProps {
  totalMinutes: number;
  status: string;
  color: string;
  remainingHealthyMinutes: number;
}

export function ScreenTimeBalance({
  totalMinutes,
  status,
  color,
  remainingHealthyMinutes,
}: ScreenTimeBalanceProps) {
  return (
    <section className="py-20 px-8 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
        }}
      />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Clock
          className="w-8 h-8 mx-auto mb-6"
          style={{
            color: color,
            filter: `drop-shadow(0 0 10px ${color}50)`,
          }}
          strokeWidth={1}
        />
        <p
          className="text-xs uppercase tracking-[0.3em] mb-4"
          style={{ color: "rgba(254,246,234,0.5)" }}
        >
          Screen Time This Week
        </p>
        <p
          className="text-7xl font-extralight mb-4"
          style={{
            color: color,
            textShadow: `0 0 20px ${color}50`,
          }}
        >
          {totalMinutes} min
        </p>
        <p className="text-2xl font-light mb-2" style={{ color: "#FEF6EA" }}>
          {status}
        </p>
        {remainingHealthyMinutes > 0 && (
          <p className="text-sm" style={{ color: "rgba(254,246,234,0.6)" }}>
            {remainingHealthyMinutes} minutes remaining to stay healthy
          </p>
        )}
      </div>
    </section>
  );
}
