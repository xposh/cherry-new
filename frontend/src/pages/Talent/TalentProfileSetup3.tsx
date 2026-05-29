import { Upload, FileText, X, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { supabase } from "../../util/supabase";
import { useAuth } from "../../context/useAuth"; // ✅ useAuth importieren

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export function TalentProfileSetup3() {
  // ✅ FIX: authFetch aus useAuth holen!
  const { user, finishProfile, authFetch } = useAuth();
  const navigate = useNavigate();

  // Helper-Funktion zur sicheren Extraktion von verschachtelten localStorage-Daten (Re-Hydration)
  const getSavedData = () => {
    try {
      const saved = localStorage.getItem("talentSetup3");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Fehler beim Parsen von talentSetup3:", e);
      return null;
    }
  };

  const savedData = getSavedData();

  // 1. ZUSTANDS-INITIALISIERUNG AUS DEM LOCALSTORAGE (RE-HYDRATION)
  const [cvUrl, setCvUrl] = useState<string | null>(savedData?.cvUrl || null);
  const [cvFile, setCvFile] = useState<{ name: string; size: number } | null>(
    savedData?.cvFile || null,
  );
  const [availability, setAvailability] = useState(
    savedData?.availability || "",
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    savedData?.socialLinks || [],
  );
  const [newSocialPlatform, setNewSocialPlatform] = useState("Instagram");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const socialPlatforms = [
    "Instagram",
    "LinkedIn",
    "X (Twitter)",
    "Facebook",
    "TikTok",
    "YouTube",
    "GitHub",
    "Website",
    "Other",
  ];

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      try {
        setIsUploading(true);

        const fileExtension = file.name.split(".").pop();
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;

        const uploadResponse = await supabase.storage
          .from("talents")
          .upload(uniqueFileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadResponse.error) {
          throw uploadResponse.error;
        }

        const { data: publicUrlData } = supabase.storage
          .from("talents")
          .getPublicUrl(uniqueFileName);

        setCvUrl(publicUrlData.publicUrl);
        setCvFile({ name: file.name, size: file.size });

        console.log(
          "Datei im Cloud-Storage abgelegt. URL:",
          publicUrlData.publicUrl,
        );
      } catch (err) {
        console.error("Kritischer Fehler beim Cloud-Upload:", err);
        alert("Upload fehlgeschlagen. Bitte versuche es erneut.");
        setCvFile(null);
        setCvUrl(null);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert("Please upload a PDF file");
    }
  };

  const removeCv = () => {
    setCvFile(null);
    setCvUrl(null);
  };

  const addSocialLink = () => {
    if (newSocialUrl.trim()) {
      setSocialLinks([
        ...socialLinks,
        {
          id: Math.random().toString(36).substr(2, 9),
          platform: newSocialPlatform,
          url: newSocialUrl.trim(),
        },
      ]);
      setNewSocialUrl("");
    }
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case "LinkedIn":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case "GitHub":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" />
          </svg>
        );
    }
  };

  const handleFinish = async () => {
    if (!user) {
      alert("Please sign in before finishing your profile.");
      return;
    }
    if (isUploading) {
      alert("Bitte warte, bis der CV-Upload vollständig abgeschlossen ist.");
      return;
    }

    // 2. LOKALE PERSISTIERUNG FÜR DIE SUMMARY
    const localPage3Data = {
      cvUrl,
      cvFile,
      availability,
      socialLinks,
    };
    localStorage.setItem("talentSetup3", JSON.stringify(localPage3Data));

    // Transformation der Links für das Backend
    const structuredSocialLinks = socialLinks.reduce(
      (acc, curr) => {
        acc[curr.platform.toLowerCase().replace(/[^a-z0-9]/g, "")] = curr.url;
        return acc;
      },
      {} as Record<string, string>,
    );

    // ✅ FIX: user_id wurde entfernt - kommt aus Token!
    const page3Data = {
      availability: availability,
      socialLinks: socialLinks,
      social_links: structuredSocialLinks,
      cvUrl: cvUrl,
      cvMetadata: cvFile,
    };

    try {
      // ✅ FIX: authFetch schickt automatisch Token mit!
      const response = await authFetch("http://localhost:3000/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(page3Data),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Senden der Page 3 Daten an den Server.");
      }

      const result = await response.json();
      finishProfile();
      navigate("/talent-profile-summary");
      console.log("Server-Antwort Page 3 erfolgreich:", result.message);
    } catch (error) {
      console.warn(
        "API Error temporär ignoriert, fahre mit LocalStorage-Daten fort:",
        error,
      );
      alert("Profile could not be saved");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-20">
      <Link to="/">
        <Logo />
      </Link>

      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-32 pb-32">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-4">Final Details</h1>
          <p className="text-gray-400 text-lg font-light">
            Upload your CV and add your contact information.
          </p>
        </div>

        <div className="space-y-8">
          {/* CV Upload */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Resume / CV
            </h2>
            {!cvFile ? (
              <div
                className={`border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/60 transition-colors cursor-pointer ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCvUpload}
                  className="hidden"
                  id="cv-upload"
                  disabled={isUploading}
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white font-light mb-2">
                    {isUploading ? "Uploading to Cloud..." : "Upload your CV"}
                  </p>
                  <p className="text-gray-500 text-sm">PDF up to 10MB</p>
                </label>
              </div>
            ) : (
              <div className="p-6 border border-white/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-white" />
                  <div>
                    <p className="text-white font-light">{cvFile.name}</p>
                    <p className="text-gray-500 text-sm">
                      {(cvFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCv}
                  disabled={isUploading}
                  className="p-2 hover:bg-red-600 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </section>

          {/* Availability */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Availability
            </h2>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
            >
              <option value="" className="bg-black">
                Select availability
              </option>
              <option value="immediate" className="bg-black">
                Immediately
              </option>
              <option value="2weeks" className="bg-black">
                2 weeks notice
              </option>
              <option value="1month" className="bg-black">
                1 month notice
              </option>
              <option value="3months" className="bg-black">
                3 months notice
              </option>
              <option value="not-looking" className="bg-black">
                Not actively looking
              </option>
            </select>
          </section>

          {/* Social Media */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Social Media & Website
            </h2>
            <div className="flex gap-3 mb-6">
              <select
                value={newSocialPlatform}
                onChange={(e) => setNewSocialPlatform(e.target.value)}
                className="w-48 px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
              >
                {socialPlatforms.map((platform) => (
                  <option key={platform} value={platform} className="bg-black">
                    {platform}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                placeholder={
                  newSocialPlatform === "Instagram"
                    ? "@username or URL"
                    : newSocialPlatform === "Website"
                      ? "https://yourwebsite.com"
                      : "URL or username"
                }
                className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <button
                onClick={addSocialLink}
                className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-all rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 border border-white/30 rounded-xl group hover:border-red-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getSocialIcon(link.platform)}
                    <div>
                      <p className="text-white/60 text-xs">{link.platform}</p>
                      <p className="text-white font-light text-sm truncate max-w-md">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSocialLink(link.id)}
                    className="text-white/60 group-hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-white/20 mt-12">
          <Link
            to="/talent-profile-setup-2"
            className="px-8 py-3 border border-white/30 text-white hover:border-white transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg"
          >
            Back
          </Link>
          <button
            onClick={handleFinish}
            disabled={isUploading}
            className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Finish & Preview
          </button>
        </div>
      </div>
    </div>
  );
}
