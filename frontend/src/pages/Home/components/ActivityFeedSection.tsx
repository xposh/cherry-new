import { Eye, Cherry, ArrowRight } from "lucide-react";

interface Activity {
  activity_type: string;
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

export function ActivityFeedSection({ activities }: ActivityFeedSectionProps) {
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
          {activities.length > 0 ? (
            activities.map((activity, i) => (
              <div
                key={i}
                className="py-8 border-t border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-6">
                  {activity.activity_type === "profile_view" && (
                    <Eye
                      className="w-5 h-5 text-[#FEF6EA]/30 group-hover:text-[#FF6F00] transition-colors"
                      strokeWidth={1}
                    />
                  )}
                  {activity.activity_type === "like" &&
                    activity.related_user_image && (
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={activity.related_user_image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  {activity.activity_type === "save" && (
                    <Cherry
                      className="w-5 h-5 text-[#FEF6EA]/30 group-hover:text-[#FF6F00] transition-colors"
                      strokeWidth={1}
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
        </div>
      </div>
    </section>
  );
}
