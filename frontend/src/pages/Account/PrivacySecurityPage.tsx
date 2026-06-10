import {
  ArrowLeft,
  Shield,
  Lock,
  Smartphone,
  Download,
  Trash2,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { Logo } from "../../components/Logo";

interface ProfileData {
  user: {
    email: string;
    role: "talent" | "company";
  };
}

export function PrivacySecurityPage() {
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const [role, setRole] = useState<"talent" | "company" | null>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Fälschungssichere Rehydrierung der Rolle direkt aus dem verifizierten Token-Inhalt über die API
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await authFetch("http://localhost:3000/profile");
        if (response.ok) {
          const data: ProfileData = await response.json();
          setRole(data.user.role);
        }
      } catch (error) {
        console.error("Fehler in Security-Sicherheitsüberprüfung:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [authFetch]);

  const handleDataExport = () => {
    alert(
      role === "talent"
        ? "Architektur-Trigger: JSON-Datenexport für Talent (Bewerbungen, Lebenslauf, Analytics) wird generiert."
        : "Architektur-Trigger: JSON-Datenexport für Company (Unternehmensdaten, Job-Historie, Rechnungen) wird generiert.",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white font-mono tracking-widest text-xs">
          VERIFYING CREDENTIALS...
        </p>
      </div>
    );
  }

  const isTalent = role === "talent";

  return (
    <div className="relative min-h-screen w-full bg-black pb-24 text-white">
      <Logo />

      <div className="max-w-4xl mx-auto px-8 pt-40 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 transition-all rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-light text-white uppercase tracking-widest">
              Privacy & Security ({isTalent ? "Talent" : "Company"})
            </h1>
          </div>
        </div>

        {/* SEKTION 1: ACCOUNT SECURITY (Für beide Identitäten identisch) */}
        <section className="mb-12">
          <h2 className="text-base font-normal text-gray-400 mb-6 tracking-wide">
            Account Security
          </h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-6 border border-white/30 bg-transparent hover:border-white transition-all text-left">
              <div className="flex items-start gap-4">
                <Lock className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    Change Password
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    Update your password regularly to keep your authentication
                    credentials secure.
                  </p>
                </div>
              </div>
              <span className="text-white font-normal text-sm tracking-wider">
                Update →
              </span>
            </button>

            <div className="flex items-center justify-between p-6 border border-white/30 bg-transparent">
              <div className="flex items-start gap-4">
                <Smartphone className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    Two-Factor Authentication (2FA)
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    Secure your account with a time-based verification code
                    (TOTP) from an authenticator app.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-14 h-8 rounded-full border border-white/20 p-1 transition-all duration-300 ease-in-out ${
                  twoFactorEnabled
                    ? "bg-[#2A6087] border-[#2A6087]"
                    : "bg-neutral-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
                    twoFactorEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* SEKTION 2: DATA CONTROL & COMPLIANCE (ROLLENBASIERTE LOGIK-TRENNUNG) */}
        <section className="mb-12">
          <h2 className="text-base font-normal text-gray-400 mb-6 tracking-wide">
            Data Control & Compliance
          </h2>
          <div className="space-y-4">
            <button
              onClick={handleDataExport}
              className="w-full flex items-center justify-between p-6 border border-white/30 bg-transparent hover:border-white transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <Download className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    Request Data Report
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    {isTalent
                      ? "Download a full JSON archive containing all your personal profile activities, applications, and settings."
                      : "Download a full corporate archive containing company branding, job history, and active recruiter logs."}
                  </p>
                </div>
              </div>
              <span className="text-white font-normal text-sm tracking-wider">
                Export ↓
              </span>
            </button>

            {isTalent ? (
              <button className="w-full flex items-center justify-between p-6 border border-red-900/50 bg-red-950/10 hover:border-red-500 transition-all text-left group">
                <div className="flex items-start gap-4">
                  <Trash2 className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-normal text-lg tracking-wide text-red-500">
                      Delete Account
                    </p>
                    <p className="text-sm text-red-700/80 font-light mt-1">
                      Permanently purge your account, matches and metrics from
                      the CHERRY database. This action is irreversible.
                    </p>
                  </div>
                </div>
                <span className="text-red-500 font-normal text-sm tracking-wider group-hover:translate-x-1 transition-all">
                  Delete →
                </span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between p-6 border border-amber-900/40 bg-amber-950/5 text-left">
                <div className="flex items-start gap-4">
                  <Building2 className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-normal text-lg tracking-wide text-amber-500">
                      Company Deactivation
                    </p>
                    <p className="text-sm text-gray-400 font-light mt-1">
                      To delete or transfer a corporate enterprise account with
                      active job postings, please contact your account manager
                      or reach out directly to{" "}
                      <span className="text-amber-500/90 font-normal">
                        support@cherry.com
                      </span>
                      .
                    </p>
                  </div>
                </div>
                <span className="text-amber-500/40 font-mono text-xs tracking-widest border border-amber-500/20 px-2 py-1">
                  B2B LOCK
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
