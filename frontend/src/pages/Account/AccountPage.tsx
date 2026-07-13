import {
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Settings,
  LogOut,
  Shield, // IMPORTIERT
} from "lucide-react";
import { Logo } from "../../components/Logo";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { mapCompanyProfileForSummary } from "../../util/profileMapping";

interface ProfileData {
  user: {
    email: string;
    role: "talent" | "company";
  };
  profile: {
    name?: string;
    profileImage?: string;
    companyLogo?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    phone?: string;
    contactPhone?: string;
    location?: string;
    locations?: string;
    position?: string;
    specialty?: string;
    industry?: string;
    claim?: string;
    website?: string;
    companyImages?: Array<{
      id: string;
      preview: string;
      url?: string;
      category: string;
      caption?: string;
    }>;
    socialLinks?: Array<{ platform: string; url: string }>;
  };
}

export function AccountPage() {
  const { logout, authFetch } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lade Profil-Daten vom Backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authFetch("http://localhost:3000/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setError(null);
        } else {
          const message = await response.text();
          console.error("Fehler beim Laden des Profils:", message);
          setError("Unable to load profile from backend.");
        }
      } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
        setError("Unable to load profile from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authFetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const isTalent = profileData?.user?.role === "talent";
  const isCompany = profileData?.user?.role === "company";
  const profile: ProfileData["profile"] = isCompany
    ? (mapCompanyProfileForSummary(profileData?.profile) as ProfileData["profile"])
    : profileData?.profile || {};

  const profileImage =
    profile.profileImage ||
    profile.companyLogo ||
    profile.companyImages?.[0]?.preview ||
    profile.companyImages?.[0]?.url ||
    null;

  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      {/* Logo */}
      <Logo />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 pt-40 pb-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}
        <div className="flex items-center gap-4 mb-8">
          <User className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-light text-white uppercase tracking-widest">
            Account
          </h1>
        </div>

        {/* Profile Section */}
        <section className="mb-8">
          <div className="flex items-center gap-6 p-6 border border-white/30">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-light text-white mb-1">
                {isTalent
                  ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
                    profile.name ||
                    "Talent"
                  : profile.companyName || profile.name || "Company"}
              </h2>
              <p className="text-gray-400">{isTalent ? "Talent" : "Company"}</p>
            </div>
          </div>
        </section>

        {/* Profile Information */}
        <section className="mb-8">
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
            Profile Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 border border-white/30">
              <Mail className="w-5 h-5 text-white" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">
                  {profileData?.user?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Phone */}
            {(profile.phone || profile.contactPhone) && (
              <div className="flex items-center gap-4 p-4 border border-white/30">
                <Phone className="w-5 h-5 text-white" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">
                    {profile.phone || profile.contactPhone || "-"}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            {(profile.location || profile.locations) && (
              <div className="flex items-center gap-4 p-4 border border-white/30">
                <MapPin className="w-5 h-5 text-white" />
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">
                    {profile.location || profile.locations || "-"}
                  </p>
                </div>
              </div>
            )}

            {/* Position & Specialty */}
            {isTalent && (profile.position || profile.specialty) && (
              <div className="flex items-center gap-4 p-4 border border-white/30">
                <Briefcase className="w-5 h-5 text-white" />
                <div>
                  <p className="text-sm text-gray-400">Position & Specialty</p>
                  <p className="text-white">
                    {[profile.position, profile.specialty]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>
              </div>
            )}

            {/* Industry */}
            {isCompany && profile.industry && (
              <div className="flex items-center gap-4 p-4 border border-white/30">
                <Briefcase className="w-5 h-5 text-white" />
                <div>
                  <p className="text-sm text-gray-400">Industry</p>
                  <p className="text-white">{profile.industry}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Settings */}
        <section className="mb-8">
          <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider">
            Settings
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => {
                navigate(
                  isTalent
                    ? "/talent-profile-summary"
                    : "/company-profile-summary",
                );
              }}
              className="w-full flex items-center justify-between p-4 border border-white/30 hover:border-white transition-all"
            >
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5 text-white" />
                <span className="text-white">Edit Profile</span>
              </div>
            </button>
            <button
              onClick={() => {
                navigate(
                  isTalent ? "/preferences/talent" : "/preferences/company",
                );
              }}
              className="w-full flex items-center justify-between p-4 border border-white/30 hover:border-white transition-all"
            >
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5 text-white" />
                <span className="text-white">Preferences</span>
              </div>
            </button>
            {/* FIX: Absoluter Navigationspfad passend zu der Kapselung des MainLayouts */}
            <button
              onClick={() => navigate("/account/privacy-security")}
              className="w-full flex items-center justify-between p-4 border border-white/30 hover:border-white transition-all"
            >
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white">Privacy & Security</span>
              </div>
            </button>
          </div>
        </section>

        {/* Logout */}
        <section>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 p-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
