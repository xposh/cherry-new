import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";

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

export function TalentProfileSetup2() {
  const navigate = useNavigate();

  // Helper-Funktion zur sicheren Extraktion von verschachtelten localStorage-Daten
  const getSavedData = () => {
    try {
      const saved = localStorage.getItem("talentSetup2");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Fehler beim Parsen von talentSetup2:", e);
      return null;
    }
  };

  const savedData = getSavedData();

  // 1. ZUSTANDS-INITIALISIERUNG AUS DEM LOCALSTORAGE (RE-HYDRATION)
  const [formData, setFormData] = useState({
    firstName: savedData?.formData?.firstName || "",
    lastName: savedData?.formData?.lastName || "",
    age: savedData?.formData?.age || "",
    location: savedData?.formData?.location || "",
    position: savedData?.formData?.position || "",
    specialty: savedData?.formData?.specialty || "",
    about: savedData?.formData?.about || "",
  });

  const [education, setEducation] = useState({
    degree: savedData?.education?.degree || "",
    customDegree: savedData?.education?.customDegree || "",
    institution: savedData?.education?.institution || "",
  });

  const [experiences, setExperiences] = useState<Experience[]>(
    savedData?.experiences || [],
  );

  const [otherExperiences, setOtherExperiences] = useState<Experience[]>(
    savedData?.otherExperiences || [],
  );

  const [skills, setSkills] = useState<string[]>(savedData?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const [languages, setLanguages] = useState<Language[]>(
    savedData?.languages || [],
  );
  const [newLanguage, setNewLanguage] = useState({
    language: "",
    level: "Basic",
  });

  const [recognitions, setRecognitions] = useState<Recognition[]>(
    savedData?.recognitions || [],
  );

  const [jobPreferences, setJobPreferences] = useState({
    otherPositions:
      savedData?.jobPreferences?.otherPositions || ([] as string[]),
    workModel: savedData?.jobPreferences?.workModel || ([] as string[]),
    availableFrom: savedData?.jobPreferences?.availableFrom || "",
    employmentType:
      savedData?.jobPreferences?.employmentType || ([] as string[]),
    employmentDuration: savedData?.jobPreferences?.employmentDuration || "",
    preferredLocation: savedData?.jobPreferences?.preferredLocation || "",
  });

  const [newPosition, setNewPosition] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setEducation({
      ...education,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addLanguage = () => {
    if (newLanguage.language.trim()) {
      setLanguages([...languages, { ...newLanguage }]);
      setNewLanguage({ language: "", level: "Basic" });
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        company: "",
        period: "",
        years: "",
        level: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    );
  };

  const addOtherExperience = () => {
    setOtherExperiences([
      ...otherExperiences,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        company: "",
        period: "",
        years: "",
        level: "",
        description: "",
      },
    ]);
  };

  const removeOtherExperience = (id: string) => {
    setOtherExperiences(otherExperiences.filter((exp) => exp.id !== id));
  };

  const updateOtherExperience = (id: string, field: string, value: string) => {
    setOtherExperiences(
      otherExperiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    );
  };

  const addRecognition = () => {
    setRecognitions([
      ...recognitions,
      {
        id: Math.random().toString(36).substr(2, 9),
        award: "",
        year: "",
      },
    ]);
  };

  const removeRecognition = (id: string) => {
    setRecognitions(recognitions.filter((rec) => rec.id !== id));
  };

  const updateRecognition = (id: string, field: string, value: string) => {
    setRecognitions(
      recognitions.map((rec) =>
        rec.id === id ? { ...rec, [field]: value } : rec,
      ),
    );
  };

  const addPosition = () => {
    if (
      newPosition.trim() &&
      !jobPreferences.otherPositions.includes(newPosition.trim())
    ) {
      setJobPreferences({
        ...jobPreferences,
        otherPositions: [...jobPreferences.otherPositions, newPosition.trim()],
      });
      setNewPosition("");
    }
  };

  const removePosition = (position: string) => {
    setJobPreferences({
      ...jobPreferences,
      otherPositions: jobPreferences.otherPositions.filter(
        (p: string) => p !== position,
      ),
    });
  };

  const toggleWorkModel = (model: string) => {
    if (jobPreferences.workModel.includes(model)) {
      setJobPreferences({
        ...jobPreferences,
        workModel: jobPreferences.workModel.filter((m: string) => m !== model),
      });
    } else {
      setJobPreferences({
        ...jobPreferences,
        workModel: [...jobPreferences.workModel, model],
      });
    }
  };

  const toggleEmploymentType = (type: string) => {
    if (jobPreferences.employmentType.includes(type)) {
      setJobPreferences({
        ...jobPreferences,
        employmentType: jobPreferences.employmentType.filter(
          (t: string) => t !== type,
        ),
      });
    } else {
      setJobPreferences({
        ...jobPreferences,
        employmentType: [...jobPreferences.employmentType, type],
      });
    }
  };

  // 2. SPEICHER-STRUKTUR FÜR DIE SUMMARY REPARIERT
  const handleNext = () => {
    const setupData = {
      formData,
      education,
      skills,
      experiences,
      otherExperiences,
      languages,
      recognitions,
      jobPreferences,
    };

    // Schreibt das komplette Paket in den Speicher, die Summary zieht sich genau dieses Objekt.
    localStorage.setItem("talentSetup2", JSON.stringify(setupData));

    console.log({
      firstName: formData.firstName,
      lastName: formData.lastName,
      bio: formData.about,
      age: formData.age,
    });

    navigate("/talent-profile-setup-3");
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-20">
      <Link to="/">
        <Logo />
      </Link>

      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-32 pb-32">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-4">
            Professional Information
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Tell us about your experience and expertise.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="text"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="text"
                name="location"
                placeholder="Location (e.g., Berlin, Germany)"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="text"
                name="position"
                placeholder="Position (e.g., Bar Manager)"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <input
                type="text"
                name="specialty"
                placeholder="Specialty (e.g., Signature Cocktails & Fine Spirits)"
                value={formData.specialty}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg md:col-span-2"
              />
            </div>
          </section>

          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              About You
            </h2>
            <textarea
              name="about"
              placeholder="Award-winning Bar Manager with over 15 years of experience in luxury hospitality..."
              value={formData.about}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light resize-none rounded-lg"
            />
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-light uppercase tracking-[0.2em] text-sm">
                Experience
              </h2>
              <button
                onClick={addExperience}
                className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-sm uppercase tracking-[0.2em] font-light rounded-lg"
              >
                + Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 border border-white/30 rounded-xl relative"
                >
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-4 right-4 text-white/60 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(exp.id, "title", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Period (e.g., 2020 - Present)"
                      value={exp.period}
                      onChange={(e) =>
                        updateExperience(exp.id, "period", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Years"
                        value={exp.years}
                        onChange={(e) =>
                          updateExperience(exp.id, "years", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                      />
                      <select
                        value={exp.level}
                        onChange={(e) =>
                          updateExperience(exp.id, "level", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
                      >
                        <option value="" className="bg-black">
                          Level
                        </option>
                        <option value="Junior" className="bg-black">
                          Junior (0-2 years)
                        </option>
                        <option value="Mid-Level" className="bg-black">
                          Mid-Level (3-5 years)
                        </option>
                        <option value="Senior" className="bg-black">
                          Senior (5-8 years)
                        </option>
                        <option value="Expert" className="bg-black">
                          Expert (8+ years)
                        </option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Description..."
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(exp.id, "description", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light resize-none rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Expertise
            </h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                placeholder="e.g., Signature Cocktails, Spirit Pairing..."
                className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <button
                onClick={addSkill}
                className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-all rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 px-4 py-2 border border-white text-white group hover:border-red-500 hover:text-red-500 transition-colors rounded-lg"
                >
                  <span className="font-light text-sm">{skill}</span>
                  <button onClick={() => removeSkill(skill)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-light uppercase tracking-[0.2em] text-sm">
                Other Work Experience
              </h2>
              <button
                onClick={addOtherExperience}
                className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-sm uppercase tracking-[0.2em] font-light rounded-lg"
              >
                + Add Other Experience
              </button>
            </div>
            <div className="space-y-6">
              {otherExperiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 border border-white/30 rounded-xl relative"
                >
                  <button
                    onClick={() => removeOtherExperience(exp.id)}
                    className="absolute top-4 right-4 text-white/60 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) =>
                        updateOtherExperience(exp.id, "title", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) =>
                        updateOtherExperience(exp.id, "company", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Period"
                      value={exp.period}
                      onChange={(e) =>
                        updateOtherExperience(exp.id, "period", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Years"
                        value={exp.years}
                        onChange={(e) =>
                          updateOtherExperience(exp.id, "years", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                      />
                      <select
                        value={exp.level}
                        onChange={(e) =>
                          updateOtherExperience(exp.id, "level", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
                      >
                        <option value="" className="bg-black">
                          Level
                        </option>
                        <option value="Junior" className="bg-black">
                          Junior (0-2 years)
                        </option>
                        <option value="Mid-Level" className="bg-black">
                          Mid-Level (3-5 years)
                        </option>
                        <option value="Senior" className="bg-black">
                          Senior (5-8 years)
                        </option>
                        <option value="Expert" className="bg-black">
                          Expert (8+ years)
                        </option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Description..."
                      value={exp.description}
                      onChange={(e) =>
                        updateOtherExperience(
                          exp.id,
                          "description",
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light resize-none rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-light uppercase tracking-[0.2em] text-sm">
                Recognition
              </h2>
              <button
                onClick={addRecognition}
                className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all text-sm uppercase tracking-[0.2em] font-light rounded-lg"
              >
                + Add Award
              </button>
            </div>
            <div className="space-y-4">
              {recognitions.map((rec) => (
                <div key={rec.id} className="flex gap-4 items-start">
                  <input
                    type="text"
                    placeholder="Award / Recognition"
                    value={rec.award}
                    onChange={(e) =>
                      updateRecognition(rec.id, "award", e.target.value)
                    }
                    className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={rec.year}
                    onChange={(e) =>
                      updateRecognition(rec.id, "year", e.target.value)
                    }
                    className="w-32 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                  />
                  <button
                    onClick={() => removeRecognition(rec.id)}
                    className="p-3 text-white/60 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Education
            </h2>
            <div className="space-y-6">
              <select
                name="degree"
                value={education.degree}
                onChange={handleEducationChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
              >
                <option value="" className="bg-black">
                  Select Degree / Qualification
                </option>
                <option value="Bachelor" className="bg-black">
                  Bachelor
                </option>
                <option value="Master" className="bg-black">
                  Master
                </option>
                <option value="Diplom" className="bg-black">
                  Diplom
                </option>
                <option value="Promotion" className="bg-black">
                  Promotion
                </option>
                <option value="Ausbildung" className="bg-black">
                  Ausbildung
                </option>
                <option value="Abitur" className="bg-black">
                  Abitur
                </option>
                <option value="Other" className="bg-black">
                  Other
                </option>
              </select>

              {education.degree === "Other" && (
                <input
                  type="text"
                  name="customDegree"
                  placeholder="Enter your degree"
                  value={education.customDegree}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                />
              )}

              <input
                type="text"
                name="institution"
                placeholder="University / Training Institution"
                value={education.institution}
                onChange={handleEducationChange}
                className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
            </div>
          </section>

          <section>
            <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Languages
            </h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newLanguage.language}
                onChange={(e) =>
                  setNewLanguage({ ...newLanguage, language: e.target.value })
                }
                placeholder="Language (e.g., English)"
                className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
              />
              <select
                value={newLanguage.level}
                onChange={(e) =>
                  setNewLanguage({ ...newLanguage, level: e.target.value })
                }
                className="px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
              >
                <option value="Basic" className="bg-black">
                  Basic
                </option>
                <option value="Conversational" className="bg-black">
                  Conversational
                </option>
                <option value="Fluent" className="bg-black">
                  Fluent
                </option>
                <option value="Native" className="bg-black">
                  Native
                </option>
              </select>
              <button
                onClick={addLanguage}
                className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-all rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-white/30 rounded-lg group hover:border-red-500 transition-colors"
                >
                  <span className="text-white font-light">
                    {lang.language} •{" "}
                    <span className="text-gray-400">{lang.level}</span>
                  </span>
                  <button
                    onClick={() => removeLanguage(index)}
                    className="text-white/60 group-hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-white font-light mb-8 uppercase tracking-[0.2em] text-sm">
              Job Preferences
            </h2>

            {/* Other Positions */}
            <div className="mb-8">
              <label className="block text-white/80 font-light mb-4 text-sm">
                Other Positions You're Open To
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="Add position"
                  className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                />
                <button
                  onClick={addPosition}
                  className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-all rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {jobPreferences.otherPositions.map((position: string) => (
                  <div
                    key={position}
                    className="flex items-center gap-2 px-4 py-2 border border-white text-white group hover:border-red-500 hover:text-red-500 transition-colors rounded-lg"
                  >
                    <span className="font-light text-sm">{position}</span>
                    <button onClick={() => removePosition(position)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Model */}
            <div className="mb-8">
              <label className="block text-white/80 font-light mb-4 text-sm">
                Work Model
              </label>
              <div className="flex flex-wrap gap-3">
                {["Remote", "Office", "Hybrid"].map((model) => (
                  <button
                    key={model}
                    onClick={() => toggleWorkModel(model)}
                    className={`px-6 py-3 border transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg ${
                      jobPreferences.workModel.includes(model)
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white border-white/30 hover:border-white"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div className="mb-8">
              <label className="block text-white/80 font-light mb-4 text-sm">
                Employment Type
              </label>
              <div className="flex flex-wrap gap-3">
                {["Full-time", "Part-time", "Freelance", "Contract"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => toggleEmploymentType(type)}
                      className={`px-6 py-3 border transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg ${
                        jobPreferences.employmentType.includes(type)
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-white border-white/30 hover:border-white"
                      }`}
                    >
                      {type}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Other Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 font-light mb-3 text-sm">
                  Available From
                </label>
                <input
                  type="date"
                  value={jobPreferences.availableFrom}
                  onChange={(e) =>
                    setJobPreferences({
                      ...jobPreferences,
                      availableFrom: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                />
              </div>
              <div>
                <label className="block text-white/80 font-light mb-3 text-sm">
                  Employment Duration
                </label>
                <select
                  value={jobPreferences.employmentDuration}
                  onChange={(e) =>
                    setJobPreferences({
                      ...jobPreferences,
                      employmentDuration: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white focus:border-white focus:outline-none transition-colors font-light appearance-none rounded-lg"
                >
                  <option value="" className="bg-black">
                    Select duration
                  </option>
                  <option value="Permanent" className="bg-black">
                    Permanent
                  </option>
                  <option value="Temporary" className="bg-black">
                    Temporary
                  </option>
                  <option value="Project-based" className="bg-black">
                    Project-based
                  </option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/80 font-light mb-3 text-sm">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={jobPreferences.preferredLocation}
                  onChange={(e) =>
                    setJobPreferences({
                      ...jobPreferences,
                      preferredLocation: e.target.value,
                    })
                  }
                  placeholder="e.g., Berlin, Munich, or Remote"
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light rounded-lg"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-white/20 mt-12">
          <Link
            to="/talent-profile-setup-1"
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
