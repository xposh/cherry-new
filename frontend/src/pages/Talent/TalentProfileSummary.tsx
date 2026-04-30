import { MapPin, Edit, ExternalLink, FileText, Award } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Logo } from "../../components/Logo";

interface PortfolioItem {
  id: string;
  preview: string;
  category: string;
  caption: string;
  projectLink: string;
}

interface Language {
  language: string;
  level: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  years: string;
  level: string;
  description: string;
}

interface Recognition {
  id: string;
  award: string;
  year: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export function TalentProfileSummary() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // State
  const [profileImage, setProfileImage] = useState("");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [education, setEducation] = useState<any>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [otherExperiences, setOtherExperiences] = useState<Experience[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [jobPreferences, setJobPreferences] = useState<any>(null);

  // Setup 3 Data
  const [cvFile, setCvFile] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    // Load Setup 1 data (images)
    const setup1Data = localStorage.getItem("talentSetup1");
    if (setup1Data) {
      const data = JSON.parse(setup1Data);
      setProfileImage(data.profileImage || "");
      setPortfolioItems(data.images || []);
    }

    // Load Setup 2 data (profile info)
    const setup2Data = localStorage.getItem("talentSetup2");
    if (setup2Data) {
      const data = JSON.parse(setup2Data);
      setFormData(data.formData);
      setEducation(data.education);
      setSkills(data.skills || []);
      setExperiences(data.experiences || []);
      setOtherExperiences(data.otherExperiences || []);
      setLanguages(data.languages || []);
      setRecognitions(data.recognitions || []);
      setJobPreferences(data.jobPreferences);
    }

    // Load Setup 3 data (CV & Social)
    const setup3Data = localStorage.getItem("talentSetup3");
    if (setup3Data) {
      const data = JSON.parse(setup3Data);
      setCvFile(data.cvFile);
      setSocialLinks(data.socialLinks || []);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollTop = scrollRef.current.scrollTop;
        const windowHeight = window.innerHeight;
        const index = Math.floor(scrollTop / windowHeight);
        setCurrentIndex(Math.min(index, portfolioItems.length + 2));
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [portfolioItems.length]);

  const handleEditProfile = () => {
    navigate("/talent-profile-setup-1");
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
    } else if (platform === "GitHub") {
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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
    } else if (platform === "Facebook") {
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    } else if (platform === "TikTok") {
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    } else if (platform === "YouTube") {
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    } else if (platform === "Website") {
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
    } else {
      return <div className="w-6 h-6 rounded-full border-2 border-white"></div>;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Logo */}
      <Link to="/">
        <Logo className="fixed" />
      </Link>

      {/* Scroll Indicator */}
      <div className="fixed top-8 right-8 z-50 flex gap-1">
        {[...portfolioItems, {}, {}].map((_, index) => (
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
        {/* Portfolio Items (Gallery Images with Captions) */}
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            className="h-screen w-full flex flex-col justify-end snap-start relative"
          >
            <img
              src={item.preview}
              alt={item.category}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="relative z-10 p-8 pb-32">
              <p className="text-white text-sm font-light italic mb-1">
                {item.category}
              </p>
              {item.caption && (
                <p className="text-white text-lg font-light leading-relaxed max-w-2xl">
                  "{item.caption}"
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Profile Bio Section */}
        {profileImage && (
          <div className="h-screen w-full flex flex-col justify-end snap-start relative">
            <img
              src={profileImage}
              alt="Profile"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="relative z-10 p-8 pb-32">
              <h1 className="text-5xl font-light text-white mb-2">
                {formData?.name || "Your Name"}
              </h1>
              <p className="text-2xl text-gray-300 mb-4">
                {formData?.age || ""}
              </p>
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{formData?.location || "Your Location"}</span>
              </div>
              <div className="space-y-2">
                <p className="text-white text-lg">
                  <span className="text-gray-400">Position:</span>{" "}
                  {formData?.position || "Your Position"}
                </p>
                {formData?.specialty && (
                  <p className="text-white text-lg">
                    <span className="text-gray-400">Specialty:</span>{" "}
                    {formData.specialty}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Information Section */}
        <div className="min-h-screen w-full snap-start bg-black p-8 pb-32">
          <div className="max-w-2xl mx-auto space-y-8 pt-20">
            {/* About */}
            {formData?.about && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  About
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {formData.about}
                </p>
              </section>
            )}

            {/* CV Badge */}
            {cvFile && (
              <section>
                <div className="flex items-center gap-3 p-4 border border-white/30 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-white font-light text-sm">CV Uploaded</p>
                    <p className="text-gray-500 text-xs">{cvFile.name}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Experience
                </h2>
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-6 border border-white/30 rounded-xl"
                    >
                      <h3 className="text-xl text-white font-light mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-gray-400 mb-3">
                        {exp.company} • {exp.period}
                        {(exp.years || exp.level) && (
                          <>
                            {exp.years && ` Experience: ${exp.years}`}
                            {exp.level && ` Level: ${exp.level}`}
                          </>
                        )}
                      </p>
                      {exp.description && (
                        <p className="text-gray-300">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 border border-white text-white text-sm rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Other Work Experience */}
            {otherExperiences.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Other Work Experience
                </h2>
                <div className="space-y-6">
                  {otherExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-6 border border-white/30 rounded-xl"
                    >
                      <h3 className="text-xl text-white font-light mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-gray-400 mb-3">
                        {exp.company} • {exp.period}
                        {(exp.years || exp.level) && (
                          <>
                            {exp.years && ` Experience: ${exp.years}`}
                            {exp.level && ` Level: ${exp.level}`}
                          </>
                        )}
                      </p>
                      {exp.description && (
                        <p className="text-gray-300">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recognition */}
            {recognitions.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Recognition
                </h2>
                <div className="space-y-3">
                  {recognitions.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-start gap-3 p-4 border border-white/30 rounded-xl"
                    >
                      <Award className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white font-light">{rec.award}</p>
                        {rec.year && (
                          <p className="text-gray-400 text-sm">{rec.year}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education?.degree && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Education
                </h2>
                <div className="p-6 border border-white/30 rounded-xl">
                  <h3 className="text-xl text-white font-light mb-1">
                    {education.degree === "Other"
                      ? education.customDegree
                      : education.degree}
                  </h3>
                  {education.institution && (
                    <p className="text-gray-400">{education.institution}</p>
                  )}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Languages
                </h2>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <p key={index} className="text-gray-300">
                      {lang.language} •{" "}
                      <span className="text-gray-400">{lang.level}</span>
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Job Preferences */}
            {jobPreferences && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Job Preferences
                </h2>
                <div className="space-y-6">
                  {/* Other Positions */}
                  {jobPreferences.otherPositions?.length > 0 && (
                    <div>
                      <h3 className="text-lg text-white font-light mb-3">
                        Other Positions I'm Open To
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {jobPreferences.otherPositions.map(
                          (position: string) => (
                            <span
                              key={position}
                              className="px-4 py-2 border border-white/30 text-white text-sm rounded-lg"
                            >
                              {position}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Work Model */}
                  {jobPreferences.workModel?.length > 0 && (
                    <div>
                      <h3 className="text-lg text-white font-light mb-3">
                        Work Model
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {jobPreferences.workModel.map((model: string) => (
                          <span
                            key={model}
                            className="px-4 py-2 border border-white/30 text-white text-sm rounded-lg"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Employment Type */}
                  {jobPreferences.employmentType?.length > 0 && (
                    <div>
                      <h3 className="text-lg text-white font-light mb-3">
                        Employment Type
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {jobPreferences.employmentType.map((type: string) => (
                          <span
                            key={type}
                            className="px-4 py-2 border border-white/30 text-white text-sm rounded-lg"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobPreferences.availableFrom && (
                      <div className="p-4 border border-white/30 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">
                          Available From
                        </p>
                        <p className="text-white font-light">
                          {new Date(
                            jobPreferences.availableFrom,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {jobPreferences.employmentDuration && (
                      <div className="p-4 border border-white/30 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">
                          Employment Duration
                        </p>
                        <p className="text-white font-light">
                          {jobPreferences.employmentDuration}
                        </p>
                      </div>
                    )}
                    {jobPreferences.preferredLocation && (
                      <div className="p-4 border border-white/30 rounded-xl md:col-span-2">
                        <p className="text-gray-400 text-sm mb-1">
                          Preferred Location
                        </p>
                        <p className="text-white font-light">
                          {jobPreferences.preferredLocation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <section>
                <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-[0.2em]">
                  Social Media
                </h2>
                <div className="space-y-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
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
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
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
          className="flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-[0.2em] text-sm font-light rounded-xl shadow-2xl"
        >
          <Edit className="w-5 h-5" />
          Edit Profile
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
