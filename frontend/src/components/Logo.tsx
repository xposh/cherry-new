import { Cherry } from "lucide-react";
import { Link } from "react-router";

interface LogoProps {
  color?: string;
  // Wir geben der Komponente die Möglichkeit, CSS-Klassen von außen zu empfangen
  className?: string;
  // Optional target path — defaults to the opener/home page
  to?: string;
}

export function Logo({
  color = "#FEF6EA",
  className = "",
  to = "/home",
}: LogoProps) {
  return (
    <div className={`fixed top-22 left-16 z-30 ${className}`}>
      <Link to={to}>
        <h2
          className="text-2xl tracking-[0.3em] uppercase flex items-center gap-1 font-bold"
          style={{ color: color }}
        >
          CHE
          <Cherry className="w-6 h-6" />Y
        </h2>
      </Link>
    </div>
  );
}
