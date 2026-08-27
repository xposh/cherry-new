import { Crown } from "lucide-react";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";

export function PremiumRequiredPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role === "company" ? "company" : "talent";

  return (
    <main className="min-h-screen bg-black text-[#FEF6EA] px-8 py-28">
      <Logo />

      <div className="mx-auto max-w-2xl border border-white/15 bg-white/3 p-10">
        <div className="mb-6 inline-flex items-center gap-3">
          <Crown className="h-6 w-6 text-[#ffc8dd]" strokeWidth={1.4} />
          <p className="text-xs uppercase tracking-[0.3em] text-[#FEF6EA]/55">
            Premium Feature
          </p>
        </div>

        <h1 className="mb-4 text-3xl font-light tracking-tight">
          See who engaged with your profile
        </h1>

        <p className="mb-10 text-[#FEF6EA]/70 leading-relaxed">
          Viewing the full identity behind profile engagement is available for
          Premium members. Upgrade your membership to unlock profile activity
          insights and direct profile access from your recent activity feed.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate(`/preferences/${role}`)}
            className="border border-[#ffc8dd]/60 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#ffc8dd] hover:bg-[#ffc8dd]/10 transition-colors"
          >
            Open Membership Settings
          </button>
          <button
            onClick={() => navigate(-1)}
            className="border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#FEF6EA]/80 hover:border-white/60 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
