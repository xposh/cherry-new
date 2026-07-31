import {
  MapPin,
  Users,
  DollarSign,
  Mail,
  Phone,
  Globe,
  Calendar,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import {
  FeaturedOpportunityCard,
  type FeaturedOpportunityItem,
} from "../../components/FeaturedOpportunityCard";
import { OpportunityCreator } from "../../components/OpportunityCreator/OpportunityCreator";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { useAuth } from "../../context/useAuth";
import { getSetupDraft } from "../../util/draftStorage";
import { mapCompanyProfileForSummary } from "../../util/profileMapping";

export function CompanyProfileSummary() {
  const navigate = useNavigate();
  const { companyProfile, updateCompanyProfile } = useCompanyProfile();
  const { authFetch, user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredOpportunity, setFeaturedOpportunity] =
    useState<FeaturedOpportunityItem | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [isEditingFeatured, setIsEditingFeatured] = useState(false);
  const [isDeletingFeatured, setIsDeletingFeatured] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hydratedUserRef = useRef<string | null>(null);

  const toSafeText = (value: unknown) =>
    typeof value === "string" ? value : "";

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollTop = scrollRef.current.scrollTop;
        const windowHeight = window.innerHeight;
        const index = Math.floor(scrollTop / windowHeight);
        const totalSlides = (companyProfile.companyImages?.length || 0) + 2;
        setCurrentIndex(Math.min(index, totalSlides));
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [companyProfile.companyImages?.length]);

  useEffect(() => {
    if (!user?.id) return;
    if (hydratedUserRef.current === user.id) return;
    hydratedUserRef.current = user.id;

    const loadCompanyProfile = async () => {
      const savedStep1 = getSetupDraft("companySetup1", user?.id);
      const savedStep2 = getSetupDraft("companySetup2", user?.id);
      const savedStep3 = getSetupDraft("companySetup3", user?.id);

      if (savedStep1 || savedStep2 || savedStep3) {
        updateCompanyProfile({
          companyLogo: savedStep1?.companyLogoUrl || undefined,
          companyImages: savedStep1?.uploadedImages || [],
          ...savedStep2?.companyInfo,
          cultureValues: savedStep2?.selectedValues || [],
          benefits: savedStep2?.benefits || {
            arbeitsmodell: [],
            finanziell: [],
            lifestyle: [],
            mobilitat: [],
            entwicklung: [],
          },
          ...savedStep3?.jobInfo,
          jobTitle: savedStep3?.jobInfo?.jobTitle,
          jobLocation: savedStep3?.jobInfo?.jobLocation,
          jobDescription: savedStep3?.jobInfo?.jobDescription,
          salary: savedStep3?.jobInfo?.salary,
          startDate: savedStep3?.jobInfo?.startDate,
          contactPersonPhoto: toSafeText(
            savedStep3?.contactPersonPhoto?.preview,
          ),
          contactPerson: toSafeText(savedStep3?.contactInfo?.contactPerson),
          contactRole: toSafeText(savedStep3?.contactInfo?.contactRole),
          contactMessage: toSafeText(savedStep3?.contactInfo?.contactMessage),
          contactEmail: toSafeText(savedStep3?.contactInfo?.contactEmail),
          contactPhone: toSafeText(savedStep3?.contactInfo?.contactPhone),
          contactWebsite: toSafeText(savedStep3?.contactInfo?.contactWebsite),
          requirements: savedStep3?.requirements || [],
          socialLinks: savedStep3?.socialLinks || [],
        });
      }
      try {
        const response = await authFetch("http://localhost:3000/profile");
        if (!response.ok) return;
        const data = await response.json();
        if (data?.profile) {
          updateCompanyProfile(mapCompanyProfileForSummary(data.profile));
        }
      } catch (err) {
        console.error("Failed to load company profile for summary:", err);
      }
    };

    void loadCompanyProfile();
  }, [authFetch, user?.id, updateCompanyProfile]);

  async function loadFeatured() {
    try {
      setFeaturedLoading(true);
      setFeaturedError(null);

      const res = await authFetch("/api/featured-opportunities/me");
      if (!res.ok) {
        throw new Error("Unable to load featured item");
      }
      const data = await res.json();
      setFeaturedOpportunity(data.opportunities?.[0] ?? null);
    } catch (err: unknown) {
      setFeaturedError(
        err instanceof Error ? err.message : "Could not load featured item",
      );
      setFeaturedOpportunity(null);
    } finally {
      setFeaturedLoading(false);
    }
  }

  useEffect(() => {
    loadFeatured();
  }, [authFetch]);

  async function handleDeleteFeatured() {
    if (!featuredOpportunity) return;
    try {
      setIsDeletingFeatured(true);
      setFeaturedError(null);
      const res = await authFetch(
        `/api/featured-opportunities/${featuredOpportunity.id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        throw new Error("Could not delete featured item");
      }
      setIsEditingFeatured(false);
      await loadFeatured();
    } catch (err: unknown) {
      setFeaturedError(
        err instanceof Error ? err.message : "Could not delete featured item",
      );
    } finally {
      setIsDeletingFeatured(false);
    }
  }

  const handleEditProfile = () => {
    navigate("/company-profile-setup-1");
  };

  const getSocialIcon = (platform: string) => {
    if (platform === "Instagram") {
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    } else if (platform === "LinkedIn") {
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    } else if (platform === "X (Twitter)") {
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-6 h-6 text-white"
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

  const displayIndustry =
    companyProfile.industry === "Other"
      ? companyProfile.customIndustry || "Industry"
      : companyProfile.industry || "Industry";

  const contactPersonText = toSafeText(companyProfile.contactPerson);
  const contactRoleText = toSafeText(companyProfile.contactRole);
  const contactMessageText = toSafeText(companyProfile.contactMessage);
  const contactEmailText = toSafeText(companyProfile.contactEmail);
  const contactPhoneText = toSafeText(companyProfile.contactPhone);
  const contactWebsiteText = toSafeText(companyProfile.contactWebsite);
  const contactPhotoText = toSafeText(companyProfile.contactPersonPhoto);

  const formattedStartDate = (() => {
    if (!companyProfile.startDate) return "";
    const parsed = new Date(companyProfile.startDate);
    return Number.isNaN(parsed.getTime())
      ? companyProfile.startDate
      : parsed.toLocaleDateString();
  })();

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      <Logo className="fixed" to="/" />

      {/* Scroll Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-1">
        {[...(companyProfile.companyImages || []), {}, {}].map((_, index) => (
          <div
            key={index}
            className={`w-8 h-1 transition-all rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Company Images (Gallery) with Captions */}
        {companyProfile.companyImages?.map((item) => (
          <div
            key={item.id}
            className="h-screen w-full flex flex-col justify-end snap-start relative"
          >
            <img
              src={item.preview}
              alt={item.category}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

            <div className="relative z-10 p-8 pb-32">
              <p className="text-white/60 text-xs font-light italic mb-1">
                {item.category}
              </p>
              {item.caption && (
                <p className="text-white text-lg font-light">{item.caption}</p>
              )}
            </div>
          </div>
        ))}

        {/* Company Logo Section */}
        {companyProfile.companyLogo && (
          <div className="h-screen w-full flex flex-col justify-end snap-start relative">
            <img
              src={companyProfile.companyLogo}
              alt="Company Logo"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

            <div className="relative z-10 p-8 pb-32">
              <h1 className="text-5xl font-light text-white mb-2">
                {companyProfile.companyName || "Company Name"}
              </h1>
              <div className="flex items-center gap-2 text-gray-300 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{companyProfile.location || "Location"}</span>
              </div>
              <p className="text-xl text-gray-400 mb-4">
                {displayIndustry} • Since {companyProfile.foundedYear || "2018"}
              </p>
              {companyProfile.claim && (
                <p className="text-2xl text-white font-light italic mt-6 max-w-2xl">
                  "{companyProfile.claim}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* Detailed Information Section */}
        <div className="min-h-screen w-full snap-start bg-black p-8 pb-32">
          <div className="max-w-2xl mx-auto space-y-8 pt-20">
            {/* About Company */}
            {companyProfile.description && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  About Us
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {companyProfile.description}
                </p>
              </section>
            )}

            {/* Company Details */}
            <section>
              <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                Company Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyProfile.companySize && (
                  <div className="p-4 border border-white/30 rounded-xl">
                    <p className="text-gray-400 text-sm mb-1">Company Size</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-white" />
                      <p className="text-white font-light">
                        {companyProfile.companySize} employees
                      </p>
                    </div>
                  </div>
                )}
                {companyProfile.website && (
                  <div className="p-4 border border-white/30 rounded-xl">
                    <p className="text-gray-400 text-sm mb-1">Website</p>
                    <a
                      href={companyProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors underline break-all"
                    >
                      {companyProfile.website}
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Company Culture Values */}
            {companyProfile.cultureValues &&
              companyProfile.cultureValues.length > 0 && (
                <section>
                  <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                    Werte / Company Culture
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {companyProfile.cultureValues.map((value) => (
                      <span
                        key={value}
                        className="px-4 py-2 border border-white text-white text-sm rounded-lg"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </section>
              )}

            {/* Benefits & Perks */}
            {companyProfile.benefits &&
              Object.values(companyProfile.benefits).some(
                (arr) => arr && arr.length > 0,
              ) && (
                <section>
                  <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                    Benefits & Perks
                  </h2>
                  <div className="space-y-6">
                    {companyProfile.benefits.arbeitsmodell &&
                      companyProfile.benefits.arbeitsmodell.length > 0 && (
                        <div>
                          <h3 className="text-white font-light mb-3 text-sm uppercase tracking-wider">
                            Arbeitsmodell
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {companyProfile.benefits.arbeitsmodell.map(
                              (benefit) => (
                                <span
                                  key={benefit}
                                  className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg"
                                >
                                  {benefit}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {companyProfile.benefits.finanziell &&
                      companyProfile.benefits.finanziell.length > 0 && (
                        <div>
                          <h3 className="text-white font-light mb-3 text-sm uppercase tracking-wider">
                            Finanziell
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {companyProfile.benefits.finanziell.map(
                              (benefit) => (
                                <span
                                  key={benefit}
                                  className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg"
                                >
                                  {benefit}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {companyProfile.benefits.lifestyle &&
                      companyProfile.benefits.lifestyle.length > 0 && (
                        <div>
                          <h3 className="text-white font-light mb-3 text-sm uppercase tracking-wider">
                            Lifestyle
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {companyProfile.benefits.lifestyle.map(
                              (benefit) => (
                                <span
                                  key={benefit}
                                  className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg"
                                >
                                  {benefit}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {companyProfile.benefits.mobilitat &&
                      companyProfile.benefits.mobilitat.length > 0 && (
                        <div>
                          <h3 className="text-white font-light mb-3 text-sm uppercase tracking-wider">
                            Mobilität
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {companyProfile.benefits.mobilitat.map(
                              (benefit) => (
                                <span
                                  key={benefit}
                                  className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg"
                                >
                                  {benefit}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {companyProfile.benefits.entwicklung &&
                      companyProfile.benefits.entwicklung.length > 0 && (
                        <div>
                          <h3 className="text-white font-light mb-3 text-sm uppercase tracking-wider">
                            Entwicklung
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {companyProfile.benefits.entwicklung.map(
                              (benefit) => (
                                <span
                                  key={benefit}
                                  className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg"
                                >
                                  {benefit}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </section>
              )}

            {/* Open Position */}
            {companyProfile.jobTitle && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Open Position
                </h2>
                <div className="p-6 border border-white/30 rounded-xl">
                  <h3 className="text-xl text-white font-light mb-2">
                    {companyProfile.jobTitle}
                  </h3>
                  {companyProfile.jobLocation && (
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {companyProfile.jobLocation}
                      </span>
                    </div>
                  )}
                  {companyProfile.jobDescription && (
                    <p className="text-gray-300 mb-4">
                      {companyProfile.jobDescription}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {companyProfile.salary && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">{companyProfile.salary}</span>
                      </div>
                    )}
                    {companyProfile.startDate && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Start: {formattedStartDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Work Model */}
                  {companyProfile.workModel &&
                    companyProfile.workModel.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {companyProfile.workModel.map((model) => (
                          <span
                            key={model}
                            className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Requirements */}
                  {companyProfile.requirements &&
                    companyProfile.requirements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-white text-sm mb-2">
                          Anforderungen:
                        </p>
                        <ul className="space-y-1">
                          {companyProfile.requirements.map((req) => (
                            <li
                              key={req}
                              className="text-gray-300 text-sm flex items-start gap-2"
                            >
                              <span className="text-white mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </section>
            )}

            {/* Contact Person */}
            {(contactPersonText || contactEmailText) && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Ansprechpartnerin
                </h2>
                <div className="border border-white/30 rounded-xl overflow-hidden">
                  {contactPhotoText && (
                    <img
                      src={contactPhotoText}
                      alt={contactPersonText}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-6">
                    {contactPersonText && (
                      <h3 className="text-xl text-white font-light mb-1">
                        {contactPersonText}
                      </h3>
                    )}
                    {contactRoleText && (
                      <p className="text-gray-400 text-sm mb-4">
                        {contactRoleText}
                      </p>
                    )}
                    {contactMessageText && (
                      <p className="text-gray-300 italic mb-6 border-l-2 border-white/30 pl-4">
                        "{contactMessageText}"
                      </p>
                    )}

                    <div className="space-y-3 mt-6 pt-6 border-t border-white/20">
                      <h4 className="text-white font-light text-sm uppercase tracking-wider mb-4">
                        Kontakt
                      </h4>
                      {contactEmailText && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-white/60" />
                          <a
                            href={`mailto:${contactEmailText}`}
                            className="text-white hover:text-gray-300 transition-colors"
                          >
                            {contactEmailText}
                          </a>
                        </div>
                      )}
                      {contactPhoneText && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-white/60" />
                          <a
                            href={`tel:${contactPhoneText}`}
                            className="text-white hover:text-gray-300 transition-colors"
                          >
                            {contactPhoneText}
                          </a>
                        </div>
                      )}
                      {contactWebsiteText && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-white/60" />
                          <a
                            href={contactWebsiteText}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-300 transition-colors break-all"
                          >
                            {contactWebsiteText}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Social Media */}
            {companyProfile.socialLinks &&
              companyProfile.socialLinks.length > 0 && (
                <section>
                  <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                    Social Media
                  </h2>
                  <div className="space-y-3">
                    {companyProfile.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={
                          link.url.startsWith("http")
                            ? link.url
                            : `https://${link.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-white/30 rounded-xl hover:border-white transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          {getSocialIcon(link.platform)}
                          <div>
                            <p className="text-white/60 text-xs">
                              {link.platform}
                            </p>
                            <p className="text-white font-light">{link.url}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            {featuredLoading ? (
              <section className="pt-12">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
                  Loading featured opportunity...
                </div>
              </section>
            ) : featuredError ? (
              <section className="pt-12">
                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-10 text-center text-rose-100">
                  {featuredError}
                </div>
              </section>
            ) : featuredOpportunity ? (
              <section className="pt-12">
                <FeaturedOpportunityCard
                  opportunity={featuredOpportunity}
                  ctaLabel="Featured now"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingFeatured((prev) => !prev)}
                    className="px-5 py-2 border border-white/30 text-white rounded-xl hover:border-white transition-all"
                  >
                    {isEditingFeatured ? "Close Edit" : "Edit Featured"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteFeatured}
                    disabled={isDeletingFeatured}
                    className="px-5 py-2 border border-red-500/40 text-red-200 rounded-xl hover:border-red-400 transition-all disabled:opacity-60"
                  >
                    {isDeletingFeatured ? "Deleting..." : "Delete Featured"}
                  </button>
                </div>
                {isEditingFeatured ? (
                  <div className="mt-6">
                    <OpportunityCreator
                      role="company"
                      ctaText="Update your public featured opportunity."
                      authFetch={authFetch}
                      editMode
                      opportunityId={featuredOpportunity.id}
                      initialValues={{
                        title: featuredOpportunity.title,
                        description: featuredOpportunity.description ?? "",
                        deadline: featuredOpportunity.deadline
                          ? new Date(featuredOpportunity.deadline)
                              .toISOString()
                              .slice(0, 16)
                          : "",
                        image_url: featuredOpportunity.image_url,
                        video_url: featuredOpportunity.video_url,
                      }}
                      onCancelEdit={() => setIsEditingFeatured(false)}
                      onSuccess={() => {
                        setIsEditingFeatured(false);
                        loadFeatured();
                      }}
                    />
                  </div>
                ) : null}
              </section>
            ) : (
              <section className="pt-12">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
                  No active featured opportunity yet.
                </div>
                <div className="mt-6">
                  <OpportunityCreator
                    role="company"
                    ctaText="Create your first public featured opportunity."
                    authFetch={authFetch}
                    onSuccess={() => {
                      loadFeatured();
                    }}
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Button - Fixed at Bottom */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={handleEditProfile}
          className="group flex items-center gap-3 px-8 py-4 bg-gray-500/20 text-white/50 hover:text_black hover:bg-gray-200 transition-all uppercase tracking-[0.2em] text-sm font-light rounded-xl shadow-2xl"
        >
          <span className="text-white/50 group-hover:text-black transition-colors duration-300">
            {/*<Edit className="w-5 h-5" /> */}
            Edit Profile
          </span>
        </button>
      </div>

      <style>{`
        /* Hide scrollbar */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
