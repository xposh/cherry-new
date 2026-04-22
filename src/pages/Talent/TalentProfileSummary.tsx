import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as Lucide from 'lucide-react'; 
import { useProfile } from "../../context/ProfileContext";

export function TalentProfileSummary() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Da Marken-Icons in v1 entfernt wurden, nutzen wir hier direkt SVGs
  const socialIconMap: Record<string, JSX.Element> = {
    Linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
    ),
    Github: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
    ),
    Instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
    ),
    Twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    ),
    Globe: <Lucide.Globe size={18} strokeWidth={1} />
  };

  const projectSlides = (profile.gallery || []).map((img) => ({
    url: img,
    type: 'project' as const,
    caption: profile.specialties
  }));

  const allSlides = [
    ...projectSlides,
    ...(profile.profileImage ? [{ url: profile.profileImage, type: 'profile' as const }] : []),
    { type: 'details' as const }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const index = Math.round(scrollRef.current.scrollTop / window.innerHeight);
        setCurrentIndex(index);
      }
    };
    const el = scrollRef.current;
    el?.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-sans antialiased text-white">
      
      {/* HEADER: Progress & Logo */}
      <div className="fixed top-0 left-0 right-0 z-[60] px-6 py-10 flex flex-col gap-6 pointer-events-none">
        <div className="flex gap-1.5 h-[2px] w-full max-w-md mx-auto">
          {allSlides.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-300 ${i === currentIndex ? 'bg-white' : 'bg-white/20'}`} 
            />
          ))}
        </div>
        <div className="pointer-events-auto">
          <h2 className="text-xl tracking-[0.3em] uppercase flex items-center gap-1 font-bold" style={{ color: '#2A6087' }}>
            CHE<Lucide.Cherry className="w-5 h-5" />Y
          </h2>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        {allSlides.map((slide, i) => {
          if (slide.type === 'project' || slide.type === 'profile') {
            return (
              <div key={`slide-${i}`} className="h-screen w-full snap-start relative flex flex-col justify-end p-8 pb-32">
                {slide.url && <img src={slide.url} className="absolute inset-0 w-full h-full object-cover" alt="" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="relative z-10 space-y-4">
                  {slide.type === 'project' ? (
                    <p className="text-xl font-light italic leading-relaxed max-w-xl text-white/90">
                      {slide.caption ? `"${slide.caption}"` : ""}
                    </p>
                  ) : (
                    <>
                      <h1 className="text-5xl font-bold tracking-tight uppercase italic">{profile.name}</h1>
                      <p className="text-2xl text-white/60 font-light">{profile.experienceYears} Jahre Erfahrung</p>
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex items-center gap-2 text-white/80">
                            <span className="text-white/40 uppercase text-[10px] font-bold tracking-widest">Position:</span>
                            <span className="text-[15px]">{profile.jobTitle}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <Lucide.MapPin size={16} className="text-[#2A6087]" /> 
                          <span className="text-[15px]">{profile.location}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={`details-${i}`} className="min-h-screen w-full snap-start bg-black p-8 pt-32 pb-48 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-12">
                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">About</h2>
                  <p className="text-lg font-light text-white/90 leading-relaxed italic">{profile.bio}</p>
                </section>

                <section>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Experience</h2>
                  <div className="space-y-8 border-l border-white/10 pl-6">
                    <div>
                        <h3 className="text-xl font-medium">{profile.jobTitle}</h3>
                        <p className="text-[#2A6087] font-bold text-sm uppercase tracking-wider">{profile.formerWorkplace}</p>
                    </div>
                  </div>
                </section>

                <section className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Network</h2>
                        <div className="space-y-4">
                            {(profile.socialLinks || []).map((link, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                                    {socialIconMap[link.platform] || <Lucide.Globe size={18} />}
                                    <span className="text-sm font-light truncate">{link.url.replace(/(^\w+:|^)\/\//, '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Contact</h2>
                        <div className="space-y-4 text-white/50">
                            {profile.email && (
                                <div className="flex items-center gap-3">
                                    <Lucide.Mail size={18} strokeWidth={1} />
                                    <span className="text-sm font-light">{profile.email}</span>
                                </div>
                            )}
                            {profile.phone && (
                                <div className="flex items-center gap-3">
                                    <Lucide.Phone size={18} strokeWidth={1} />
                                    <span className="text-sm font-light">{profile.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 z-[100] bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-4">
        <button 
          onClick={() => navigate('/talent-profile-setup-1')}
          className="w-full bg-white text-black py-5 rounded-[20px] font-bold uppercase text-[12px] tracking-[0.3em] shadow-2xl"
        >
          Profil bearbeiten
        </button>
      </div>
    </div>
  );
}