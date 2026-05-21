import {
  Cherry,
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router";

export function AccountPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-black pb-24">
      {/* Logo */}
      <div className="fixed top-8 left-8 z-50">
        <h2
          className="text-2xl tracking-[0.3em] uppercase flex items-center gap-1"
          style={{ color: "#2A6087" }}
        >
          CHE
          <Cherry className="w-6 h-6" style={{ color: "#2A6087" }} />Y
        </h2>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <User className="w-8 h-8 text-white" />
          <h1 className="text-4xl font-light text-white uppercase tracking-wider">
            Account
          </h1>
        </div>

        {/* Profile Section */}
        <section className="mb-8">
          <div className="flex items-center gap-6 p-6 border border-white/30">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-white mb-1">John Doe</h2>
              <p className="text-gray-400">Job Seeker</p>
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
                <p className="text-white">john.doe@email.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-white/30">
              <Phone className="w-5 h-5 text-white" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white">+49 123 456 7890</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-white/30">
              <MapPin className="w-5 h-5 text-white" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white">Frankfurt, Germany</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-white/30">
              <Briefcase className="w-5 h-5 text-white" />
              <div>
                <p className="text-sm text-gray-400">Looking for</p>
                <p className="text-white">Full-time opportunities</p>
              </div>
            </div>
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
                navigate("/talent-profile-summary");
              }}
              className="w-full flex items-center justify-between p-4 border border-white/30 hover:border-white transition-all"
            >
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5 text-white" />
                <span className="text-white">Edit Profile</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-white/30 hover:border-white transition-all">
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5 text-white" />
                <span className="text-white">Preferences</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-white/30 hover:border-white transition-all">
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5 text-white" />
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
