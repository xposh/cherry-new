"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("./util/db"));
async function run() {
    console.log("🌱 Cherry Seed gestartet...\n");
    // Alte Seed-Daten sauber entfernen
    console.log("🧹 Cleanup alter Seed-Daten...");
    await (0, db_1.default) `DELETE FROM user_interactions WHERE from_user_id IN (SELECT id FROM users WHERE email LIKE '%seed.cherry')`;
    await (0, db_1.default) `DELETE FROM talent_profiles   WHERE user_id       IN (SELECT id FROM users WHERE email LIKE '%seed.cherry')`;
    await (0, db_1.default) `DELETE FROM company_profiles  WHERE user_id       IN (SELECT id FROM users WHERE email LIKE '%seed.cherry')`;
    await (0, db_1.default) `DELETE FROM users             WHERE email LIKE '%seed.cherry'`;
    const hash = await bcrypt_1.default.hash("Cherry2025!", 12);
    // ── TALENTS ──────────────────────────────────────────────────────────────
    const talents = [
        {
            email: "marcus@seed.cherry",
            data: {
                name: "Marcus Klein",
                age: "28",
                location: "Hamburg",
                position: "Photographer",
                specialty: "Editorial & Portrait",
                about: "Photographer mit 6 Jahren Erfahrung im Editorial- und Portraitbereich. Klare, cineastische Ästhetik für Mode und Lifestyle.",
                profileImage: "/Photographer/IMG_4417.JPG",
                portfolioItems: [
                    {
                        id: "p1",
                        preview: "/Photographer/IMG_4417.JPG",
                        category: "Portrait",
                        caption: "Editorial Series 2024",
                        projectLink: "",
                    },
                ],
                education: {
                    degree: "Bachelor of Arts",
                    institution: "HAW Hamburg",
                    customDegree: "",
                },
                skills: [
                    "Lightroom",
                    "Capture One",
                    "Studio Lighting",
                    "Retouching",
                    "Video",
                ],
                experiences: [
                    {
                        id: "e1",
                        title: "Senior Photographer",
                        company: "Freelance",
                        period: "2020 – Heute",
                        years: "4",
                        level: "Senior",
                        description: "Editorial und Commercial Photography für Modemarken.",
                    },
                ],
                otherExperiences: [],
                languages: [
                    { language: "Deutsch", level: "Muttersprache" },
                    { language: "Englisch", level: "Fließend" },
                ],
                recognitions: [
                    {
                        id: "r1",
                        award: "Hamburg Creative Award 2023 – Shortlist",
                        year: "2023",
                    },
                ],
                jobPreferences: {
                    workModel: ["Office", "Hybrid"],
                    availableFrom: "Sofort",
                    employmentType: ["Freelance", "Part-time"],
                    otherPositions: [],
                },
                cvFile: null,
                socialLinks: [
                    {
                        id: "s1",
                        platform: "Instagram",
                        url: "instagram.com/marcuskleinphoto",
                    },
                ],
            },
        },
        {
            email: "elena@seed.cherry",
            data: {
                name: "Elena Rossi",
                age: "31",
                location: "Hamburg",
                position: "Hair Stylist",
                specialty: "Color & Cut",
                about: "Leidenschaftliche Stylistin mit über 8 Jahren Erfahrung in Premium-Salons. Spezialisiert auf Balayage und Bridal Styling.",
                profileImage: "/hairdresser/IMG_4421.JPG",
                portfolioItems: [
                    {
                        id: "p1",
                        preview: "/hairdresser/IMG_4422.JPG",
                        category: "Color",
                        caption: "Balayage Collection 2024",
                        projectLink: "",
                    },
                    {
                        id: "p2",
                        preview: "/hairdresser/IMG_4424.JPG",
                        category: "Bridal",
                        caption: "Bridal Lookbook",
                        projectLink: "",
                    },
                ],
                education: {
                    degree: "Gesellenbrief Friseur",
                    institution: "HWK Hamburg",
                    customDegree: "",
                },
                skills: [
                    "Balayage",
                    "Keratin Treatment",
                    "Bridal Styling",
                    "Color Correction",
                    "Extensions",
                ],
                experiences: [
                    {
                        id: "e1",
                        title: "Senior Hair Stylist",
                        company: "Salon Maison Hamburg",
                        period: "2019 – Heute",
                        years: "5",
                        level: "Senior",
                        description: "Kundenberatung, Colorierung und Schnitt im Premium-Segment.",
                    },
                ],
                otherExperiences: [],
                languages: [
                    { language: "Deutsch", level: "Muttersprache" },
                    { language: "Italienisch", level: "Muttersprache" },
                ],
                recognitions: [],
                jobPreferences: {
                    workModel: ["Office"],
                    availableFrom: "Ab Oktober 2025",
                    employmentType: ["Full-time"],
                    otherPositions: [],
                },
                cvFile: null,
                socialLinks: [],
            },
        },
        {
            email: "tom@seed.cherry",
            data: {
                name: "Tom Weber",
                age: "26",
                location: "Köln",
                position: "Barista",
                specialty: "Specialty Coffee",
                about: "Gewinner des NRW Latte Art Championships 2023. Ich bringe Precision und Kreativität an jede Siebträgermaschine.",
                profileImage: "/barista/brent-gorwin-vhQUnmnOLys-unsplash.jpg",
                portfolioItems: [
                    {
                        id: "p1",
                        preview: "/barista/brent-gorwin-vhQUnmnOLys-unsplash.jpg",
                        category: "Craft",
                        caption: "Latte Art Competition",
                        projectLink: "",
                    },
                ],
                education: {
                    degree: "IHK Ausbildung Fachmann Systemgastronomie",
                    institution: "IHK Köln",
                    customDegree: "",
                },
                skills: [
                    "Espresso Extraction",
                    "Latte Art",
                    "Brew Methods",
                    "Coffee Roasting",
                    "Barista Training",
                ],
                experiences: [
                    {
                        id: "e1",
                        title: "Lead Barista",
                        company: "Ritual Coffee Roasters",
                        period: "2021 – Heute",
                        years: "3",
                        level: "Mid",
                        description: "Bar-Konzept, Training neuer Mitarbeiter und Quality Control.",
                    },
                ],
                otherExperiences: [],
                languages: [
                    { language: "Deutsch", level: "Muttersprache" },
                    { language: "Englisch", level: "Fließend" },
                ],
                recognitions: [
                    {
                        id: "r1",
                        award: "NRW Latte Art Championship – 1. Platz",
                        year: "2023",
                    },
                ],
                jobPreferences: {
                    workModel: ["Office", "Hybrid"],
                    availableFrom: "Sofort",
                    employmentType: ["Full-time", "Part-time"],
                    otherPositions: [],
                },
                cvFile: null,
                socialLinks: [
                    {
                        id: "s1",
                        platform: "Instagram",
                        url: "instagram.com/tomweberkaffee",
                    },
                ],
            },
        },
        {
            email: "danni@seed.cherry",
            data: {
                name: "Danni Chang",
                age: "34",
                location: "Berlin",
                position: "Head Chef",
                specialty: "Modern European Cuisine",
                about: "Head Chef mit 10 Jahren Erfahrung in der gehobenen Gastronomie. Meine Küche verbindet asiatische Techniken mit europäischen Klassikern.",
                profileImage: "/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg",
                portfolioItems: [
                    {
                        id: "p1",
                        preview: "/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg",
                        category: "Fine Dining",
                        caption: "Signature Menu 2024",
                        projectLink: "",
                    },
                ],
                education: {
                    degree: "Culinary Arts Diploma",
                    institution: "Le Cordon Bleu Paris",
                    customDegree: "",
                },
                skills: [
                    "Menu Development",
                    "French Techniques",
                    "Asian Fusion",
                    "Team Leadership",
                    "Cost Control",
                ],
                experiences: [
                    {
                        id: "e1",
                        title: "Head Chef",
                        company: "Restaurant Saison Berlin",
                        period: "2020 – Heute",
                        years: "4",
                        level: "Expert",
                        description: "Signature-Menü, Küchenleitung für ein 2-Sterne-Restaurant.",
                    },
                    {
                        id: "e2",
                        title: "Sous Chef",
                        company: "Noma Copenhagen",
                        period: "2016 – 2020",
                        years: "4",
                        level: "Senior",
                        description: "",
                    },
                ],
                otherExperiences: [],
                languages: [
                    { language: "Englisch", level: "Muttersprache" },
                    { language: "Deutsch", level: "Fließend" },
                ],
                recognitions: [
                    {
                        id: "r1",
                        award: "Berlin Restaurant Awards – Best New Chef",
                        year: "2022",
                    },
                ],
                jobPreferences: {
                    workModel: ["Office"],
                    availableFrom: "Q1 2026",
                    employmentType: ["Full-time"],
                    otherPositions: ["Executive Chef"],
                },
                cvFile: null,
                socialLinks: [{ id: "s1", platform: "Website", url: "dannichang.com" }],
            },
        },
        {
            email: "zara@seed.cherry",
            data: {
                name: "Zara Makovic",
                age: "29",
                location: "Hamburg",
                position: "Pilates Instructor",
                specialty: "Reformer & Aerial Pilates",
                about: "Zertifizierte Pilates-Trainerin mit Passion für Körperbewusstsein. Ich kombiniere Reformer mit Aerial-Techniken für maximale Wirkung.",
                profileImage: "/pilates/Pilates Black 1.png",
                portfolioItems: [
                    {
                        id: "p1",
                        preview: "/pilates/Pilates Black 1.png",
                        category: "Reformer",
                        caption: "Advanced Class",
                        projectLink: "",
                    },
                ],
                education: {
                    degree: "STOTT Pilates Full Certification",
                    institution: "STOTT International",
                    customDegree: "",
                },
                skills: [
                    "Reformer Pilates",
                    "Aerial Pilates",
                    "Mat Work",
                    "Injury Rehab",
                    "Pre/Post Natal",
                ],
                experiences: [
                    {
                        id: "e1",
                        title: "Lead Instructor",
                        company: "Studio Flow Hamburg",
                        period: "2020 – Heute",
                        years: "4",
                        level: "Senior",
                        description: "Gruppen und 1:1, Entwicklung neuer Kursformate.",
                    },
                ],
                otherExperiences: [],
                languages: [
                    { language: "Deutsch", level: "Muttersprache" },
                    { language: "Serbisch", level: "Muttersprache" },
                    { language: "Englisch", level: "Fließend" },
                ],
                recognitions: [],
                jobPreferences: {
                    workModel: ["Office", "Hybrid", "Remote"],
                    availableFrom: "Sofort",
                    employmentType: ["Freelance", "Part-time"],
                    otherPositions: [],
                },
                cvFile: null,
                socialLinks: [],
            },
        },
    ];
    console.log("👤 Inserting Talents...");
    for (const t of talents) {
        const [user] = await (0, db_1.default) `
      INSERT INTO users (email, hashed_password, role)
      VALUES (${t.email}, ${hash}, 'talent') RETURNING id
    `;
        await (0, db_1.default) `
  INSERT INTO talent_profiles (user_id, profile_data)
  VALUES (${user.id}, ${db_1.default.json(t.data)})
`;
        console.log(`  ✓ ${t.data.name}`);
    }
    // ── COMPANIES ────────────────────────────────────────────────────────────
    const companies = [
        {
            email: "studio@seed.cherry",
            data: {
                companyName: "Studio Perspective GmbH",
                claim: "Wir gestalten Räume die bleiben.",
                description: "Preisgekröntes Architektur- und Designstudio aus Hamburg. Unser 15-köpfiges Team verbindet Funktionalität mit zeitloser Ästhetik.",
                industry: "Architecture & Design",
                companySize: "10–25 Mitarbeiter",
                location: "Hamburg",
                companyLogo: "/Recruter-Hr/IMG_4415.JPG",
                galleryImages: [
                    { url: "/architect/man-in-black.png", caption: "Our creative team" },
                    {
                        url: "/architect/architect-drawing.png",
                        caption: "Concept Work 2024",
                    },
                    {
                        url: "/architect/architect-painting.png",
                        caption: "Visualization Studio",
                    },
                ],
                cultureValues: [
                    "Kreativität",
                    "Nachhaltigkeit",
                    "Präzision",
                    "Teamwork",
                ],
                benefits: {
                    arbeitsmodell: ["Hybrid Work", "Flexible Stunden"],
                    finanziell: [
                        "Marktgerechtes Gehalt",
                        "Projektbonus",
                        "Betriebliche Altersvorsorge",
                    ],
                    lifestyle: ["Hunde willkommen", "Kreativ-Budget"],
                    mobilitat: ["Jobrad", "HVV Ticket"],
                    entwicklung: ["Mentorship Program", "Konferenzbesuche"],
                },
                jobTitle: "Creative Architect (m/w/d)",
                jobLocation: "Hamburg",
                workModel: ["Hybrid", "Office"],
                startDate: "Ab sofort",
                contactPerson: {
                    name: "Max Becker",
                    role: "Creative Director",
                    email: "max@studio-perspective.de",
                    phone: "+49 40 123456",
                    website: "studio-perspective.de",
                    message: "Wir suchen eine kreative Persönlichkeit die mit uns neue Maßstäbe setzt.",
                    photo: "/Recruter-Hr/IMG_4415.JPG",
                },
            },
        },
        {
            email: "barclub@seed.cherry",
            data: {
                companyName: "The Bar Collective",
                claim: "Crafted with intention, served with soul.",
                description: "Drei der bekanntesten Cocktailbars in Berlin. Wir stehen für Handwerk, Gastfreundschaft und Barkultur auf höchstem Niveau.",
                industry: "Hospitality & Nightlife",
                companySize: "25–50 Mitarbeiter",
                location: "Berlin",
                companyLogo: "/barkeeper-sommelier/IMG_4431.JPG",
                galleryImages: [
                    { url: "/barkeeper-sommelier/IMG_4431.JPG", caption: "Bar im Mitte" },
                    {
                        url: "/barkeeper-sommelier/IMG_4435.JPG",
                        caption: "Craft Cocktail Service",
                    },
                ],
                cultureValues: [
                    "Handwerk",
                    "Gastfreundschaft",
                    "Innovation",
                    "Leidenschaft",
                ],
                benefits: {
                    arbeitsmodell: ["Abendschichten", "Wochenenden möglich"],
                    finanziell: ["Trinkgeld-Sharing", "Stundenlohn über Tarif"],
                    lifestyle: ["Team Events", "Probierabende"],
                    mobilitat: ["BVG Ticket"],
                    entwicklung: ["Bar-Schulungen", "Internationale Gastschichten"],
                },
                jobTitle: "Head Bartender (m/w/d)",
                jobLocation: "Berlin Mitte",
                workModel: ["Office"],
                startDate: "01.09.2025",
                contactPerson: {
                    name: "Sarah Klein",
                    role: "Operations Manager",
                    email: "jobs@barcollective.de",
                    phone: "+49 30 987654",
                    website: "barcollective.de",
                    message: "Passion for cocktails? Wir auch. Komm ins Team.",
                    photo: "/Recruter-Hr/IMG_4415.JPG",
                },
            },
        },
        {
            email: "ritual@seed.cherry",
            data: {
                companyName: "Ritual Coffee Roasters",
                claim: "From bean to cup — with purpose.",
                description: "Kölns führende Specialty-Coffee-Rösterei mit eigenem Café-Konzept. Wir roasten single-origin Bohnen und begeistern täglich hunderte Gäste.",
                industry: "Food & Beverage",
                companySize: "10–25 Mitarbeiter",
                location: "Köln",
                companyLogo: "/barista/brent-gorwin-vhQUnmnOLys-unsplash.jpg",
                galleryImages: [
                    {
                        url: "/barista/brent-gorwin-vhQUnmnOLys-unsplash.jpg",
                        caption: "Our bar setup",
                    },
                ],
                cultureValues: [
                    "Qualität",
                    "Nachhaltigkeit",
                    "Transparenz",
                    "Community",
                ],
                benefits: {
                    arbeitsmodell: ["Flexible Schichten", "Teilzeit möglich"],
                    finanziell: ["Fairer Lohn", "Jahresbonus"],
                    lifestyle: ["Unlimited Coffee", "Mitarbeiterrabatt 40%"],
                    mobilitat: ["KVB Ticket"],
                    entwicklung: ["SCA Certifications", "Origin Trips"],
                },
                jobTitle: "Lead Barista & Trainer (m/w/d)",
                jobLocation: "Köln Ehrenfeld",
                workModel: ["Office"],
                startDate: "Ab sofort",
                contactPerson: {
                    name: "Lena Müller",
                    role: "Head of People",
                    email: "work@ritualcoffee.de",
                    website: "ritualcoffee.de",
                    message: "Du lebst für guten Kaffee? Dann bist du genau richtig.",
                    photo: "/Recruter-Hr/IMG_4415.JPG",
                },
            },
        },
        {
            email: "salon@seed.cherry",
            data: {
                companyName: "Salon Maison",
                claim: "Beauty as an art form.",
                description: "Hamburgs exklusivster Premium-Salon mit zwei Standorten in Eppendorf und der HafenCity. Standards in Farbbehandlung, Cut und Bridal Styling.",
                industry: "Beauty & Wellness",
                companySize: "10–25 Mitarbeiter",
                location: "Hamburg",
                companyLogo: "/hairdresser/IMG_4483.JPG",
                galleryImages: [
                    { url: "/hairdresser/IMG_4483.JPG", caption: "Salon Eppendorf" },
                    { url: "/hairdresser/IMG_4484.JPG", caption: "Color Suite" },
                    { url: "/hairdresser/IMG_4485.JPG", caption: "Bridal Team" },
                ],
                cultureValues: [
                    "Exzellenz",
                    "Kreativität",
                    "Kundenzufriedenheit",
                    "Teamgeist",
                ],
                benefits: {
                    arbeitsmodell: ["4-Tage-Woche möglich", "Flexible Termine"],
                    finanziell: ["Provisionssystem", "Top-Gehalt"],
                    lifestyle: ["Produktbudget", "Kostenlose Behandlungen"],
                    mobilitat: ["HVV Ticket"],
                    entwicklung: ["Weiterbildungen", "Messen & Shows"],
                },
                jobTitle: "Senior Hair Stylist – Color Specialist (m/w/d)",
                jobLocation: "Hamburg Eppendorf",
                workModel: ["Office"],
                startDate: "Nach Vereinbarung",
                contactPerson: {
                    name: "Marie Hofmann",
                    role: "Salon Director",
                    email: "karriere@salon-maison.de",
                    website: "salon-maison.de",
                    message: "Du bist Künstlerin und Handwerkerin zugleich? Wir haben den richtigen Platz.",
                    photo: "/Recruter-Hr/IMG_4415.JPG",
                },
            },
        },
        {
            email: "restaurant@seed.cherry",
            data: {
                companyName: "Restaurant Saison",
                claim: "Saisonal. Lokal. Unvergesslich.",
                description: "Eines der gefragtesten Fine-Dining-Restaurants in Berlin. Wir kochen mit saisonalen Zutaten von regionalen Produzenten.",
                industry: "Fine Dining",
                companySize: "25–50 Mitarbeiter",
                location: "Berlin",
                companyLogo: "/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg",
                galleryImages: [
                    {
                        url: "/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg",
                        caption: "Kitchen at work",
                    },
                ],
                cultureValues: [
                    "Regionalität",
                    "Saisonalität",
                    "Kreativität",
                    "Respekt",
                ],
                benefits: {
                    arbeitsmodell: ["4-Tage-Woche", "Geregelte Schichten"],
                    finanziell: ["Top Gehalt über Tarif", "Service-Charge Beteiligung"],
                    lifestyle: ["Familienmahlzeit", "Team-Events"],
                    mobilitat: ["BVG Ticket"],
                    entwicklung: ["Kochkurse", "Produzenten-Besuche"],
                },
                jobTitle: "Sous Chef (m/w/d)",
                jobLocation: "Berlin Prenzlauer Berg",
                workModel: ["Office"],
                startDate: "01.10.2025",
                contactPerson: {
                    name: "Jonas Weiss",
                    role: "Head Chef & Owner",
                    email: "team@restaurant-saison.de",
                    phone: "+49 30 246810",
                    website: "restaurant-saison.de",
                    message: "Wir bauen unser Küchenteam aus — Herzblut gefragt.",
                    photo: "/Recruter-Hr/IMG_4415.JPG",
                },
            },
        },
    ];
    console.log("\n🏢 Inserting Companies...");
    for (const c of companies) {
        const [user] = await (0, db_1.default) `
      INSERT INTO users (email, hashed_password, role)
      VALUES (${c.email}, ${hash}, 'company') RETURNING id
    `;
        await (0, db_1.default) `
  INSERT INTO company_profiles (user_id, profile_data)
  VALUES (${user.id}, ${db_1.default.json(c.data)})
`;
        console.log(`  ✓ ${c.data.companyName}`);
    }
    await db_1.default.end();
    console.log("\n✅ Seed complete!");
    console.log("   Login: marcus@seed.cherry / Cherry2025!  (Talent)");
    console.log("   Login: studio@seed.cherry  / Cherry2025!  (Company)");
}
run().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
