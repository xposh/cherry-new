// 1. IMPORT-BEREICH (Die Werkzeugkiste)
// useState: Ein "Speicherplatz" für Daten, die sich während der Laufzeit ändern (z.B. die aktuelle Slide-Nummer).
// useEffect: Wird genutzt, um "Nebenwirkungen" zu steuern, wie z.B. einen Timer, der außerhalb des Klick-Flusses läuft.
import { useState, useEffect } from 'react';
// Link: Ein spezieller Anker-Tag von React-Router, der die Seite wechselt, ohne den Browser neu zu laden.
import { Link } from 'react-router';
// Logo: Deine neue, eigenständige Komponente für das Branding.
import { Logo } from '../components/Logo';

// 2. DATEN-STRUKTUR (Das Gehirn)
// Wir speichern alles in einem "Array" (eine Liste in eckigen Klammern []).
// Jedes Objekt {} in der Liste repräsentiert eine Seite.
const SLIDES = [
  {
    image: '/architect/architect-painting.png', // Pfad zum Bild im public-Ordner.
    heading: ['Pick', 'your', 'Cherry'],       // Array für die Überschrift, um Wörter einzeln zu stylen.
    subheading: '"Finde den perfekten Jobpartner"', 
    overlay: 'bg-black/45',                    // Tailwind-Klasse für die Verdunklung (45% Schwarz).
  },
  {
    image: '/architect/architect-drawing.png',
    heading: ['Finde', 'deinen', 'Traumjob'],
    subheading: '"Pick your cherry"',
    overlay: 'bg-black/70',
  },
  {
    image: '/architect/man-in-black.png',
    heading: ['Finde', 'deinen', 'Traumjob'],
    subheading: '"Pick your cherry"',
    overlay: 'bg-black/40',
  },
];

export function WelcomeSlides() {
  // 3. STATE (Der aktuelle Zustand)
  // currentSlide: Die Variable, die die Zahl der aktuellen Slide hält (startet bei 0).
  // setCurrentSlide: Die einzige Funktion, die 'currentSlide' verändern darf.
  const [currentSlide, setCurrentSlide] = useState(0);

  // 4. DER AUTOMATISMUS (Timer)
  useEffect(() => {
    // setInterval: Eine Browser-Funktion, die einen Block immer wieder ausführt.
    const interval = setInterval(() => {
      // Modulo (%) ist der "Loop-Trick": (0+1)%3=1, (1+1)%3=2, (2+1)%3=0.
      // So verhindern wir, dass die Zahl ins Unendliche steigt.
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // 5000 Millisekunden = 5 Sekunden.

    // Cleanup-Funktion: Stoppt den Timer, wenn die Komponente gelöscht wird.
    // Ohne das würde der Timer im Hintergrund weiterlaufen und die App crashen lassen.
    return () => clearInterval(interval);
  }, []); // Das leere [] bedeutet: "Starte diesen Timer nur einmal, wenn die Seite lädt."

  // Helfer-Variable: Wir ziehen uns das aktuelle Daten-Objekt aus der Liste.
  const slide = SLIDES[currentSlide];

  return (
    // 5. DAS GERÜST (CSS Architektur)
    // relative: Erlaubt es, Elemente (wie Bilder) darin absolut zu positionieren.
    // min-h-screen: Erzwingt mindestens die volle Höhe des Bildschirms.
    // items-end: Schiebt den Inhalt auf dem Handy nach unten.
    <div className="relative min-h-screen w-full flex items-end md:items-center justify-center overflow-hidden bg-white font-sans">
      
      {/* 6. LOGO (Z-Index 30 - Ganz oben) */}
      {/* Wir nutzen hier deine neue Komponente. Die Positionierung top-8 left-8 
          und der z-Index sind jetzt in der Logo.tsx Datei fest verbaut. */}
      <Logo />

      {/* 7. BILDER-LAYER (Z-Index 0) */}
      <div className="absolute inset-0 z-0">
        {/* .map: Wir gehen die SLIDES-Liste durch und erstellen für jeden Eintrag ein <div> */}
        {SLIDES.map((s, index) => (
          <div
            key={index} // Einzigartiger Schlüssel für React zur Identifizierung.
            // transition-opacity duration-1000: Das "Faden" dauert genau 1 Sekunde.
            // Wenn der Index der Liste mit 'currentSlide' übereinstimmt, wird es sichtbar (opacity-100).
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={s.image}
              className="w-full h-full object-cover" // object-cover: Bild füllt alles aus ohne Verzerrung.
              alt="Background"
            />
          </div>
        ))}
        {/* DYNAMISCHES OVERLAY: Wechselt die Farbe/Dunkelheit passend zum Bild. */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${slide.overlay}`} />
      </div>

      {/* 8. CONTENT (Der Textbereich) */}
      <div className="relative z-10 w-full px-6 py-12 md:py-0 md:max-w-2xl md:ml-12 lg:ml-24 text-left">
        
        {/* ÜBERSCHRIFT: Nutzt 'block', damit jedes Wort eine neue Zeile beginnt (Figma Style) */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[1.1] font-bold" style={{ color: '#2A6087' }}>
          {slide.heading[0]}
          {/* Nur wenn ein zweites/drittes Wort existiert, wird das Element gerendert. */}
          {slide.heading[1] && <span className="block mt-2">{slide.heading[1]}</span>}
          {slide.heading[2] && <span className="block mt-2">{slide.heading[2]}</span>}
        </h1>

        <p className="text-base md:text-lg mb-12 max-w-md leading-relaxed italic text-white/70">
          {slide.subheading}
        </p>

      {/* 9. BUTTONS */}
      <div className="flex flex-col w-full max-w-sm gap-4 mb-8">
        <Link to="/signup" className="w-full">
          {/* ERKLÄRUNG:
        bg-black/70: Ein sattes Schwarz mit 70% Sichtbarkeit. Das wirkt massiver als der Blur.
        hover:bg-[#2A6087]: Beim Drüberfahren wechselt er zu deinem Cherry-Blau aus Figma.
        text-white: Weißer Text für harten Kontrast.
        font-bold: Die dicke Schriftstärke für maximale Aufmerksamkeit.
        rounded-none: Damit der Button eckig bleibt, wie in deinem letzten Code-Schnipsel.
          */}
          <button className="w-full bg-black/50 hover:bg-[#708090]/50 text-[#f5f5f5] text-base py-5 transition-all duration-300 border border-white/10 font-medium rounded-none">
            Registrieren
          </button>
        </Link>

        <Link to="/login" className="w-full">
          {/* ERKLÄRUNG:
              border-2 border-white: Weißer Rahmen.
              hover:bg-white hover:text-black: Invertiert die Farben beim Hovern (Weißer Hintergrund, schwarzer Text).
          */}
          <button className="w-full border-1 border-white bg-transparent hover:bg-[#708090]/50 hover:text-white text-[#777676] text-base py-5 transition-all duration-300 font-medium">
            Login
          </button>
        </Link>
      </div>

        {/* 10. KLEINGEDRUCKTES */}
        <p className="text-[10px] text-white/50 max-w-sm leading-relaxed">
          Mit der Anmeldung stimmst du unseren <button className="underline">AGB</button> zu.
        </p>
      </div>

      {/* 11. INDICATORS (Die Punkte) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)} // Erlaubt manuelles Klicken auf die Punkte.
            // Wenn aktiv: Breit (w-8) und hellweiß. Wenn inaktiv: Kleiner Punkt (w-2) und transparent.
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/30 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}