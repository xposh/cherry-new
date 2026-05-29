import { createContext, useContext, useState, type ReactNode } from "react";

// Interface für Company Profile Daten
interface CompanyProfileData {
  // Setup 1 - Visual Profile
  companyLogo?: string;
  companyImages?: Array<{
    id: string;
    preview: string;
    category: string;
    caption?: string;
  }>;

  // Setup 2 - Company Information
  companyName?: string;
  industry?: string;
  customIndustry?: string;
  location?: string;
  foundedYear?: string;
  companySize?: string;
  website?: string;
  claim?: string;
  description?: string;
  cultureValues?: string[];
  benefits?: {
    arbeitsmodell?: string[];
    finanziell?: string[];
    lifestyle?: string[];
    mobilitat?: string[];
    entwicklung?: string[];
  };

  // Setup 3 - Job Posting & Contact
  jobTitle?: string;
  jobLocation?: string;
  workModel?: string[];
  jobDescription?: string;
  requirements?: string[];
  salary?: string;
  startDate?: string;

  contactPersonPhoto?: string;
  contactPerson?: string;
  contactRole?: string;
  contactMessage?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

interface CompanyProfileContextType {
  companyProfile: CompanyProfileData;
  updateCompanyProfile: (newData: Partial<CompanyProfileData>) => void;
}

const CompanyProfileContext = createContext<CompanyProfileContextType | null>(
  null,
);

export function CompanyProfileProvider({ children }: { children: ReactNode }) {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfileData>({
    companyImages: [],
    cultureValues: [],
    benefits: {
      arbeitsmodell: [],
      finanziell: [],
      lifestyle: [],
      mobilitat: [],
      entwicklung: [],
    },
    requirements: [],
    workModel: [],
    socialLinks: [],
  });

  const updateCompanyProfile = (newData: Partial<CompanyProfileData>) => {
    setCompanyProfile((prev) => ({ ...prev, ...newData }));
  };

  return (
    <CompanyProfileContext.Provider
      value={{ companyProfile, updateCompanyProfile }}
    >
      {children}
    </CompanyProfileContext.Provider>
  );
}

export const useCompanyProfile = () => {
  const context = useContext(CompanyProfileContext);
  if (!context) {
    throw new Error(
      "useCompanyProfile muss innerhalb eines CompanyProfileProviders genutzt werden!",
    );
  }
  return context;
};
