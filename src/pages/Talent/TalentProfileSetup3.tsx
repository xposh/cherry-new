import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import * as Lucide from 'lucide-react';
import { useProfile } from "../../context/ProfileContext";

export function TalentProfileSetup3() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();

  const iconMap: Record<string, JSX.Element> = {
    Linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
    ),
    Github: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
    ),
    Instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    ),
    Twitter: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    ),
    Globe: <Lucide.Globe className="w-5 h-5" />
  };

  const [highlights, setHighlights] = useState('Gewinner des Deutschen Architekturpreises 2024...');
  const [communities, setCommunities] = useState<string[]>(['Bund Deutscher Architekten (BDA)']);
  const [newCommunity, setNewCommunity] = useState('');
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>( [
    { platform: 'Linkedin', url: 'https://linkedin.com/in/marcus-mueller' },
    { platform: 'Github', url: 'https://github.com/marcusmueller' }
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('Linkedin');
  const [newUrl, setNewUrl] = useState('');
  const [email, setEmail] = useState('marcus.mueller@email.de');
  const [phone, setPhone] = useState('+49 170 1234567');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const handleFinish = () => {
    updateProfile({
      specialties: highlights,
      communities: communities,
      socialLinks: socialLinks,
      email: email,
      phone: phone,
    });
    navigate('/talent-profile-summary');
  };

  const addCommunity = () => {
    if (newCommunity.trim()) {
      setCommunities([...communities, newCommunity]);
      setNewCommunity('');
    }
  };

  const addSocial = () => {
    if (newUrl.trim()) {
      setSocialLinks([...socialLinks, { platform: selectedPlatform, url: newUrl }]);
      setNewUrl('');
      setIsDropdownOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pb-20 font-sans antialiased">
      
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center z-50">
        <div 
          className="p-1 -ml-1 cursor-pointer hover:bg-gray-50 rounded-full transition-colors mr-4"
          onClick={() => navigate('/talent-profile-setup-2')}
        >
          <Lucide.ChevronLeft className="w-6 h-6 text-gray-800" />
        </div>
        <h1 className="text-[17px] font-medium tracking-tight">Letzte Details</h1>
      </div>

      <div className="max-w-[480px] mx-auto px-6 py-10 space-y-12">
        
        {/* BLOCK: Besonderheiten */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[17px] font-bold text-gray-900">Besonderheiten</h2>
            <p className="text-[13px] text-gray-500 mt-1">Gibt es etwas Besonderes, das dich herausstechen lässt?</p>
          </div>
          <textarea 
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-4 text-[15px] outline-none focus:border-black min-h-[140px] bg-white resize-none shadow-sm"
          />
          <p className="text-[12px] text-gray-400 font-medium px-1">Optional</p>
        </section>

        {/* BLOCK: Communities & Verbände */}
        <section className="space-y-4 pt-4 border-t border-gray-50">
          <div className="px-1">
            <h2 className="text-[17px] font-bold text-gray-900">Communities & Verbände</h2>
            <p className="text-[13px] text-gray-500 mt-1">Bist du Mitglied in Berufsverbänden oder Communities?</p>
          </div>
          <div className="space-y-3">
            {communities.map((item, index) => (
              <div key={index} className="flex items-center gap-3 border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                <Lucide.Users className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-[14px] text-gray-700">{item}</span>
                <Lucide.X 
                  className="w-4 h-4 text-gray-300 cursor-pointer hover:text-red-500 transition-colors" 
                  onClick={() => setCommunities(communities.filter((_, i) => i !== index))} 
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              placeholder="Name des Verbands..." 
              value={newCommunity} 
              onChange={(e) => setNewCommunity(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none bg-gray-50/30 focus:border-black transition-all" 
            />
            <button 
              onClick={addCommunity} 
              className="bg-gray-100 px-4 rounded-xl font-bold text-[13px] hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Lucide.Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </section>

        {/* BLOCK: Vernetzte Konten */}
        <section className="space-y-4 pt-4 border-t border-gray-50">
          <div className="px-1">
            <h2 className="text-[17px] font-bold text-gray-900">Vernetzte Konten</h2>
            <p className="text-[13px] text-gray-500 mt-1">Verbinde deine professionellen Profile und Social Media.</p>
          </div>
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-4 border border-gray-100 p-4 rounded-2xl bg-gray-50/50">
                {iconMap[link.platform] || iconMap.Globe}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{link.platform}</p>
                  <p className="text-[14px] text-gray-700 truncate">{link.url}</p>
                </div>
                <Lucide.X className="w-4 h-4 text-gray-300 cursor-pointer" onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))} />
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] bg-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {iconMap[selectedPlatform] || iconMap.Globe}
                <span>{selectedPlatform}</span>
              </div>
              <Lucide.ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-[55px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] overflow-hidden">
                {Object.keys(iconMap).map((p) => (
                  <div 
                    key={p} 
                    className="px-4 py-3 text-[14px] hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                    onClick={() => { setSelectedPlatform(p); setIsDropdownOpen(false); }}
                  >
                    {iconMap[p]}
                    {p}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <input 
                placeholder="URL einfügen..." 
                value={newUrl} 
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] outline-none bg-gray-50/30 focus:border-black" 
              />
              <button onClick={addSocial} className="bg-gray-100 px-6 rounded-xl font-bold text-[13px] hover:bg-gray-200 transition-colors">Hinzufügen</button>
            </div>
          </div>
        </section>

        {/* BLOCK: Kontakt */}
        <section className="space-y-6 pt-4 border-t border-gray-50">
          <div className="px-1">
            <h2 className="text-[17px] font-bold text-gray-900">Kontakt</h2>
            <p className="text-[13px] text-gray-500 mt-1">Wie können dich potenzielle Arbeitgeber erreichen?</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-900 px-1">E-Mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-4 text-[15px] outline-none focus:border-black shadow-sm" placeholder="Email" />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-900 px-1">Telefonnummer</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-4 text-[15px] outline-none focus:border-black shadow-sm" placeholder="Telefon" />
            <p className="text-[12px] text-gray-400 font-medium px-1">Optional</p>
          </div>
        </section>

        {/* BLOCK: Lebenslauf */}
        <section className="space-y-4 pt-6 border-t border-gray-100">
          <div className="px-1">
            <h2 className="text-[17px] font-bold text-gray-900">Lebenslauf</h2>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-[14px] font-bold">i</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[14px] font-bold text-gray-900">Geschützter Lebenslauf</p>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                Dein Lebenslauf wird nur für Matches sichtbar sein. Interessenten müssen eine Anfrage senden, die du freigeben musst.
              </p>
            </div>
          </div>

          <div 
            onClick={() => cvInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
          >
            <input 
              type="file" 
              ref={cvInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            
            <Lucide.Upload className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <p className="text-[15px] font-bold text-gray-900">Lebenslauf hochladen</p>
              <p className="text-[12px] text-gray-400">PDF, max. 5 MB</p>
            </div>
          </div>
          
          <p className="text-[12px] text-gray-400 font-medium px-1">Optional, aber empfohlen</p>
        </section>

        <button
          onClick={handleFinish}
          className="w-full bg-[#000000] text-white py-5 rounded-2xl font-medium uppercase text-[13px] tracking-[0.25em] active:scale-[0.98] transition-all shadow-lg"
        >
          Profil erstellen
        </button>

      </div>
    </div>
  );
}