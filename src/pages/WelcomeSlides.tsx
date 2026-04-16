// 1. IMPORT-BEREICH
// useState: Merkt sich, welches Bild gerade aktiv ist.
// useEffect: Startet den automatischen Wechsel (Timer).
import { useState, useEffect } from "react";

// 2. DATEN-STRUKTUR (Festgelegt)
// Wir speichern die Infos in einer Liste (Array), damit wir sie später leicht ändern können.
const SLIDES = [
  {
    id: 1,
    img: "/architect/architect-painting.png",
    title: "Pick your Cherry",
    sub: "Finde den perfekten Jobpartner",
  },
  {
    id: 2,
    img: "/architect/architect-drawing.png",
    title: "Finde deinen Job",
    sub: "Pick your Cherry",
  },
  {
    id: 3,
    img: "/architect/man-in-black.png",
    title: "Netzwerke",
    sub: "Verbinde dich mit den Besten",
  },
];

export function WelcomeSlides() {
  // 3. DER STATE (Zustand)
  // 'current' ist die Nummer des Bildes (0, 1 oder 2).
  // 'setCurrent' ist die Funktion, um diese Nummer zu ändern.
  const [current, setCurrent] = useState(0);

  // 4. DER TIMER (Logik)
  useEffect(() => {
    // setInterval führt den Code alle 4000ms (4 Sek) aus.
    const timer = setInterval(() => {
      // Modulo (%) sorgt dafür, dass nach Bild 3 wieder Bild 1 kommt.
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    // Cleanup: Wenn wir die Seite verlassen, stoppen wir den Timer (Wichtig gegen Abstürze!)
    return () => clearInterval(timer);
  }, []);

  return (
    // 5. DAS LAYOUT (HTML/CSS)
    // fixed inset-0: Zwingt den Container auf die volle Monitorgröße.
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden font-sans">
      {/* HINTERGRUND-SCHICHT */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          // transition-opacity duration-1000: Das weiche Überblenden (1 Sekunde).
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.img}
            className="w-full h-full object-cover"
            alt="Background"
          />
          {/* OVERLAY: bg-black/60 macht es dunkler als vorher (/40), damit der Text "poppt". */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      {/* VORDERGRUND-SCHICHT (Text & Buttons) */}
      {/* p-6 bis p-12 macht es responsive für Mobile/Desktop */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16 pb-12">
        {/* TEXT-BLOCK */}
        <div className="mb-10">
          <h1 className="text-white text-5xl md:text-7xl font-bold mb-2 tracking-tight">
            {SLIDES[current].title}
          </h1>
          <p className="text-white/80 text-lg md:text-xl italic">
            "{SLIDES[current].sub}"
          </p>
        </div>

        {/* BUTTONS & RECHTLICHES */}
        <div className="flex flex-col gap-4 max-w-sm w-full">
          <button className="bg-primary hover:bg-primary/90 text-white py-4 px-8 font-bold rounded-sm transition-all active:scale-95">
            Konto erstellen
          </button>

          <button className="border border-white/50 text-white py-4 px-8 font-bold rounded-sm hover:bg-white/10 transition-all">
            Anmelden
          </button>

          {/* DATENSCHUTZ TEXT UNTEN */}
          <p className="text-white/40 text-[10px] leading-tight mt-4">
            Durch die Registrierung stimmst du unseren{" "}
            <span className="underline cursor-pointer">AGB</span> und{" "}
            <span className="underline cursor-pointer">
              Datenschutzbestimmungen
            </span>{" "}
            zu.
          </p>
        </div>
      </div>
    </div>
  );
}
