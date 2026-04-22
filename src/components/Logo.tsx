import { Cherry } from 'lucide-react';

interface LogoProps {
  color?: string;
  // Wir geben der Komponente die Möglichkeit, CSS-Klassen von außen zu empfangen
  className?: string; 
}

export function Logo({ color = '#2A6087', className = "" }: LogoProps) {
  return (
    /* Hier passiert die Magie: 
       'absolute top-8 left-8 z-30' ist jetzt der Standard. 
       ${className} erlaubt es uns, das von außen zu ergänzen oder zu ändern.
    */
    <div className={`absolute top-8 left-8 z-30 ${className}`}>
      <h2 
        className="text-2xl tracking-[0.3em] uppercase flex items-center gap-1 font-bold" 
        style={{ color: color }}
      >
        CHE<Cherry className="w-6 h-6" />Y
      </h2>
    </div>
  );
}