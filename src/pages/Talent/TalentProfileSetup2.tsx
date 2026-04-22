import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronDown, ChevronRight, Plus, X, Calendar } from 'lucide-react';
import { useProfile } from "../../context/ProfileContext";

export function TalentProfileSetup2() {
  const navigate = useNavigate();
  const { updateProfile, profile } = useProfile();

  // --- 1. BILDUNG ---
  const [educationLevel, setEducationLevel] = useState(profile.educationLevel || 'Master');
  const [degree, setDegree] = useState(profile.degree || 'Master of Architecture');
  const [university, setUniversity] = useState(profile.university || 'Technische Universität Hamburg');

  // --- 2. BERUFSERFAHRUNG ---
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears || '8+ Jahre');
  const [seniority, setSeniority] = useState(profile.seniority || 'Senior');
  const [otherExperience, setOtherExperience] = useState(profile.otherExperience || 'Interior Design, Urban Planning');
  const [formerWorkplace, setFormerWorkplace] = useState(profile.formerWorkplace || 'Architekturbüro Schmidt, BauPlan GmbH');

  // --- 3. SKILLS ---
  const [skills, setSkills] = useState<string[]>(profile.skills || ['AutoCAD', 'Revit', '3D Modeling', 'Photoshop', 'SketchUp']);
  const [newSkill, setNewSkill] = useState('');

  // --- 4. LINKS ZU PROJEKTEN ---
  const [projectLinks, setProjectLinks] = useState<string[]>(profile.projectLinks || ['https://archdaily.com/project1', 'https://behance.net/marcus-architecture']);
  const [newLink, setNewLink] = useState('');

  // --- 5. SPRACHEN ---
  const [languages, setLanguages] = useState<{name: string, level: string}[]>(profile.languages || [
    { name: 'Deutsch', level: 'Muttersprache' },
    { name: 'Englisch', level: 'Fließend' }
  ]);

  // --- 6. JOB-PRÄFERENZEN ---
  const [idealPosition, setIdealPosition] = useState(profile.idealPosition || 'Senior Architekt');
  const [openPositions, setOpenPositions] = useState(profile.openPositions || 'Project Manager, Design Lead');
  const [workModel, setWorkModel] = useState(profile.workModel || 'Flexibel');
  const [availableFrom, setAvailableFrom] = useState(profile.availableFrom || '2026-05-01');
  const [employmentType, setEmploymentType] = useState(profile.employmentType || 'Vollzeit');
  const [employmentDuration, setEmploymentDuration] = useState(profile.employmentDuration || 'Unbefristet');
  const [locationPreference, setLocationPreference] = useState(profile.locationPreference || 'Hamburg, Berlin, Remote');

  // --- LOGIC HELPER ---
  const addSkill = () => { if(newSkill.trim()) { setSkills([...skills, newSkill]); setNewSkill(''); } };
  const addLink = () => { if(newLink.trim()) { setProjectLinks([...projectLinks, newLink]); setNewLink(''); } };
  
  const updateLanguage = (index: number, field: 'name' | 'level', value: string) => {
    const newLangs = [...languages];
    newLangs[index] = { ...newLangs[index], [field]: value };
    setLanguages(newLangs);
  };

  const handleNext = () => {
    updateProfile({ 
      educationLevel, degree, university, experienceYears, seniority, 
      otherExperience, formerWorkplace, skills, projectLinks, languages,
      idealPosition, openPositions, workModel, availableFrom, employmentType,
      employmentDuration, locationPreference
    });
    navigate('/talent-profile-setup-3');
  };

  return (
    <div className="min-h-screen bg-white text-black pb-24 font-sans antialiased">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center z-50">
        <div 
          className="p-1 -ml-1 cursor-pointer bg-gray-50 rounded-full transition-colors flex items-center justify-center mr-4" 
          onClick={() => navigate('/talent-profile-setup-1')}
        >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
        </div>
        <h1 className="text-[17px] font-medium text-gray-900 tracking-tight">Über dich</h1>
      </div>

      <div className="max-w-[480px] mx-auto px-6 py-10 space-y-10">
        
        {/* BILDUNG */}
        <section className="space-y-5">
          <h2 className="text-[18px] font-medium tracking-tight text-gray-900">Bildung</h2>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Bildungsstand</label>
              <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 mt-1 text-[14px] appearance-none bg-white outline-none focus:border-black transition-colors">
                <option>Bachelor</option><option>Master</option><option>Diplom</option><option>Promotion</option><option>Ausbildung</option><option>Abitur</option>
              </select>
              <ChevronDown className="absolute right-3 top-[65%] -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Abschluss</label>
              <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black" />
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Ausbildung / Universität</label>
              <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black" />
            </div>
          </div>
        </section>

        {/* BERUFSERFAHRUNG */}
        <section className="space-y-5 pt-4 border-t border-gray-50">
          <h2 className="text-[18px] font-medium tracking-tight text-gray-900">Berufserfahrung</h2>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Jahre der Berufserfahrung</label>
              <select value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 mt-1 text-[14px] appearance-none bg-white outline-none focus:border-black">
                <option>0-1 Jahre</option><option>1-3 Jahre</option><option>3-5 Jahre</option><option>5-8 Jahre</option><option>8+ Jahre</option>
              </select>
              <ChevronDown className="absolute right-3 top-[65%] -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>
            <div className="relative">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Erfahrungslevel</label>
              <select value={seniority} onChange={(e) => setSeniority(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 mt-1 text-[14px] appearance-none bg-white outline-none focus:border-black">
                <option>Junior</option><option>Mid-Level</option><option>Senior</option><option>Lead</option><option>Expert</option>
              </select>
              <ChevronDown className="absolute right-3 top-[65%] -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Andere Berufserfahrungen</label>
              <input type="text" value={otherExperience} onChange={(e) => setOtherExperience(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none" />
              <p className="text-[10px] text-gray-400 ml-1">Kommagetrennt</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Ehemalige Arbeitsorte</label>
              <input type="text" value={formerWorkplace} onChange={(e) => setFormerWorkplace(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none" />
              <p className="text-[10px] text-gray-400 ml-1">Kommagetrennt</p>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="space-y-4 pt-4 border-t border-gray-50">
          <h2 className="text-[18px] font-medium text-gray-900">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div key={skill} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span className="text-[13px] font-medium text-gray-700">{skill}</span>
                <X className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-black transition-colors" onClick={() => setSkills(skills.filter(s => s !== skill))} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input placeholder="Skill hinzufügen" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black transition-all" />
            <button onClick={addSkill} className="bg-gray-50 px-4 rounded-xl hover:bg-gray-100 border border-gray-100 transition-colors"><Plus className="w-5 h-5 text-gray-600" /></button>
          </div>
        </section>

        {/* LINKS ZU PROJEKTEN */}
        <section className="space-y-4 pt-4 border-t border-gray-50">
          <h2 className="text-[18px] font-medium text-gray-900">Links zu Projekten</h2>
          <div className="space-y-3">
            {projectLinks.map((link, idx) => (
              <div key={idx} className="flex items-center justify-between border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                <span className="text-[14px] text-gray-600 truncate mr-4">{link}</span>
                <X className="w-4 h-4 text-gray-300 cursor-pointer" onClick={() => setProjectLinks(projectLinks.filter((_, i) => i !== idx))} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input placeholder="https://beispiel.de/projekt" value={newLink} onChange={(e) => setNewLink(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black" />
            <button onClick={addLink} className="bg-gray-50 px-4 rounded-xl border border-gray-100"><Plus className="w-5 h-5 text-gray-600" /></button>
          </div>
        </section>

        {/* SPRACHEN (KORRIGIERT) */}
        <section className="space-y-4 pt-4 border-t border-gray-50">
          <h2 className="text-[18px] font-medium text-gray-900">Sprachen</h2>
          <div className="space-y-3">
            {languages.map((lang, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input 
                  type="text"
                  value={lang.name}
                  placeholder="z.B. Deutsch"
                  onChange={(e) => updateLanguage(idx, 'name', e.target.value)}
                  className="flex-[1.5] border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black transition-colors"
                />
                
                <div className="flex-1 relative">
                  <select 
                    value={lang.level}
                    onChange={(e) => updateLanguage(idx, 'level', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] appearance-none bg-white outline-none focus:border-black transition-colors"
                  >
                    <option>Muttersprache</option>
                    <option>Fließend</option>
                    <option>Sehr gut</option>
                    <option>Gut</option>
                    <option>Grundkenntnisse</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                </div>

                <X 
                  className="w-5 h-5 text-gray-300 cursor-pointer hover:text-black flex-shrink-0" 
                  onClick={() => setLanguages(languages.filter((_, i) => i !== idx))} 
                />
              </div>
            ))}
          </div>
          <button 
            type="button"
            className="text-[13px] font-medium text-gray-600 flex items-center gap-2 px-1 pt-1"
            onClick={() => setLanguages([...languages, { name: '', level: 'Gut' }])}
          >
            <Plus className="w-4 h-4" /> Sprache hinzufügen
          </button>
        </section>

        {/* JOB-PRÄFERENZEN (KORRIGIERT) */}
        <section className="space-y-6 pt-4 border-t border-gray-50">
          <h2 className="text-[18px] font-medium tracking-tight text-gray-900">Job-Präferenzen</h2>
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Ideale Jobposition</label>
              <input type="text" value={idealPosition} onChange={(e) => setIdealPosition(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black" />
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Andere Positionen für die du offen bist</label>
              <input type="text" value={openPositions} onChange={(e) => setOpenPositions(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black" />
              <p className="text-[10px] text-gray-400 ml-1">Kommagetrennt</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Arbeitsmodell</label>
              <div className="grid grid-cols-3 gap-3">
                {['Remote', 'Office', 'Flexibel'].map(mode => (
                  <button key={mode} onClick={() => setWorkModel(mode)}
                    className={`py-3.5 rounded-xl text-[13px] font-medium border transition-all ${workModel === mode ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Verfügbar ab</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none bg-white focus:border-black" 
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Gewünschte Beschäftigungsart</label>
              <select 
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] appearance-none bg-white outline-none focus:border-black transition-colors"
              >
                <option>Vollzeit</option>
                <option>Teilzeit</option>
                <option>Freelance</option>
                <option>Werkstudent</option>
              </select>
              <ChevronRight className="absolute right-4 top-[70%] -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

            <div className="space-y-1 relative">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Gewünschte Beschäftigungsdauer</label>
              <select 
                value={employmentDuration}
                onChange={(e) => setEmploymentDuration(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] appearance-none bg-white outline-none focus:border-black transition-colors"
              >
                <option>Unbefristet</option>
                <option>Befristet</option>
                <option>Projektbasiert</option>
              </select>
              <ChevronRight className="absolute right-4 top-[70%] -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-400 ml-1">Beschäftigungsort</label>
              <input type="text" value={locationPreference} onChange={(e) => setLocationPreference(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-black" />
              <p className="text-[10px] text-gray-400 ml-1">Kommagetrennt</p>
            </div>
          </div>
        </section>

        <button onClick={handleNext}
          className="w-full bg-[#000000] text-white py-5 rounded-2xl font-medium text-[15px] active:scale-[0.98] transition-all tracking-[0.1em]">
          Step 2/3
        </button>

      </div>
    </div>
  );
}