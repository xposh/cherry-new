export interface TalentProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  profileImage: string;
  galleryImages: Array<{ url: string; caption: string }>;
  bio: string;
  skills: string[];
  languages: string[];
  experience: string;
  education: string;
  availability: string;
  workPreference: string[];
  hourlyRate?: string;
  portfolioLink?: string;
}

export const mockTalents: TalentProfile[] = [
  {
    id: "talent-1",
    name: "Anna Schmidt",
    age: 28,
    location: "Berlin, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
        caption: "Team Workshop",
      },
      {
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
        caption: "Mein Arbeitsplatz",
      },
    ],
    bio: "Passionierte UX/UI Designerin mit 5+ Jahren Erfahrung in digitalen Produkten.",
    skills: ["UX Design", "UI Design", "Figma", "Adobe XD", "Prototyping"],
    languages: ["Deutsch (Muttersprache)", "Englisch (Fließend)"],
    experience: "5 Jahre",
    education: "B.A. Kommunikationsdesign, UdK Berlin",
    availability: "Sofort verfügbar",
    workPreference: ["Remote", "Hybrid"],
    hourlyRate: "€75/Std",
    portfolioLink: "www.annadesigns.de",
  },
  {
    id: "talent-2",
    name: "Markus Weber",
    age: 32,
    location: "München, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
        caption: "Code Review Session",
      },
      {
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
        caption: "Daily Workspace",
      },
    ],
    bio: "Full-Stack Developer mit Fokus auf React und Node.js. Liebe es, skalierbare Anwendungen zu bauen.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    languages: ["Deutsch (Muttersprache)", "Englisch (Fließend)"],
    experience: "7 Jahre",
    education: "M.Sc. Informatik, TU München",
    availability: "Ab 01.06.2026",
    workPreference: ["Remote", "Office"],
    hourlyRate: "€90/Std",
  },
  {
    id: "talent-3",
    name: "Sarah König",
    age: 26,
    location: "Hamburg, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400",
        caption: "Marketing Team Meeting",
      },
    ],
    bio: "Digital Marketing Spezialistin mit Schwerpunkt auf Social Media und Content Strategy.",
    skills: [
      "Social Media Marketing",
      "Content Creation",
      "SEO",
      "Google Ads",
      "Analytics",
    ],
    languages: [
      "Deutsch (Muttersprache)",
      "Englisch (Fließend)",
      "Französisch (Grundkenntnisse)",
    ],
    experience: "4 Jahre",
    education: "B.A. Marketing & Kommunikation",
    availability: "Sofort verfügbar",
    workPreference: ["Hybrid"],
    hourlyRate: "€65/Std",
  },
  {
    id: "talent-4",
    name: "Tom Fischer",
    age: 35,
    location: "Frankfurt, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
        caption: "Product Strategy Session",
      },
      {
        url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400",
        caption: "Team Collaboration",
      },
    ],
    bio: "Product Manager mit Tech-Background. Bringe Produkte von der Idee bis zum Launch.",
    skills: [
      "Product Management",
      "Agile",
      "Scrum",
      "User Research",
      "Roadmapping",
    ],
    languages: ["Deutsch (Muttersprache)", "Englisch (Fließend)"],
    experience: "8 Jahre",
    education: "M.Sc. Wirtschaftsinformatik",
    availability: "Ab 15.05.2026",
    workPreference: ["Hybrid", "Office"],
    hourlyRate: "€95/Std",
  },
  {
    id: "talent-5",
    name: "Lisa Hoffmann",
    age: 29,
    location: "Köln, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=400",
        caption: "Design Sprint",
      },
    ],
    bio: "Kreative Grafikdesignerin mit Liebe zum Detail und starkem Fokus auf Brand Identity.",
    skills: [
      "Grafikdesign",
      "Branding",
      "Illustrator",
      "Photoshop",
      "InDesign",
    ],
    languages: ["Deutsch (Muttersprache)", "Englisch (Fließend)"],
    experience: "6 Jahre",
    education: "B.A. Grafikdesign, FH Köln",
    availability: "Sofort verfügbar",
    workPreference: ["Remote", "Hybrid"],
    hourlyRate: "€70/Std",
    portfolioLink: "www.lisahoffmann.design",
  },
  {
    id: "talent-6",
    name: "David Müller",
    age: 31,
    location: "Stuttgart, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
        caption: "Backend Development",
      },
    ],
    bio: "Backend Engineer spezialisiert auf Cloud-Infrastruktur und DevOps.",
    skills: ["Python", "Docker", "Kubernetes", "AWS", "CI/CD"],
    languages: ["Deutsch (Muttersprache)", "Englisch (Fließend)"],
    experience: "6 Jahre",
    education: "M.Sc. Software Engineering",
    availability: "Ab 01.07.2026",
    workPreference: ["Remote"],
    hourlyRate: "€85/Std",
  },
  {
    id: "talent-7",
    name: "Julia Becker",
    age: 27,
    location: "Leipzig, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
        caption: "HR Workshop",
      },
      {
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        caption: "Team Building Event",
      },
    ],
    bio: "People & Culture Managerin mit Fokus auf Employee Experience und Talent Development.",
    skills: [
      "Recruiting",
      "Employer Branding",
      "People Development",
      "Culture Building",
    ],
    languages: [
      "Deutsch (Muttersprache)",
      "Englisch (Fließend)",
      "Spanisch (Gut)",
    ],
    experience: "5 Jahre",
    education: "M.A. Personalmanagement",
    availability: "Sofort verfügbar",
    workPreference: ["Hybrid", "Office"],
    hourlyRate: "€70/Std",
  },
  {
    id: "talent-8",
    name: "Michael Wagner",
    age: 30,
    location: "Düsseldorf, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        caption: "Sales Presentation",
      },
    ],
    bio: "Sales Manager mit starkem Netzwerk im B2B SaaS Bereich.",
    skills: [
      "B2B Sales",
      "Account Management",
      "Negotiation",
      "CRM",
      "Lead Generation",
    ],
    languages: ["Deutsch (Muttersprache)", "Englisch (Fließend)"],
    experience: "7 Jahre",
    education: "B.Sc. BWL",
    availability: "Ab 01.06.2026",
    workPreference: ["Hybrid"],
    hourlyRate: "€80/Std",
  },
  {
    id: "talent-9",
    name: "Emma Schneider",
    age: 25,
    location: "Nürnberg, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
        caption: "Content Creation",
      },
    ],
    bio: "Junior Content Creatorin mit Passion für Video und Storytelling.",
    skills: [
      "Video Editing",
      "Content Creation",
      "Premiere Pro",
      "After Effects",
      "Social Media",
    ],
    languages: ["Deutsch (Muttersprache)", "Englisch (Gut)"],
    experience: "2 Jahre",
    education: "B.A. Medienproduktion",
    availability: "Sofort verfügbar",
    workPreference: ["Remote", "Hybrid"],
    hourlyRate: "€50/Std",
  },
  {
    id: "talent-10",
    name: "Felix Richter",
    age: 33,
    location: "Dresden, Deutschland",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
        caption: "Data Analysis",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
        caption: "Dashboard Design",
      },
    ],
    bio: "Data Scientist mit Expertise in Machine Learning und Predictive Analytics.",
    skills: [
      "Python",
      "Machine Learning",
      "TensorFlow",
      "Data Visualization",
      "SQL",
    ],
    languages: ["Deutsch (Muttersprache)", "Englisch (Fließend)"],
    experience: "6 Jahre",
    education: "Ph.D. Data Science",
    availability: "Ab 15.06.2026",
    workPreference: ["Remote"],
    hourlyRate: "€100/Std",
  },
];
