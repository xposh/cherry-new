import { Plus, X, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { OpportunityCreator } from "../../components/OpportunityCreator/OpportunityCreator";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { useAuth } from "../../context/useAuth"; //  NEU HINZUGEFÜGT
import { getSetupDraft, setSetupDraft } from "../../util/draftStorage";
import { mapCompanyProfileToSetup3 } from "../../util/profileMapping";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export function CompanyProfileSetup3() {
  const navigate = useNavigate();
  const { updateCompanyProfile, companyProfile } = useCompanyProfile();
  const { authFetch, finishProfile, user } = useAuth(); // NEU HINZUGEFÜGT

  const getSavedData = () => {
    try {
      return getSetupDraft("companySetup3", user?.id);
    } catch (e) {
      console.error("Fehler beim Parsen von companySetup3:", e);
      return null;
    }
  };

  const savedData = getSavedData();
  const toSafeText = (value: unknown) =>
    typeof value === "string" ? value : "";

  const [jobInfo, setJobInfo] = useState({
    jobTitle: toSafeText(savedData?.jobInfo?.jobTitle),
    jobLocation: toSafeText(savedData?.jobInfo?.jobLocation),
    jobDescription: toSafeText(savedData?.jobInfo?.jobDescription),
    salary: toSafeText(savedData?.jobInfo?.salary),
    startDate: toSafeText(savedData?.jobInfo?.startDate),
  });

  const [workModel, setWorkModel] = useState<string[]>(
    savedData?.workModel || [],
  );
  const [requirements, setRequirements] = useState<string[]>(
    savedData?.requirements || [],
  );
  const [newRequirement, setNewRequirement] = useState(
    savedData?.newRequirement || "",
  );

  const [contactPersonPhoto, setContactPersonPhoto] = useState({
    file: null as File | null,
    preview: toSafeText(savedData?.contactPersonPhoto?.preview),
  });

  const [contactInfo, setContactInfo] = useState({
    contactPerson: toSafeText(savedData?.contactInfo?.contactPerson),
    contactRole: toSafeText(savedData?.contactInfo?.contactRole),
    contactMessage: toSafeText(savedData?.contactInfo?.contactMessage),
    contactEmail: toSafeText(savedData?.contactInfo?.contactEmail),
    contactPhone: toSafeText(savedData?.contactInfo?.contactPhone),
    contactWebsite: toSafeText(savedData?.contactInfo?.contactWebsite),
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    savedData?.socialLinks || [],
  );
  const [newSocialPlatform, setNewSocialPlatform] = useState(
    savedData?.newSocialPlatform || "Instagram",
  );
  const [newSocialUrl, setNewSocialUrl] = useState(
    savedData?.newSocialUrl || "",
  );

  useEffect(() => {
    async function hydrateFromBackend() {
      if (!user?.id) return;
      if (getSetupDraft("companySetup3", user.id)) return;

      try {
        const res = await authFetch("http://localhost:3000/profile");
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.profile) return;

        const mapped = mapCompanyProfileToSetup3(data.profile);
        setJobInfo(mapped.jobInfo as typeof jobInfo);
        setWorkModel(mapped.workModel as string[]);
        setRequirements(mapped.requirements as string[]);
        setContactPersonPhoto(mapped.contactPersonPhoto as typeof contactPersonPhoto);
        setContactInfo(mapped.contactInfo as typeof contactInfo);
        setSocialLinks(mapped.socialLinks as SocialLink[]);
        setNewSocialPlatform(mapped.newSocialPlatform || "Instagram");
        setNewSocialUrl(mapped.newSocialUrl || "");
      } catch (err) {
        console.error("Failed to hydrate company setup step 3 from backend:", err);
      }
    }

    hydrateFromBackend();
  }, [authFetch, user?.id]);

  const socialPlatforms = [
    "Instagram",
    "LinkedIn",
    "X (Twitter)",
    "Facebook",
    "TikTok",
    "YouTube",
    "Website",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name in jobInfo) {
      setJobInfo({ ...jobInfo, [name]: value });
    } else {
      setContactInfo({ ...contactInfo, [name]: value });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContactPersonPhoto({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const toggleWorkModel = (model: string) => {
    if (workModel.includes(model)) {
      setWorkModel(workModel.filter((m) => m !== model));
    } else {
      setWorkModel([...workModel, model]);
    }
  };

  const addRequirement = () => {
    if (
      newRequirement.trim() &&
      !requirements.includes(newRequirement.trim())
    ) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (req: string) => {
    setRequirements(requirements.filter((r) => r !== req));
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
    } else {
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
    }
  };

  const handleFinish = async () => {
    const sanitizedContactInfo = {
      contactPerson: toSafeText(contactInfo.contactPerson),
      contactRole: toSafeText(contactInfo.contactRole),
      contactMessage: toSafeText(contactInfo.contactMessage),
      contactEmail: toSafeText(contactInfo.contactEmail),
      contactPhone: toSafeText(contactInfo.contactPhone),
      contactWebsite: toSafeText(contactInfo.contactWebsite),
    };

    const localPage3Data = {
      jobInfo,
      workModel,
      requirements,
      newRequirement,
      contactPersonPhoto: { preview: contactPersonPhoto.preview },
      contactInfo: sanitizedContactInfo,
      socialLinks,
      newSocialPlatform,
      newSocialUrl,
    };
    setSetupDraft("companySetup3", user?.id, localPage3Data);
    // 2. ✅ BACKEND-INTEGRATION: Sende alle Daten zum Backend
    const savedStep1 = getSetupDraft("companySetup1", user?.id);
    const savedStep2 = getSetupDraft("companySetup2", user?.id);
    const contextProfile = companyProfile || {};
    const fullPayload = {
      companyLogo:
        savedStep1?.companyLogoUrl || contextProfile.companyLogo || undefined,
      companyImages:
        savedStep1?.uploadedImages || contextProfile.companyImages || [],
      ...savedStep2?.companyInfo,
      cultureValues: savedStep2?.selectedValues || [],
      benefits: savedStep2?.benefits || {
        arbeitsmodell: [],
        finanziell: [],
        lifestyle: [],
        mobilitat: [],
        entwicklung: [],
      },
      ...jobInfo,
      workModel,
      requirements,
      salary: jobInfo.salary,
      startDate: jobInfo.startDate,
      contactPersonPhoto: contactPersonPhoto.preview,
      ...sanitizedContactInfo,
      socialLinks: socialLinks.map(({ platform, url }) => ({ platform, url })),
    };
    const profileData = fullPayload;

    // 1. Update Context (für Summary)
    updateCompanyProfile(fullPayload);

    try {
      // ✅ authFetch sendet automatisch JWT Token mit!
      // ✅ KEIN user_id im Body - kommt aus Token!
      const response = await authFetch("http://localhost:3000/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Speichern");
      }

      const result = await response.json();
      console.log("✅ Company-Profil erfolgreich gespeichert:", result.message);

      // ✅ Profile als complete markieren
      finishProfile();

      navigate("/company-profile-summary");
    } catch (error) {
      console.error("❌ Fehler beim Speichern:", error);
      alert("Profile could not be saved. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-20">
      <Logo to="/" />

      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-32 pb-32">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-4">
            Offene Stellen
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Tell us about the job position and how to reach you.
          </p>
        </div>

        <div className="space-y-12">
          {/* Job Details */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Stelle 1
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Titel (z.B. Chef de Partie)"
                  value={jobInfo.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                />
                <input
                  type="text"
                  name="jobLocation"
                  placeholder="Standort (z.B. Hamburg)"
                  value={jobInfo.jobLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                />
              </div>

              {/* Arbeitsmodell */}
              <div>
                <label className="block text-white font-light mb-3 text-sm">
                  Arbeitsmodell
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Remote", "Office", "Hybrid"].map((model) => (
                    <button
                      key={model}
                      onClick={() => toggleWorkModel(model)}
                      className={`px-6 py-3 border transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg ${
                        workModel.includes(model)
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-white border-white/30 hover:border-white"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                name="jobDescription"
                placeholder="Kurzbeschreibung (z.B. Kreative Küche, moderne Techniken, französische Tradition)"
                value={jobInfo.jobDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light resize-none rounded-lg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="salary"
                  placeholder="Gehalt (optional, z.B. 3.200 - 3.800 €)"
                  value={jobInfo.salary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                />
                <input
                  type="date"
                  name="startDate"
                  placeholder="Startdatum"
                  value={jobInfo.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Anforderungen (Optional)
            </h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                placeholder="z.B. 3+ Jahre Erfahrung"
                className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <button
                onClick={addRequirement}
                className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-all rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {requirements.map((req) => (
                <div
                  key={req}
                  className="flex items-center gap-2 px-4 py-2 border border-white text-white group hover:border-red-500 hover:text-red-500 transition-colors rounded-lg"
                >
                  <span className="font-light text-sm">{req}</span>
                  <button onClick={() => removeRequirement(req)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
          {/* Ansprechpartner */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Ansprechpartner
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Wer ist das Gesicht eures Unternehmens?
            </p>

            {/* Photo Upload */}
            <div className="mb-6">
              <label className="block text-white font-light mb-3 text-sm">
                Foto (Optional)
              </label>
              <p className="text-gray-400 text-xs mb-4">
                Ein Gesicht der Ansprechpartner:in macht das Ganze persönlicher
              </p>
              {!contactPersonPhoto.preview ? (
                <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-white/60 transition-colors cursor-pointer max-w-xs">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="contact-photo"
                  />
                  <label htmlFor="contact-photo" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-white/40 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">Upload Photo</p>
                  </label>
                </div>
              ) : (
                <div className="max-w-xs">
                  <div className="relative group">
                    <img
                      src={contactPersonPhoto.preview}
                      alt="Contact Person"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      onClick={() =>
                        setContactPersonPhoto({ file: null, preview: "" })
                      }
                      className="absolute top-3 right-3 p-2 bg-black/80 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <input
                type="text"
                name="contactPerson"
                placeholder="Name (z.B. Sophie Laurent)"
                value={contactInfo.contactPerson}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="text"
                name="contactRole"
                placeholder="Rolle (z.B. Gründerin & Head Chef)"
                value={contactInfo.contactRole}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <textarea
                name="contactMessage"
                placeholder="Persönliche Nachricht (z.B. Ich suche Menschen, die Leidenschaft für gutes Essen haben...)"
                value={contactInfo.contactMessage}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light resize-none rounded-lg"
              />
            </div>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-gray-400 text-xs italic flex items-start gap-2">
                <span className="text-white">ℹ</span>
                <span>
                  Menschlich statt förmlich - Zeigt, wer ihr seid. Eine
                  persönliche Note macht den Unterschied.
                </span>
              </p>
            </div>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Kontakt
            </h2>
            <div className="space-y-6">
              <input
                type="email"
                name="contactEmail"
                placeholder="E-Mail (z.B. jobs@lavieenrose-hh.de)"
                value={contactInfo.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="tel"
                name="contactPhone"
                placeholder="Telefonnummer (Optional, z.B. +49 40 1234567)"
                value={contactInfo.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="url"
                name="contactWebsite"
                placeholder="Website (Optional, z.B. https://lavieenrose-hamburg.de)"
                value={contactInfo.contactWebsite}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
            </div>
          </section>

          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Featured Opportunity
            </h2>
            <OpportunityCreator
              role="company"
              ctaText="Create a featured job, event, or showcase that attracts the right talent."
              authFetch={authFetch}
              onSuccess={() => {
                // optional hook for success events
              }}
            />
          </section>

          {/* Social Media */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Social Media
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Verbindet eure Social Media Profile
            </p>

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
                placeholder="https://..."
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

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-white/20 mt-12">
          <Link
            to="/company-profile-setup-2"
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
