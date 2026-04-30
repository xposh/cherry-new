import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// Das Interface definiert die Struktur des Objekts im gesamten Projekt
interface ProfileData {
  // Step 1 & 2 Felder
  name?: string;
  jobTitle?: string;
  location?: string;
  bio?: string;
  educationLevel?: string;
  degree?: string;
  university?: string;
  experienceYears?: string;
  seniority?: string;
  otherExperience?: string;
  formerWorkplace?: string;
  skills?: string[];
  projectLinks?: string[];
  languages?: { name: string; level: string }[];
  idealPosition?: string;
  openPositions?: string;
  workModel?: string;
  availableFrom?: string;
  employmentType?: string;
  employmentDuration?: string;
  locationPreference?: string;
  profileImage?: string;

  // NEU: Felder für Step 3 (Damit es keine Unterkringel (den Fehler auswirft)
  specialties?: string;
  communities?: string[];
  socialLinks?: { platform: string; url: string }[];
  email?: string;
  phone?: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (newData: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({
    skills: [],
    projectLinks: [],
    languages: [],
    communities: [], // Initialwert für Step 3
    socialLinks: [], // Initialwert für Step 3
  });

  const updateProfile = (newData: Partial<ProfileData>) => {
    // Der Spread-Operator (...) sorgt dafür, dass alte Daten erhalten bleiben
    setProfile((prev) => ({ ...prev, ...newData }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error(
      "useProfile muss innerhalb eines ProfileProviders genutzt werden!",
    );
  return context;
};
