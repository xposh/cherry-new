import { ArrowRight } from "lucide-react";
import { useState } from "react";

export interface FeaturedOpportunityItem {
  id: number;
  owner_id: string;
  owner_role: "talent" | "company";
  title: string;
  description?: string;
  image_url?: string;
  video_url?: string;
  deadline?: string;
  time_remaining_seconds?: number;
}

interface FeaturedOpportunityCardProps {
  opportunity: FeaturedOpportunityItem;
  ctaLabel?: string;
  onClick?: () => void;
  className?: string;
}

function formatTimeRemaining(seconds?: number) {
  if (!seconds || seconds <= 0) return "Event has started";
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function FeaturedOpportunityCard({
  opportunity,
  ctaLabel = "View Profile",
  onClick,
  className,
}: FeaturedOpportunityCardProps) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div
      className={`relative min-h-[28rem] w-full overflow-hidden bg-black ${className ?? ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (onClick && event.key === "Enter") {
          onClick();
        }
      }}
    >
      <div className="absolute inset-0">
        {opportunity.image_url ? (
          <img
            src={opportunity.image_url}
            alt={opportunity.title}
            className="absolute inset-0 w-full h-full object-cover filter grayscale"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}
        {opportunity.video_url && !videoFailed ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setVideoFailed(true)}
          >
            <source src={opportunity.video_url} type="video/mp4" />
          </video>
        ) : null}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className="p-16 max-w-3xl">
          <div className="mb-6">
            <span
              className="inline-block px-4 py-1 border text-xs uppercase tracking-[0.3em] mb-4"
              style={{
                borderColor: "#FF6F00",
                color: "#FF6F00",
                boxShadow: "0 0 15px rgba(255, 111, 0, 0.3)",
              }}
            >
              Featured Opportunity
            </span>
          </div>
          <h3 className="text-5xl font-light mb-4 tracking-tight text-[#FEF6EA]">
            {opportunity.title}
          </h3>
          <p className="text-xl font-light mb-2 text-[#FEF6EA]/90">
            {opportunity.description ?? "A public highlight from this profile."}
          </p>
          {opportunity.time_remaining_seconds !== undefined ? (
            <p className="text-sm mb-8 text-[#FEF6EA]/60">
              {formatTimeRemaining(opportunity.time_remaining_seconds)}
            </p>
          ) : null}
          {onClick ? (
            <div className="group inline-flex items-center gap-3 text-[#FEF6EA] uppercase tracking-[0.2em] text-sm font-medium hover:gap-4 transition-all">
              <span>{ctaLabel}</span>
              <ArrowRight
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                strokeWidth={1}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
