import { useState } from "react";
import { Cherry, X, Check, MapPin, Globe, FileText, Award } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { mockTalents } from "../../data/mockTalents";
import { useMatch } from "../../context/MatchContext";

// Explicit Domain Interfaces corresponding to the shared storage architecture
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

interface FormDataStructure {
  name?: string;
  age?: string;
  location?: string;
  position?: string; // Gelöst: Als optional deklariert für die Formular-Daten
  specialty?: string;
  about?: string;
}

interface EducationStructure {
  degree?: string;
  customDegree?: string; // Gelöst: Hinzugefügt, um benutzerdefinierte Abschlüsse zu erlauben
  institution?: string;
}

interface JobPreferencesStructure {
  otherPositions?: string[];
  workModel?: string[];
  employmentType?: string[];
  availableFrom?: string;
  employmentDuration?: string;
  preferredLocation?: string;
}

interface CvFileStructure {
  name: string;
  [key: string]: unknown;
}

export function TalentProfileView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { likeProfile, skipProfile } = useMatch();

  // Lazy State Initialization for Local Live-Data or Fallback Mock-Data Injection
  const [profileData] = useState(() => {
    try {
      if (typeof window === "undefined") return null;

      // Check if the requested ID matches the local session user profile
      const setup2 = JSON.parse(localStorage.getItem("talentSetup2") ?? "null");
      const localForm = setup2?.formData as FormDataStructure | undefined;

      // If we are looking at our local profile or a generic preview context
      if (id === "me" || id === undefined) {
        const setup1 = JSON.parse(
          localStorage.getItem("talentSetup1") ?? "null",
        );
        const setup3 = JSON.parse(
          localStorage.getItem("talentSetup3") ?? "null",
        );

        return {
          name: localForm?.name ?? "Your Name",
          age: localForm?.age ?? "",
          location: localForm?.location ?? "Your Location",
          position: localForm?.position ?? "Your Position",
          specialty: localForm?.specialty ?? "",
          about: localForm?.about ?? "",
          profileImage: (setup1?.profileImage as string) ?? "",
          portfolioItems: (setup1?.images as PortfolioItem[]) ?? [],
          education: setup2?.education as EducationStructure | null,
          skills: (setup2?.skills as string[]) ?? [],
          experiences: (setup2?.experiences as Experience[]) ?? [],
          otherExperiences: (setup2?.otherExperiences as Experience[]) ?? [],
          languages: (setup2?.languages as Language[]) ?? [],
          recognitions: (setup2?.recognitions as Recognition[]) ?? [],
          jobPreferences:
            setup2?.jobPreferences as JobPreferencesStructure | null,
          cvFile: setup3?.cvFile as CvFileStructure | null,
          socialLinks: (setup3?.socialLinks as SocialLink[]) ?? [],
        };
      }

      // Context B2B Feed: Retrieve from central repository array
      // Hier mappen wir die Properties des statischen Objekts auf unsere Zielstruktur
      const staticTalent = mockTalents.find((t) => t.id === id);
      if (!staticTalent) return null;

      // Safe Access: Da mockTalents "position" evtl. nicht im Typ hat, definieren wir einen LegacyTalentType für den Lese-Schritt
      type LegacyTalentType = {
        id: string;
        name: string;
        age?: string;
        location?: string;
        position?: string;
        bio?: string;
        profileImage?: string;
        galleryImages?: { url: string; caption: string }[];
        education?: string;
        skills?: string[];
        experience?: string;
        languages?: string[];
        workPreference?: string[];
        availability?: string;
        portfolioLink?: string;
      };
      const legacyTalent = staticTalent as unknown as LegacyTalentType;

      // Standardize the old flat array schema into the new structured object layout
      return {
        name: legacyTalent.name,
        age: legacyTalent.age,
        location: legacyTalent.location,
        position: legacyTalent.position || "Professional", // Fallback, falls Feld im Alt-Mock fehlt
        specialty: "",
        about: legacyTalent.bio,
        profileImage: legacyTalent.profileImage,
        portfolioItems: (
          (legacyTalent.galleryImages || []) as {
            url: string;
            caption: string;
          }[]
        ).map((img) => ({
          id: Math.random().toString(),
          preview: img.url,
          category: "Gallery",
          caption: img.caption,
          projectLink: "",
        })),
        education: {
          degree: legacyTalent.education,
          institution: "",
          customDegree: "", // Standard-Initialisierung für Mocks
        } as EducationStructure,
        skills: (legacyTalent.skills || []) as string[],
        experiences: [
          {
            id: "1",
            title: "Professional Experience",
            company: "Previous Company",
            period: legacyTalent.experience || "",
            years: "",
            level: "",
            description: "",
          },
        ],
        otherExperiences: [],
        languages: ((legacyTalent.languages || []) as string[]).map((l) => ({
          language: l,
          level: "",
        })),
        recognitions: [],
        jobPreferences: {
          workModel: (legacyTalent.workPreference || []) as string[],
          availableFrom: legacyTalent.availability || "",
        } as JobPreferencesStructure,
        cvFile: null,
        socialLinks: legacyTalent.portfolioLink
          ? [{ id: "1", platform: "Website", url: legacyTalent.portfolioLink }]
          : [],
      };
    } catch {
      return null;
    }
  });

  if (!profileData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  const handleSkip = () => {
    if (id) skipProfile(id, "talent");
    navigate("/discover");
  };

  const handleLike = () => {
    if (id) likeProfile(id, "talent");
    navigate("/discover");
  };

  return (
    <div className="relative min-h-screen w-full bg-black pb-32">
      {/* Logo Area */}
      <div className="fixed top-8 left-8 z-50">
        <h2
          className="text-2xl tracking-[0.3em] uppercase flex items-center gap-1"
          style={{ color: "#2A6087" }}
        >
          CHE
          <Cherry className="w-6 h-6" style={{ color: "#2A6087" }} />Y
        </h2>
      </div>

      {/* Hero Header Section */}
      <div className="relative h-[500px] overflow-hidden">
        {profileData.profileImage && (
          <img
            src={profileData.profileImage}
            alt={profileData.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-5xl font-light text-white mb-2">
            {profileData.name}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            {profileData.age && (
              <span className="text-lg">{profileData.age} years old</span>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{profileData.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Domain View Layout */}
      <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
        {/* About Section */}
        {profileData.about && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              About
            </h2>
            <p className="text-white/80 text-lg font-light leading-relaxed">
              {profileData.about}
            </p>
          </section>
        )}

        {/* Dynamic CV Component Verification */}
        {profileData.cvFile && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Documents
            </h2>
            <div className="flex items-center gap-3 p-4 border border-white/30 rounded-xl max-w-md">
              <FileText className="w-6 h-6 text-white" />
              <div>
                <p className="text-white font-light text-sm">CV / Resume</p>
                <p className="text-gray-500 text-xs">
                  {profileData.cvFile.name}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Portfolio Gallery Grid */}
        {profileData.portfolioItems.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData.portfolioItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <img
                    src={item.preview}
                    alt={item.category}
                    className="w-full h-64 object-cover border border-white/30 rounded-lg"
                  />
                  <p className="text-gray-400 text-sm italic">
                    {item.category} {item.caption && `— "${item.caption}"`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience Blocks */}
        {profileData.experiences.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Experience
            </h2>
            <div className="space-y-4">
              {profileData.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="border border-white/30 p-6 rounded-lg"
                >
                  <h3 className="text-white text-xl font-light">{exp.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {exp.company} • {exp.period}
                  </p>
                  {exp.description && (
                    <p className="text-white/70 font-light text-sm">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Tag Array Rendering */}
        {profileData.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {profileData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 border border-white/30 text-white text-sm rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Educational Architecture and Meta Information */}
        {(profileData.education?.degree || profileData.jobPreferences) && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {profileData.education?.degree && (
                <div className="border border-white/30 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                    Education
                  </p>
                  <p className="text-white text-lg">
                    {profileData.education.degree === "Other"
                      ? profileData.education.customDegree
                      : profileData.education.degree}
                  </p>
                  {profileData.education.institution && (
                    <p className="text-gray-500 text-sm">
                      {profileData.education.institution}
                    </p>
                  )}
                </div>
              )}
              {profileData.jobPreferences?.availableFrom && (
                <div className="border border-white/30 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                    Availability
                  </p>
                  <p className="text-white text-lg">
                    {profileData.jobPreferences.availableFrom}
                  </p>
                </div>
              )}
              {profileData.jobPreferences?.workModel &&
                profileData.jobPreferences.workModel.length > 0 && (
                  <div className="border border-white/30 p-4 rounded-lg md:col-span-2">
                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                      Work Preference
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.jobPreferences.workModel.map((model) => (
                        <span
                          key={model}
                          className="px-3 py-1 bg-white/10 text-white text-sm rounded"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* Recognitions Grid */}
        {profileData.recognitions.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Recognition
            </h2>
            <div className="space-y-2">
              {profileData.recognitions.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center gap-3 p-4 border border-white/30 rounded-lg"
                >
                  <Award className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white text-sm font-light">{rec.award}</p>
                    {rec.year && (
                      <p className="text-gray-500 text-xs">{rec.year}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Standardized Languages List */}
        {profileData.languages.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Languages
            </h2>
            <div className="space-y-2">
              {profileData.languages.map((lang, index) => (
                <p key={index} className="text-white/80 font-light">
                  {lang.language}{" "}
                  {lang.level && (
                    <span className="text-gray-500 text-sm">
                      • {lang.level}
                    </span>
                  )}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Social External Connections Mapping */}
        {profileData.socialLinks.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-white mb-4 uppercase tracking-wider border-b border-white/30 pb-2">
              Links & Portfolio
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {profileData.socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="border border-white/30 p-4 rounded-lg"
                >
                  <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                    {link.platform}
                  </p>
                  <a
                    href={
                      link.url.startsWith("http")
                        ? link.url
                        : `https://${link.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 flex items-center gap-2 truncate text-lg font-light"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    {link.url}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Swiping Call-to-Actions (Fixed Footer UI) */}
      <div className="fixed bottom-24 left-0 right-0 px-8 pb-6 z-40">
        <div className="max-w-md mx-auto flex gap-6">
          <button
            onClick={handleSkip}
            className="flex-1 h-16 border-2 border-white/30 flex items-center justify-center hover:border-white/60 transition-all bg-black/50 backdrop-blur-md"
          >
            <X className="w-10 h-10 text-white" strokeWidth={1} />
          </button>
          <button
            onClick={handleLike}
            className="flex-1 h-16 border-2 border-white flex items-center justify-center hover:bg-white/10 transition-all bg-black/50 backdrop-blur-md"
          >
            <Check className="w-10 h-10 text-white" strokeWidth={1} />
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
