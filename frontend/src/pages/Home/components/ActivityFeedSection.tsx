import { useMemo, useState } from "react";
import { Eye, Cherry, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/useAuth";

const DEFAULT_VISIBLE_PER_TYPE = 3;

interface Activity {
  activity_type: string;
  related_user_id?: string | null;
  related_user_role?: "talent" | "company" | "admin" | null;
  related_user_name: string;
  related_user_image?: string;
  activity_text: string;
  created_at: string;
}

interface ActivityFeedSectionProps {
  activities: Activity[];
}

function formatTimeAgo(timestamp: string) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffHours < 48) return "Yesterday";
  return `${Math.floor(diffHours / 24)} days ago`;
}

function formatActivityTypeLabel(activityType: string) {
  return activityType.replace(/_/g, " ").toUpperCase();
}

export function ActivityFeedSection({ activities }: ActivityFeedSectionProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {},
  );

  const isPremium =
    user?.isPremium === true ||
    user?.membershipTier === "premium" ||
    localStorage.getItem("isPremium") === "true" ||
    localStorage.getItem("membershipTier") === "premium";

  const activityCountsByType = useMemo(() => {
    return activities.reduce<Record<string, number>>((counts, activity) => {
      counts[activity.activity_type] =
        (counts[activity.activity_type] ?? 0) + 1;
      return counts;
    }, {});
  }, [activities]);

  const hiddenCountsByType = useMemo(() => {
    return Object.entries(activityCountsByType).reduce<Record<string, number>>(
      (counts, [activityType, totalCount]) => {
        counts[activityType] = Math.max(
          0,
          totalCount - DEFAULT_VISIBLE_PER_TYPE,
        );
        return counts;
      },
      {},
    );
  }, [activityCountsByType]);

  const visibleActivities = useMemo(() => {
    const visibleCountsByType: Record<string, number> = {};
    return activities.filter((activity) => {
      const activityType = activity.activity_type;
      if (expandedTypes[activityType]) return true;

      visibleCountsByType[activityType] =
        (visibleCountsByType[activityType] ?? 0) + 1;

      return visibleCountsByType[activityType] <= DEFAULT_VISIBLE_PER_TYPE;
    });
  }, [activities, expandedTypes]);

  const handleActivityClick = (activity: Activity) => {
    if (!isPremium) {
      navigate("/account/premium-required");
      return;
    }

    if (!activity.related_user_id) {
      navigate("/cherry-picks");
      return;
    }

    const fallbackRole = user?.role === "talent" ? "company" : "talent";
    const targetRole =
      activity.related_user_role === "talent" ||
      activity.related_user_role === "company"
        ? activity.related_user_role
        : fallbackRole;

    navigate(`/${targetRole}/${activity.related_user_id}`);
  };

  return (
    <section className="py-32 px-8 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-xs uppercase tracking-[0.3em] mb-12"
          style={{ color: "rgba(254,246,234,0.5)" }}
        >
          Recent Activity
        </h2>

        <div className="space-y-0">
          {visibleActivities.length > 0 ? (
            visibleActivities.map((activity, i) => (
              <div
                key={i}
                onClick={() => handleActivityClick(activity)}
                className="py-8 border-t border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  {activity.activity_type === "profile_view" && (
                    <Eye
                      className="w-5 h-5 text-[#FEF6EA]/30 group-hover:text-[#FF6F00] transition-all duration-300"
                      strokeWidth={1}
                      style={{
                        filter: "drop-shadow(0 0 0px rgba(255,111,0,0))",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.filter =
                          "drop-shadow(0 0 6px rgba(255,111,0,0.8))")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.filter =
                          "drop-shadow(0 0 0px rgba(255,111,0,0))")
                      }
                    />
                  )}
                  {activity.activity_type === "like" &&
                    activity.related_user_image && (
                      // Ich gebe dem Avatar einen echten Glow-Ring, weil eine
                      // reine Randfarbe auf Schwarz nicht "leuchtend" wirkt —
                      // erst der weiche, farbige box-shadow erzeugt den Licht-Effekt.
                      <div
                        className="w-12 h-12 rounded-full overflow-hidden transition-shadow duration-300 group-hover:shadow-[0_0_14px_rgba(255,111,0,0.7)]"
                        style={{ boxShadow: "0 0 0px rgba(255,111,0,0)" }}
                      >
                        <img
                          src={activity.related_user_image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  {activity.activity_type === "match" && (
                    // Ich nutze hier Cherry als Icon für Match-Events, mit
                    // demselben Glow-Prinzip wie beim Eye-Icon oben.
                    <Cherry
                      className="w-5 h-5 text-[#FEF6EA]/30 group-hover:text-[#FF6F00] transition-all duration-300"
                      strokeWidth={1}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.filter =
                          "drop-shadow(0 0 6px rgba(255,111,0,0.8))")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.filter =
                          "drop-shadow(0 0 0px rgba(255,111,0,0))")
                      }
                    />
                  )}
                  <div>
                    <p className="text-lg font-light text-[#FEF6EA] mb-1">
                      {activity.activity_text}
                    </p>
                    <p className="text-xs text-[#FEF6EA]/40 uppercase tracking-wider">
                      {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className="w-5 h-5 text-[#FEF6EA]/20 group-hover:text-[#FF6F00]/60 transition-colors"
                  strokeWidth={1}
                />
              </div>
            ))
          ) : (
            <p className="text-[#FEF6EA]/50 text-center py-8">
              No recent activity
            </p>
          )}

          {Object.entries(hiddenCountsByType)
            .filter(([, hiddenCount]) => hiddenCount > 0)
            .map(([activityType, hiddenCount]) => {
              const isExpanded = expandedTypes[activityType] === true;

              return (
                <div
                  key={activityType}
                  className="py-6 border-t border-white/5 text-center"
                >
                  <button
                    onClick={() =>
                      setExpandedTypes((prev) => ({
                        ...prev,
                        [activityType]: !prev[activityType],
                      }))
                    }
                    className="text-xs uppercase tracking-[0.2em] text-[#FEF6EA]/60 hover:text-[#FEF6EA] transition-colors"
                  >
                    {isExpanded
                      ? `HIDE ${formatActivityTypeLabel(activityType)}`
                      : `SHOW ALL ${formatActivityTypeLabel(activityType)} (${hiddenCount} MORE)`}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
