import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Plus, ChevronLeft } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

const germanCities = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund"];

export function TalentProfileSetup1() {
  const navigate = useNavigate();
  const { updateProfile, profile } = useProfile();

  // --- STATE ---
  const [name, setName] = useState(profile.name || 'Marcus Müller');
  const [jobTitle, setJobTitle] = useState(profile.jobTitle || 'Architekt');
  const [location, setLocation] = useState(profile.location || 'Hamburg');
  const [bio, setBio] = useState(profile.bio || 'Architekt aus Hamburg mit einer Leidenschaft für moderne, minimalistische Designs.');
  
  // Lokaler State für die UI-Vorschau
  const [profileImage, setProfileImage] = useState<string | null>(profile.profileImage || null);
  const [gallery, setGallery] = useState<(string | null)[]>(
    profile.gallery && profile.gallery.length > 0 ? profile.gallery : [null, null, null, null]
  );

  // --- LOGIC ---
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newGallery = [...gallery];
      newGallery[index] = url;
      setGallery(newGallery);
    }
  };

  const addSlot = () => setGallery([...gallery, null]);

  const handleNext = () => {
    // ✅ WICHTIG: Hier werden die Bilder final in den globalen Context übertragen
    // Wir filtern die Gallery, damit keine "null" Werte in die Summary kommen
    const finalGallery = gallery.filter((img): img is string => img !== null);
    
    updateProfile({ 
      name, 
      jobTitle, 
      location, 
      bio,
      profileImage: profileImage || undefined,
      gallery: finalGallery
    });
    
    navigate('/talent-profile-setup-2');
  };

  return (
    <div className="min-h-screen bg-white text-black pb-20 font-sans antialiased">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center z-50">
        <button 
          type="button"
          onClick={() => navigate(-1)} 
          className="absolute left-4 p-2 hover:bg-gray-50 rounded-full transition-colors z-[60]"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="w-full text-center text-[17px] font-medium text-gray-900">
          Profil erstellen
        </h1>
      </div>

      <div className="max-w-[480px] mx-auto px-6 py-10 space-y-12">
        
        {/* Avatar Section */}
        <section className="flex flex-col items-center gap-3">
          <div className="relative w-32 h-32">
            <div className="w-full h-full rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Plus className="w-8 h-8 text-gray-200" />
              )}
            </div>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setProfileImage(URL.createObjectURL(file));
            }} />
          </div>
          <span className="text-[14px] text-gray-400 font-medium">Foto hinzufügen</span>
        </section>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[15px] font-medium block px-1 text-gray-900">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] outline-none focus:border-black transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-[15px] font-medium block px-1 text-gray-900">Beruf</label>
            <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] outline-none focus:border-black transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-[15px] font-medium block px-1 text-gray-900">Standort</label>
            <div className="relative">
              <select value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] outline-none appearance-none bg-white focus:border-black transition-colors">
                <option value="" disabled>Stadt wählen</option>
                {germanCities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-col gap-0.5 px-1">
               <label className="text-[15px] font-medium text-gray-900">Kurze Bio</label>
               <span className="text-[12px] text-gray-400 font-normal mb-2">Leichter • Optional</span>
            </div>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5}
              className="w-full border border-gray-200 rounded-2xl p-4 text-[15px] leading-relaxed outline-none focus:border-black resize-none transition-colors" />
          </div>
        </div>

        {/* Portfolio */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900">Portfolio</h2>
            <p className="text-gray-400 text-[14px]">Zeig dich so, wie du wirklich bist.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {gallery.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100">
                {img ? (
                  <>
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    {index === 0 && (
                      <div className="absolute bottom-3 left-3 bg-black text-white text-[10px] px-2 py-1 rounded font-bold uppercase z-10">
                        Hauptbild
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center text-[12px] font-bold shadow-sm">
                      {index + 1}
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 rounded-[24px] hover:bg-gray-100 transition-colors">
                    <Plus className="w-8 h-8 text-gray-200" />
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(index, e)} />
                  </label>
                )}
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={addSlot}
            className="flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-black transition-colors"
          >
            <Plus className="w-4 h-4" /> Weitere Beispiele hinzufügen
          </button>
        </section>

        {/* Info-Teil */}
        <div className="bg-gray-50 rounded-[24px] p-6 flex gap-4 border border-gray-100">
           <div className="bg-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-[14px]">i</span>
           </div>
           <div className="space-y-1">
              <p className="font-bold text-[15px] text-gray-900">Perfekt.</p>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Sieht super aus – deine Fotos sind in guter Qualität und spiegeln dich authentisch wider.
              </p>
           </div>
        </div>

        {/* Button */}
        <button onClick={handleNext}
          className="w-full bg-black text-white py-4.5 rounded-2xl font-medium text-[15px] hover:bg-zinc-800 transition-all active:scale-[0.98] ">
          Step 1/3
        </button>
      </div>
    </div>
  );
}