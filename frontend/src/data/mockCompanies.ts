export interface CompanyProfile {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  companySize: string;
  companyLogo: string;
  galleryImages: Array<{ url: string; caption: string }>;
  claim: string;
  description: string;
  cultureValues: string[];
  benefits: {
    arbeitsmodell: string[];
    finanziell: string[];
    lifestyle: string[];
    mobilitat: string[];
    entwicklung: string[];
  };
  jobTitle: string;
  jobLocation: string;
  startDate: string;
  workModel: string[];
  contactPerson: {
    name: string;
    role: string;
    photo: string;
    message: string;
    email: string;
    phone?: string;
    website?: string;
  };
}

export const mockCompanies: CompanyProfile[] = [
  {
    id: "company-1",
    companyName: "TechVision GmbH",
    industry: "Software Development",
    location: "Berlin, Deutschland",
    companySize: "50-100 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
        caption: "Unser modernes Office",
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
        caption: "Team Collaboration",
      },
      {
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
        caption: "Friday Team Lunch",
      },
    ],
    claim: "Building the future of work",
    description:
      "Wir entwickeln innovative SaaS-Lösungen für moderne Unternehmen.",
    cultureValues: [
      "Innovation",
      "Work-Life-Balance",
      "Teamwork",
      "Nachhaltigkeit",
      "Diversität",
    ],
    benefits: {
      arbeitsmodell: ["Flexible Arbeitszeiten", "Remote Work", "4-Tage-Woche"],
      finanziell: [
        "Competitive Salary",
        "Bonus",
        "Betriebliche Altersvorsorge",
      ],
      lifestyle: [
        "Fitness-Mitgliedschaft",
        "Mental Health Support",
        "Team Events",
      ],
      mobilitat: ["JobTicket", "Bike Leasing"],
      entwicklung: ["Weiterbildungsbudget", "Konferenz-Teilnahme", "Mentoring"],
    },
    jobTitle: "Senior React Developer",
    jobLocation: "Berlin / Remote",
    startDate: "01.06.2026",
    workModel: ["Remote", "Hybrid"],
    contactPerson: {
      name: "Laura Meyer",
      role: "Head of Engineering",
      photo:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      message:
        "Wir suchen kreative Köpfe, die mit uns die Zukunft gestalten möchten!",
      email: "laura.meyer@techvision.de",
      phone: "+49 30 12345678",
      website: "www.techvision.de",
    },
  },
  {
    id: "company-2",
    companyName: "GreenEnergy Solutions",
    industry: "Renewable Energy",
    location: "Hamburg, Deutschland",
    companySize: "100-200 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
        caption: "Unsere Zentrale in Hamburg",
      },
      {
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400",
        caption: "Nachhaltigkeit im Fokus",
      },
    ],
    claim: "Energie für eine bessere Zukunft",
    description:
      "Pioniere der Energiewende mit Fokus auf Solarenergie und Windkraft.",
    cultureValues: [
      "Nachhaltigkeit",
      "Innovation",
      "Verantwortung",
      "Transparenz",
    ],
    benefits: {
      arbeitsmodell: ["Flexible Arbeitszeiten", "Hybrid Work"],
      finanziell: ["Übertarifliche Bezahlung", "Erfolgsbeteiligung"],
      lifestyle: ["Betriebsrestaurant", "Fitnessstudio vor Ort"],
      mobilitat: ["E-Auto Ladestation", "Bike Leasing"],
      entwicklung: ["Academy Programme", "Weiterbildung"],
    },
    jobTitle: "Sustainability Manager",
    jobLocation: "Hamburg",
    startDate: "15.05.2026",
    workModel: ["Office", "Hybrid"],
    contactPerson: {
      name: "Dr. Thomas Klein",
      role: "Head of HR",
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      message:
        "Gemeinsam gestalten wir die Energiewende. Sei Teil unserer Mission!",
      email: "thomas.klein@greenenergy.de",
      phone: "+49 40 98765432",
      website: "www.greenenergy.de",
    },
  },
  {
    id: "company-3",
    companyName: "CreativeMinds Agency",
    industry: "Marketing & Design",
    location: "München, Deutschland",
    companySize: "20-50 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400",
        caption: "Creative Workspace",
      },
      {
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400",
        caption: "Brainstorming Sessions",
      },
    ],
    claim: "Kreativität trifft Strategie",
    description:
      "Full-Service Agentur für kreative Markenentwicklung und digitales Marketing.",
    cultureValues: [
      "Kreativität",
      "Teamwork",
      "Kundenorientierung",
      "Innovation",
    ],
    benefits: {
      arbeitsmodell: ["Flexible Arbeitszeiten", "Remote Work"],
      finanziell: ["Competitive Salary", "Projektbonus"],
      lifestyle: ["Team Events", "Free Drinks & Snacks"],
      mobilitat: ["Zentrale Lage", "JobTicket"],
      entwicklung: ["Kreativ-Workshops", "Skill-Share-Sessions"],
    },
    jobTitle: "Senior Art Director",
    jobLocation: "München",
    startDate: "01.07.2026",
    workModel: ["Office", "Hybrid"],
    contactPerson: {
      name: "Sophie Wagner",
      role: "Creative Director",
      photo:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
      message: "Lass uns zusammen unvergessliche Marken schaffen!",
      email: "sophie.wagner@creativeminds.de",
      website: "www.creativeminds.de",
    },
  },
  {
    id: "company-4",
    companyName: "HealthTech Innovations",
    industry: "Healthcare Technology",
    location: "Frankfurt, Deutschland",
    companySize: "200-500 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
        caption: "Innovation Hub Frankfurt",
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
        caption: "Product Development Team",
      },
    ],
    claim: "Gesundheit digital neu denken",
    description:
      "Entwickler von KI-gestützten Gesundheitslösungen für Kliniken und Praxen.",
    cultureValues: [
      "Innovation",
      "Verantwortung",
      "Exzellenz",
      "Zusammenarbeit",
    ],
    benefits: {
      arbeitsmodell: ["Flexible Arbeitszeiten", "Hybrid Work", "Sabbatical"],
      finanziell: ["Top Gehalt", "Aktienoptionen", "Altersvorsorge"],
      lifestyle: ["Gesundheitsvorsorge", "Mental Health", "Kantine"],
      mobilitat: ["JobTicket", "Parkplatz", "E-Bike Leasing"],
      entwicklung: ["Trainings", "Konferenzen", "Zertifizierungen"],
    },
    jobTitle: "Product Manager Healthcare",
    jobLocation: "Frankfurt / Hybrid",
    startDate: "15.06.2026",
    workModel: ["Hybrid", "Office"],
    contactPerson: {
      name: "Dr. Anna Müller",
      role: "VP Product",
      photo:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      message: "Gemeinsam verbessern wir die Gesundheitsversorgung von morgen.",
      email: "anna.mueller@healthtech.de",
      phone: "+49 69 87654321",
      website: "www.healthtech-innovations.de",
    },
  },
  {
    id: "company-5",
    companyName: "DataFlow Analytics",
    industry: "Data Science & AI",
    location: "Berlin, Deutschland",
    companySize: "50-100 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
        caption: "Open Office Space",
      },
      {
        url: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400",
        caption: "Tech Stack",
      },
    ],
    claim: "Data-driven decisions made simple",
    description:
      "Analytics Platform für Enterprise-Unternehmen mit KI-Integration.",
    cultureValues: [
      "Data Excellence",
      "Innovation",
      "Learning Culture",
      "Diversity",
    ],
    benefits: {
      arbeitsmodell: [
        "100% Remote möglich",
        "Flexible Hours",
        "Trust-based Work",
      ],
      finanziell: ["Equity Package", "Performance Bonus", "Pension Plan"],
      lifestyle: ["Unlimited Vacation", "Home Office Budget", "Team Retreats"],
      mobilitat: ["Deutschland-Ticket", "Relocation Support"],
      entwicklung: [
        "Learning Budget €2000/Jahr",
        "Conference Tickets",
        "1-on-1 Coaching",
      ],
    },
    jobTitle: "Data Engineer",
    jobLocation: "Remote / Berlin",
    startDate: "Sofort",
    workModel: ["Remote", "Hybrid"],
    contactPerson: {
      name: "Max Bauer",
      role: "CTO",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      message: "Wir bauen die Analytics-Plattform der Zukunft. Join us!",
      email: "max.bauer@dataflow.de",
      website: "www.dataflow-analytics.com",
    },
  },
  {
    id: "company-6",
    companyName: "EcoFashion Brands",
    industry: "Fashion & Retail",
    location: "Köln, Deutschland",
    companySize: "100-200 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
        caption: "Sustainable Fashion Store",
      },
      {
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
        caption: "Team Spirit",
      },
    ],
    claim: "Mode mit gutem Gewissen",
    description:
      "Nachhaltige Mode-Brand mit E-Commerce Focus und 20+ Stores in Europa.",
    cultureValues: ["Nachhaltigkeit", "Kreativität", "Transparenz", "Fairness"],
    benefits: {
      arbeitsmodell: ["Flexible Hours", "Hybrid Model"],
      finanziell: ["Employee Discount 40%", "Performance Bonus"],
      lifestyle: ["Fashion Allowance", "Yoga Classes", "Team Events"],
      mobilitat: ["JobTicket", "Bike Leasing"],
      entwicklung: ["Fashion Conferences", "Workshops", "Leadership Training"],
    },
    jobTitle: "E-Commerce Manager",
    jobLocation: "Köln / Hybrid",
    startDate: "01.06.2026",
    workModel: ["Hybrid", "Office"],
    contactPerson: {
      name: "Lisa Schröder",
      role: "Head of Digital",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      message: "Werde Teil unserer nachhaltigen Fashion-Revolution!",
      email: "lisa.schroeder@ecofashion.de",
      phone: "+49 221 56781234",
      website: "www.ecofashion-brands.de",
    },
  },
  {
    id: "company-7",
    companyName: "FinTech Pro",
    industry: "Financial Technology",
    location: "Stuttgart, Deutschland",
    companySize: "50-100 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
        caption: "Modern FinTech Office",
      },
    ],
    claim: "Banking für die digitale Generation",
    description: "Mobile Banking App mit über 500.000 Nutzern in DACH.",
    cultureValues: ["Trust", "Innovation", "Customer First", "Agility"],
    benefits: {
      arbeitsmodell: ["Remote-First", "Flexible Hours", "Workation"],
      finanziell: ["Stock Options", "High Salary", "Bonus"],
      lifestyle: ["Premium Health Insurance", "Gym Membership", "Free Lunch"],
      mobilitat: ["Car Allowance", "Deutschland-Ticket"],
      entwicklung: ["Certification Budget", "Internal Hackathons", "Mentoring"],
    },
    jobTitle: "Backend Engineer (Go/Python)",
    jobLocation: "Stuttgart / Remote",
    startDate: "15.05.2026",
    workModel: ["Remote", "Hybrid"],
    contactPerson: {
      name: "Tobias Lange",
      role: "Engineering Manager",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      message: "Let's revolutionize banking together!",
      email: "tobias.lange@fintechpro.de",
      website: "www.fintechpro.de",
    },
  },
  {
    id: "company-8",
    companyName: "EduTech Solutions",
    industry: "Education Technology",
    location: "Leipzig, Deutschland",
    companySize: "20-50 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
        caption: "Collaborative Learning Space",
      },
      {
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
        caption: "Product Team",
      },
    ],
    claim: "Lernen neu erfinden",
    description: "E-Learning Platform für Schulen und Universitäten.",
    cultureValues: ["Education", "Innovation", "Impact", "Teamwork"],
    benefits: {
      arbeitsmodell: ["Flexible Hours", "Remote Options", "Semester Break"],
      finanziell: ["Fair Salary", "Learning Budget", "Pension"],
      lifestyle: ["Team Offsites", "Book Allowance", "Coffee & Snacks"],
      mobilitat: ["JobTicket", "Central Location"],
      entwicklung: [
        "Free Courses",
        "Conference Budget",
        "Teaching Opportunities",
      ],
    },
    jobTitle: "Frontend Developer (React)",
    jobLocation: "Leipzig / Hybrid",
    startDate: "01.08.2026",
    workModel: ["Hybrid", "Office"],
    contactPerson: {
      name: "Julia Hoffmann",
      role: "Product Lead",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      message: "Gestalte mit uns die Zukunft der Bildung!",
      email: "julia.hoffmann@edutech.de",
      website: "www.edutech-solutions.de",
    },
  },
  {
    id: "company-9",
    companyName: "LogiChain Partners",
    industry: "Logistics & Supply Chain",
    location: "Düsseldorf, Deutschland",
    companySize: "200-500 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400",
        caption: "Logistics Innovation Center",
      },
      {
        url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
        caption: "Data Operations",
      },
    ],
    claim: "Smart Logistics für Europa",
    description: "Digitale Supply-Chain-Lösungen für E-Commerce und Retail.",
    cultureValues: ["Efficiency", "Innovation", "Reliability", "Partnership"],
    benefits: {
      arbeitsmodell: ["Flexible Work", "Hybrid Model"],
      finanziell: ["Competitive Pay", "Annual Bonus", "Company Shares"],
      lifestyle: ["Health Programs", "Sports Teams", "Employee Events"],
      mobilitat: ["Company Car", "Bike Leasing", "Parking"],
      entwicklung: [
        "Leadership Programs",
        "Technical Training",
        "Career Planning",
      ],
    },
    jobTitle: "Supply Chain Analyst",
    jobLocation: "Düsseldorf",
    startDate: "01.07.2026",
    workModel: ["Office", "Hybrid"],
    contactPerson: {
      name: "Robert Koch",
      role: "Head of Operations",
      photo:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      message: "Join our mission to optimize global supply chains!",
      email: "robert.koch@logichain.de",
      phone: "+49 211 34567890",
      website: "www.logichain-partners.de",
    },
  },
  {
    id: "company-10",
    companyName: "MediaMakers Studio",
    industry: "Media Production",
    location: "Nürnberg, Deutschland",
    companySize: "20-50 Mitarbeiter",
    companyLogo:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400",
        caption: "Production Studio",
      },
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
        caption: "Creative Team in Action",
      },
    ],
    claim: "Stories that matter",
    description: "Kreativ-Studio für Video Content, Podcasts und Social Media.",
    cultureValues: ["Creativity", "Storytelling", "Collaboration", "Quality"],
    benefits: {
      arbeitsmodell: ["Flexible Hours", "Project-based Work"],
      finanziell: ["Freelance Rate", "Equipment Budget"],
      lifestyle: ["Creative Freedom", "Team Events", "Studio Access"],
      mobilitat: ["Central Studio", "Parking"],
      entwicklung: ["Film Festivals", "Workshops", "Equipment Training"],
    },
    jobTitle: "Video Producer & Editor",
    jobLocation: "Nürnberg",
    startDate: "Sofort",
    workModel: ["Office"],
    contactPerson: {
      name: "Nina Becker",
      role: "Creative Director",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      message: "Lass uns gemeinsam unvergessliche Geschichten erzählen!",
      email: "nina.becker@mediamakers.de",
      phone: "+49 911 23456789",
      website: "www.mediamakers-studio.de",
    },
  },
];
