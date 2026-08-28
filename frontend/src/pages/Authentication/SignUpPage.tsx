import { useState, useEffect, type SubmitEventHandler } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { useAuth } from "../../context/useAuth";
import { type UserRole } from "../../context/AuthContext";

// 1. TYPEN-DEFINITION

const BACKGROUND_IMAGES = [
  "/pilates/Pilates Black 1.png",
  "/pilates/Pilates Black 2.png",
  "/pilates/Pilates Black 3.png",
];

export function SignUpPage() {
  const { signup, user } = useAuth();
  // 2. STATE
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const navigate = useNavigate();

  // 3. BACKGROUND TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 4. FORM-LOGIK
  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();

    if (!selectedRole) return alert("Bitte wähle eine Rolle aus");
    if (password !== confirmPassword)
      return alert("Passwörter stimmen nicht überein");

    console.log("Registrierung:", { selectedRole, email });

    try {
      await signup(email, password, selectedRole);
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }

    // HARDWAY-ROUTING FIX:
    // Hier muss exakt der Pfad stehen, den du in deiner routes/index.tsx definiert hast!
    if (selectedRole === "talent") {
      navigate("/talent-profile-setup-1"); // HIER: Pfad angepasst auf setup-1
    } else {
      navigate("/company-profile-setup-1"); // Falls du diese Seite noch nicht hast, leitet der Router (path: "*") dich zur Startseite
    }
  };

  if (user) {
    if (user.role === "talent") {
      return <Navigate to="/talent-profile-setup-1" />;
    } else {
      return <Navigate to="/company-profile-setup-1" />;
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBgIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt="Background"
              className="w-full h-full object-cover grayscale opacity-50"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <Logo />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="tracking-[0.2em] font-light uppercase text-sm text-[#9b9b9b]">
            SIGN UP
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ROLE SELECTION */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSelectedRole("talent")}
              className={`w-full p-5 bg-transparent border-2 transition-all duration-300 flex items-center justify-between text-left ${selectedRole === "talent" ? "border-white" : "border-white/20"}`}
            >
              <div>
                <h3 className="text-base text-white">Ich suche einen Job</h3>
                <p className="text-xs text-[#6f6f6f]">Talent</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                {selectedRole === "talent" && (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("company")}
              className={`w-full p-5 bg-transparent border-2 transition-all duration-300 flex items-center justify-between text-left ${selectedRole === "company" ? "border-white" : "border-white/20"}`}
            >
              <div>
                <h3 className="text-base text-white">Ich möchte einstellen</h3>
                <p className="text-xs text-[#6f6f6f]">Company</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                {selectedRole === "company" && (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>

          {/* INPUT FIELDS */}
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.com"
                className="w-full px-4 py-3 border border-white/30 bg-white/5 text-white rounded-xl outline-none focus:border-white transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-white/30 bg-white/5 text-white rounded-xl outline-none focus:border-white transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-white/30 bg-white/5 text-white rounded-xl outline-none focus:border-white transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black/60 hover:bg-black/80 text-white font-light uppercase tracking-[0.2em] border border-white/20 rounded-xl mt-6 transition-all active:scale-[0.98]"
          >
            Konto erstellen
          </button>

          <p className="text-center text-xs text-[#6f6f6f] mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-white underline ml-1">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
