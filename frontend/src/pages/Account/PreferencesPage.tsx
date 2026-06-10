import {
  ArrowLeft,
  Settings,
  Eye,
  Map,
  Bell,
  CreditCard,
  Briefcase,
  CalendarDays,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Logo } from "../../components/Logo";

export function PreferencesPage() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>(); // Holt das "talent" oder "company" aus der Webadresse

  const isTalentRoute = role === "talent";

  // Lokale Zustände für die Schalter (Mocks) - Unveränderte Logik
  const [discoveryMode, setDiscoveryMode] = useState(true);
  const [showJobs, setShowJobs] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [travelMode, setTravelMode] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black pb-24 text-white">
      {/* Logo */}
      <Logo />

      <div className="max-w-4xl mx-auto px-8 pt-40 pb-8">
        {/* Zurück-Button & Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 transition-all rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <Settings className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-light text-white uppercase tracking-widest">
              Preferences ({isTalentRoute ? "Talent" : "Company"})
            </h1>
          </div>
        </div>

        {/* SEKTION 1: DISCOVERY CONFIGURATION */}
        <section className="mb-12">
          <h2 className="text-base font-normal text-gray-400 mb-6 tracking-wide">
            Discovery Preferences
          </h2>
          <div className="space-y-4">
            {/* Feld 1: Discovery Mode */}
            <div className="flex items-center justify-between p-6 border border-white/30 bg-transparent">
              <div className="flex items-start gap-4">
                <Eye className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    Discovery Mode
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    {isTalentRoute
                      ? "When enabled, your profile is visible to culinary companies looking for talent."
                      : "When enabled, your company profile is visible to talents looking for jobs and events."}
                  </p>
                </div>
              </div>
              {/* FIX: Zurück auf dein Signature-Blau #2A6087 ohne künstlichen Glow */}
              <button
                onClick={() => setDiscoveryMode(!discoveryMode)}
                className={`w-14 h-8 rounded-full border border-white/20 p-1 transition-all duration-300 ease-in-out ${
                  discoveryMode ? "bg-primary border-primary" : "bg-neutral-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
                    discoveryMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Feld 2: Job Opportunities (Mit Briefcase Icon & Signature-Blau) */}
            <div className="flex items-center justify-between p-6 border border-white/30 bg-transparent">
              <div className="flex items-start gap-4">
                <Briefcase className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    {isTalentRoute
                      ? "Show Job Opportunities"
                      : "Show Available Talents"}
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    {isTalentRoute
                      ? "Display high-end permanent and freelance job listings on your feed."
                      : "Display premium chef and service talent applications matching your criteria."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowJobs(!showJobs)}
                className={`w-14 h-8 rounded-full border border-white/20 p-1 transition-all duration-300 ease-in-out ${
                  showJobs ? "bg-primary border-primary" : "bg-neutral-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
                    showJobs ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Feld 3: Event Filter (Mit CalendarDays Icon & Signature-Blau) */}
            <div className="flex items-center justify-between p-6 border border-white/30 bg-transparent">
              <div className="flex items-start gap-4">
                <CalendarDays className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    {isTalentRoute
                      ? "Show Events & Fairs"
                      : "Show My Listed Events"}
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    {isTalentRoute
                      ? "Display exclusive culinary events, exhibitions, and masterclasses."
                      : "Monitor the performance and active matching pool of your company's live events."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEvents(!showEvents)}
                className={`w-14 h-8 rounded-full border border-white/20 p-1 transition-all duration-300 ease-in-out ${
                  showEvents ? "bg-primary border-primary" : "bg-neutral-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
                    showEvents ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Feld 4: Travel Mode */}
            <div className="flex items-center justify-between p-6 border border-white/30 bg-transparent">
              <div className="flex items-start gap-4">
                <Map className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    Travel Mode
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    Override your current location to match with partners in
                    target regions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTravelMode(!travelMode)}
                className={`w-14 h-8 rounded-full border border-white/20 p-1 transition-all duration-300 ease-in-out ${
                  travelMode ? "bg-primary border-primary" : "bg-neutral-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
                    travelMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* SEKTION 2: SYSTEM & BILLING */}
        <section className="mb-12">
          <h2 className="text-base font-normal text-gray-400 mb-6 tracking-wide">
            System & Billing
          </h2>
          <div className="space-y-4">
            {/* Feld 5: Push Notifications */}
            <div className="flex items-center justify-between p-6 border border-white/30 bg-transparent">
              <div className="flex items-start gap-4">
                <Bell className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    Get instant updates on new matches, direct messages, and
                    applications.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-14 h-8 rounded-full border border-white/20 p-1 transition-all duration-300 ease-in-out ${
                  pushEnabled
                    ? "bg-[#2A6087] border-[#2A6087]"
                    : "bg-neutral-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
                    pushEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Feld 6: Zahlungen */}
            <button className="w-full flex items-center justify-between p-6 border border-white/30 bg-transparent hover:border-white transition-all text-left">
              <div className="flex items-start gap-4">
                <CreditCard className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <div>
                  <p className="font-normal text-lg tracking-wide text-white">
                    Payment & Membership
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    Manage your premium features, billing history, and invoices.
                  </p>
                </div>
              </div>
              <span className="text-white font-normal text-sm tracking-wider">
                Manage →
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
