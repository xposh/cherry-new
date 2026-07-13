import { Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { useCompanyProfile } from "../../context/CompanyProfileContext";

export function CompanyProfileSetup2() {
  const navigate = useNavigate();
  const { updateCompanyProfile } = useCompanyProfile();

  const getSavedData = () => {
    try {
      const saved = localStorage.getItem("companySetup2");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Fehler beim Parsen von companySetup2:", e);
      return null;
    }
  };

  const savedData = getSavedData();

  const [companyInfo, setCompanyInfo] = useState({
    companyName: savedData?.companyInfo?.companyName || "",
    industry: savedData?.companyInfo?.industry || "",
    customIndustry: savedData?.companyInfo?.customIndustry || "",
    location: savedData?.companyInfo?.location || "",
    foundedYear: savedData?.companyInfo?.foundedYear || "",
    companySize: savedData?.companyInfo?.companySize || "",
    website: savedData?.companyInfo?.website || "",
    claim: savedData?.companyInfo?.claim || "",
    description: savedData?.companyInfo?.description || "",
  });

  const [selectedValues, setSelectedValues] = useState<string[]>(
    savedData?.selectedValues || [],
  );
  const [customValue, setCustomValue] = useState(savedData?.customValue || "");

  const [benefits, setBenefits] = useState(
    savedData?.benefits || {
      arbeitsmodell: [] as string[],
      finanziell: [] as string[],
      lifestyle: [] as string[],
      mobilitat: [] as string[],
      entwicklung: [] as string[],
    },
  );

  const predefinedValues = [
    "Präzision",
    "Freiheit",
    "Verantwortung",
    "Ästhetik",
    "Tempo",
    "Innovation",
    "Tradition",
    "Nachhaltigkeit",
    "Teamwork",
    "Flexibilität",
    "Qualität",
    "Kreativität",
    "Transparenz",
    "Diversität",
    "Wachstum",
    "Balance",
    "Exzellenz",
    "Mut",
    "Vertrauen",
    "Respekt",
  ];

  const benefitOptions = {
    arbeitsmodell: [
      "Remote möglich",
      "Flexible Zeiten",
      "4-Tage-Woche",
      "Homeoffice",
      "Workation",
      "Gleitzeit",
      "Sabbatical",
    ],
    finanziell: [
      "Bonus",
      "Beteiligung",
      "Altersvorsorge",
      "Gehaltstransparenz",
      "Vermögenswirksame Leistungen",
      "Sonderzahlungen",
    ],
    lifestyle: [
      "Gym / Fitness",
      "Essen / Catering",
      "Wellness / Spa",
      "Team Events",
      "Massagen",
      "Yoga-Kurse",
      "Getränke & Snacks",
    ],
    mobilitat: [
      "Deutschlandticket",
      "Bike Leasing",
      "Firmenwagen",
      "Parkplatz",
      "E-Scooter",
      "Tankgutscheine",
    ],
    entwicklung: [
      "Weiterbildungen",
      "Mentoring",
      "Kursbudget",
      "Konferenzen",
      "Sprachkurse",
      "Coaching",
      "Zertifizierungen",
    ],
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value,
    });
  };

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const addCustomValue = () => {
    if (
      customValue.trim() &&
      !selectedValues.includes(customValue.trim()) &&
      selectedValues.length < 5
    ) {
      setSelectedValues([...selectedValues, customValue.trim()]);
      setCustomValue("");
    }
  };

  const toggleBenefit = (category: keyof typeof benefits, benefit: string) => {
    const current = benefits[category];
    if (current.includes(benefit)) {
      setBenefits({
        ...benefits,
        [category]: current.filter((b: string) => b !== benefit),
      });
    } else {
      setBenefits({
        ...benefits,
        [category]: [...current, benefit],
      });
    }
  };

  const handleNext = () => {
    const setup2Data = {
      companyInfo,
      selectedValues,
      benefits,
      customValue,
    };
    localStorage.setItem("companySetup2", JSON.stringify(setup2Data));

    updateCompanyProfile({
      ...companyInfo,
      cultureValues: selectedValues,
      benefits,
    });
    navigate("/company-profile-setup-3");
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-20">
      <Logo to="/" />

      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-32 pb-32">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-4">
            Company Information
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Tell us about your company and what makes you unique.
          </p>
        </div>

        <div className="space-y-12">
          {/* Basic Info */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={companyInfo.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <select
                name="industry"
                value={companyInfo.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
              >
                <option value="" className="bg-black">
                  Select Industry
                </option>
                <option value="Gastronomie" className="bg-black">
                  Gastronomie
                </option>
                <option value="Hotellerie" className="bg-black">
                  Hotellerie
                </option>
                <option value="Einzelhandel" className="bg-black">
                  Einzelhandel
                </option>
                <option value="IT & Tech" className="bg-black">
                  IT & Tech
                </option>
                <option value="Gesundheit" className="bg-black">
                  Gesundheit
                </option>
                <option value="Other" className="bg-black">
                  Other
                </option>
              </select>

              {companyInfo.industry === "Other" && (
                <input
                  type="text"
                  name="customIndustry"
                  placeholder="Enter your industry"
                  value={companyInfo.customIndustry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg md:col-span-2"
                />
              )}

              <input
                type="text"
                name="location"
                placeholder="Location (e.g., Hamburg, Germany)"
                value={companyInfo.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="text"
                name="foundedYear"
                placeholder="Founded Year (e.g., 2018)"
                value={companyInfo.foundedYear}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <select
                name="companySize"
                value={companyInfo.companySize}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
              >
                <option value="" className="bg-black">
                  Company Size
                </option>
                <option value="1-10" className="bg-black">
                  1-10 employees
                </option>
                <option value="11-50" className="bg-black">
                  11-50 employees
                </option>
                <option value="51-200" className="bg-black">
                  51-200 employees
                </option>
                <option value="201-500" className="bg-black">
                  201-500 employees
                </option>
                <option value="500+" className="bg-black">
                  500+ employees
                </option>
              </select>
              <input
                type="url"
                name="website"
                placeholder="Website (e.g., https://example.com)"
                value={companyInfo.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
            </div>
          </section>

          {/* Claim */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Euer Claim
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Ein Satz, der eure Mission auf den Punkt bringt
            </p>
            <input
              type="text"
              name="claim"
              placeholder="Wir gestalten Genuss-Momente, die Menschen verbinden."
              value={companyInfo.claim}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
            />
          </section>

          {/* Description */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Kurzbeschreibung
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Kurz, emotional, kein HR-Text
            </p>
            <textarea
              name="description"
              placeholder="Modernes Restaurant mit französischer Küche und lokalen Zutaten im Herzen von Hamburg."
              value={companyInfo.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light resize-none rounded-lg"
            />
          </section>

          {/* Werte */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Werte
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Wählt bis zu 5 Werte, die euch ausmachen
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              {predefinedValues.map((value) => (
                <button
                  key={value}
                  onClick={() => toggleValue(value)}
                  className={`px-4 py-2 border transition-all rounded-lg text-sm ${
                    selectedValues.includes(value)
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white border-white/30 hover:border-white"
                  }`}
                  disabled={
                    !selectedValues.includes(value) &&
                    selectedValues.length >= 5
                  }
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Eigener Wert"
                className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <button
                onClick={addCustomValue}
                disabled={selectedValues.length >= 5}
                className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-all rounded-lg disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {selectedValues.length}/5 ausgewählt
            </p>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Benefits
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Was bietet ihr euren Mitarbeitern?
            </p>

            {Object.entries(benefitOptions).map(([category, options]) => (
              <div key={category} className="mb-8">
                <h3 className="text-white font-light mb-4 capitalize">
                  {category === "arbeitsmodell"
                    ? "Arbeitsmodell"
                    : category === "mobilitat"
                      ? "Mobilität"
                      : category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {options.map((benefit) => (
                    <button
                      key={benefit}
                      onClick={() =>
                        toggleBenefit(
                          category as keyof typeof benefits,
                          benefit,
                        )
                      }
                      className={`px-4 py-2 border transition-all rounded-lg text-sm ${
                        benefits[category as keyof typeof benefits].includes(
                          benefit,
                        )
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-white border-white/30 hover:border-white"
                      }`}
                    >
                      {benefit}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-white/20 mt-12">
          <Link
            to="/company-profile-setup-1"
            className="px-8 py-3 border border-white/30 text-white hover:border-white transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg"
          >
            Back
          </Link>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}
