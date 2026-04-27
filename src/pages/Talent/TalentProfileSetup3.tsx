import { Upload, FileText, X, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export function TalentProfileSetup3() {
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [availability, setAvailability] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocialPlatform, setNewSocialPlatform] = useState("Instagram");
  const [newSocialUrl, setNewSocialUrl] = useState("");

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

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const removeCv = () => {
    setCvFile(null);
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
    if (platform === "Instagram") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    } else if (platform === "LinkedIn") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    } else if (platform === "GitHub") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    } else if (platform === "X (Twitter)") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    } else if (platform === "Facebook") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    } else if (platform === "TikTok") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    } else if (platform === "YouTube") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    } else if (platform === "Website") {
      return (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" />
          <path
            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
            strokeWidth="2"
          />
        </svg>
      );
    } else {
      return <div className="w-5 h-5 rounded-full border-2 border-white"></div>;
    }
  };

  const handleFinish = () => {
    const setupData = {
      cvFile: cvFile
        ? {
            name: cvFile.name,
            size: cvFile.size,
          }
        : null,
      availability,
      socialLinks,
    };

    localStorage.setItem("talentSetup3", JSON.stringify(setupData));

    navigate("/talent-profile-summary");
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-20">
      {/* Logo */}
      <Link to="/">
        <Logo />
      </Link>

      {/* Progress Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white rounded-full"></div>
      </div>

      {/* Content */}
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
              <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/60 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCvUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white font-light mb-2">Upload your CV</p>
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
                  className="p-2 hover:bg-red-600 rounded-full transition-colors"
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

          {/* Social Media & Website */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Social Media & Website
            </h2>

            {/* Add New Link */}
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
                      : newSocialPlatform === "GitHub"
                        ? "https://github.com/username"
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

            {/* Social Links List */}
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

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-white/20 mt-12">
          <Link
            to="/talent-profile-setup-2"
            className="px-8 py-3 border border-white/30 text-white hover:border-white transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg"
          >
            Back
          </Link>
          <button
            onClick={handleFinish}
            className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg"
          >
            Finish & Preview
          </button>
        </div>
      </div>
    </div>
  );
}
