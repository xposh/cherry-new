type AnyRecord = Record<string, unknown>;

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toRecord(value: unknown): AnyRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as AnyRecord)
    : {};
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function splitName(name?: string): { firstName: string; lastName: string } {
  if (!name) return { firstName: "", lastName: "" };
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { firstName: parts[0] ?? "", lastName: "" };
  }
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export function mapTalentProfileToSetup1(profile: unknown) {
  const p = toRecord(profile);
  const portfolio = toArray<AnyRecord>(p.portfolioItems);

  return {
    profileImage: (p.profileImage as string) || "",
    images: portfolio.map((item, index) => ({
      id: (item.id as string) || `seed_portfolio_${index}`,
      preview: (item.preview as string) || "",
      category: (item.category as string) || "Portfolio",
      caption: (item.caption as string) || "",
    })),
  };
}

export function mapTalentProfileToSetup2(profile: unknown) {
  const p = toRecord(profile);
  const first = (p.firstName as string) || "";
  const last = (p.lastName as string) || "";
  const fallback = splitName((p.name as string) || "");

  return {
    formData: {
      firstName: first || fallback.firstName,
      lastName: last || fallback.lastName,
      age: (p.age as string) || "",
      location: (p.location as string) || "",
      position: (p.position as string) || "",
      specialty: (p.specialty as string) || "",
      about: (p.about as string) || "",
    },
    education: toRecord(p.education),
    skills: toArray<string>(p.skills),
    experiences: toArray<AnyRecord>(p.experiences),
    otherExperiences: toArray<AnyRecord>(p.otherExperiences),
    languages: toArray<AnyRecord>(p.languages),
    recognitions: toArray<AnyRecord>(p.recognitions),
    jobPreferences: toRecord(p.jobPreferences),
  };
}

export function mapTalentProfileToSetup3(profile: unknown) {
  const p = toRecord(profile);
  const socialLinks = toArray<AnyRecord>(p.socialLinks).map((link, index) => ({
    id: (link.id as string) || `seed_social_${index}`,
    platform: (link.platform as string) || "Website",
    url: (link.url as string) || "",
  }));

  return {
    cvUrl: (p.cvUrl as string) || "",
    cvFile: (toRecord(p.cvMetadata) as { name?: string; size?: number })?.name
      ? (p.cvMetadata as { name: string; size: number })
      : null,
    availability: ((p.availability as string) ||
      (toRecord(p.jobPreferences).availableFrom as string) ||
      "") as string,
    socialLinks,
  };
}

export function mapCompanyProfileToSetup1(profile: unknown) {
  const p = toRecord(profile);
  const companyImages = toArray<AnyRecord>(p.companyImages);
  const galleryImages = toArray<AnyRecord>(p.galleryImages);

  const images = (companyImages.length > 0 ? companyImages : galleryImages).map(
    (item, index) => ({
      id: (item.id as string) || `seed_gallery_${index}`,
      preview: toStringValue(item.preview) || toStringValue(item.url),
      category: toStringValue(item.category) || "Gallery",
      caption: toStringValue(item.caption),
    }),
  );

  return {
    companyLogoUrl: toStringValue(p.companyLogo),
    uploadedImages: images,
  };
}

export function mapCompanyProfileToSetup2(profile: unknown) {
  const p = toRecord(profile);
  return {
    companyInfo: {
      companyName: toStringValue(p.companyName),
      industry: toStringValue(p.industry),
      customIndustry: toStringValue(p.customIndustry),
      location: toStringValue(p.location),
      foundedYear: toStringValue(p.foundedYear),
      companySize: toStringValue(p.companySize),
      website: toStringValue(p.website),
      claim: toStringValue(p.claim),
      description: toStringValue(p.description),
    },
    selectedValues: toArray<string>(p.cultureValues),
    benefits: toRecord(p.benefits),
    customValue: "",
  };
}

export function mapCompanyProfileToSetup3(profile: unknown) {
  const p = toRecord(profile);
  const nestedContact = toRecord(p.contactPerson);

  const socialLinks = toArray<AnyRecord>(p.socialLinks).map((link, index) => ({
    id: (link.id as string) || `seed_company_social_${index}`,
    platform: (link.platform as string) || "Website",
    url: (link.url as string) || "",
  }));

  return {
    jobInfo: {
      jobTitle: toStringValue(p.jobTitle),
      jobLocation: toStringValue(p.jobLocation),
      jobDescription: toStringValue(p.jobDescription),
      salary: toStringValue(p.salary),
      startDate: toStringValue(p.startDate),
    },
    workModel: toArray<string>(p.workModel),
    requirements: toArray<string>(p.requirements),
    newRequirement: "",
    contactPersonPhoto: {
      preview:
        toStringValue(p.contactPersonPhoto) ||
        toStringValue(nestedContact.photo),
    },
    contactInfo: {
      contactPerson:
        toStringValue(p.contactPerson) || toStringValue(nestedContact.name),
      contactRole:
        toStringValue(p.contactRole) || toStringValue(nestedContact.role),
      contactMessage:
        toStringValue(p.contactMessage) || toStringValue(nestedContact.message),
      contactEmail:
        toStringValue(p.contactEmail) || toStringValue(nestedContact.email),
      contactPhone:
        toStringValue(p.contactPhone) || toStringValue(nestedContact.phone),
      contactWebsite:
        toStringValue(p.contactWebsite) || toStringValue(nestedContact.website),
    },
    socialLinks,
    newSocialPlatform: "Instagram",
    newSocialUrl: "",
  };
}

export function mapCompanyProfileForSummary(profile: unknown) {
  const p = toRecord(profile);
  const setup1 = mapCompanyProfileToSetup1(profile);
  const setup3 = mapCompanyProfileToSetup3(profile);

  return {
    ...p,
    companyImages: setup1.uploadedImages,
    contactPersonPhoto: setup3.contactPersonPhoto.preview,
    contactPerson: setup3.contactInfo.contactPerson,
    contactRole: setup3.contactInfo.contactRole,
    contactMessage: setup3.contactInfo.contactMessage,
    contactEmail: setup3.contactInfo.contactEmail,
    contactPhone: setup3.contactInfo.contactPhone,
    contactWebsite: setup3.contactInfo.contactWebsite,
  };
}
