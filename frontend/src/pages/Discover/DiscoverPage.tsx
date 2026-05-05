import { Search, SlidersHorizontal, MapPin, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react"; // NEU: Import für den Zustand
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { Logo } from "../../components/Logo";

const cards = [
  {
    id: 1,
    image: "/Photographer/IMG_4417.JPG",
    name: "Marcus Klein",
    role: "Photographer",
    city: "Hamburg",
    match: true,
  },
  {
    id: 2,
    image: "/barkeeper-sommelier/IMG_4431.JPG",
    name: "Jason Brick",
    role: "Sommelier",
    city: "Berlin",
  },
  {
    id: 3,
    image: "/barkeeper-sommelier/IMG_4435.JPG",
    name: "Steven Cole",
    role: "Bar Manager",
    city: "Frankfurt",
  },
  {
    id: 4,
    image: "/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg",
    name: "Danni Chang",
    role: "Head Chef",
    city: "Berlin",
    match: true,
  },
  {
    id: 5,
    image: "/barista/brent-gorwin-vhQUnmnOLys-unsplash.jpg",
    name: "Emma Ford",
    role: "Barista",
    city: "Köln",
  },
  {
    id: 6,
    image: "/pilates/Pilates Black 1.png",
    name: "Zara Makovic",
    role: "Pilates Instructor",
    city: "Hamburg",
  },
];

export function DiscoverPage() {
  const navigate = useNavigate();

  // --- LOGIK-BLOCK START ---

  // 1. Wir speichern den aktuellen Suchbegriff im State
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Wir steuern, ob die Filter-Sidebar offen ist
  const [showFilter, setShowFilter] = useState(false);

  // 3. WICHTIG: Die Filter-Funktion
  // Wir erstellen eine neue Liste basierend auf der Suche.
  // Wir wandeln alles in .toLowerCase() um, damit "Chef" auch "chef" findet.
  const filteredCards = cards.filter((card) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      card.name.toLowerCase().includes(searchLower) ||
      card.role.toLowerCase().includes(searchLower) ||
      card.city.toLowerCase().includes(searchLower)
    );
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  const handleProfileClick = (e: React.MouseEvent, profileId: string) => {
    e.preventDefault(); // Verhindert das Standardverhalten (z.B. Link-Navigation)

    if (activeProfileId === profileId) {
      // Second tap - navigate to profile
      navigate(`/talent/${profileId}`); // Hier musst du die tatsächliche ID einsetzen
    } else {
      // First tap - show details
      setActiveProfileId(profileId);
    }
  };

  // --- LOGIK-BLOCK ENDE ---

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden font-['Helvetica_Neue',sans-serif]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 pt-5">
        <div className="mx-auto max-w-[520px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />

            {/* INPUT ERKLÄRUNG:
                value={searchQuery} verknüpft das Feld mit unserem State.
                onChange aktualisiert den State bei jedem Tastendruck. */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for talents..."
              className="w-full h-14 border border-white/30 bg-transparent pl-12 pr-14 outline-none placeholder:text-white/50 backdrop-blur-[2px]"
            />

            {/* FILTER BUTTON: Öffnet bei Klick die Sidebar */}
            <button
              onClick={() => setShowFilter(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="mt-5">
            <Logo className="!relative !top-0 !left-0" />
          </div>
        </div>
      </header>

      {/* GRID: Wir rendern jetzt 'filteredCards' statt 'cards' */}
      <section className="columns-2 md:columns-3 lg:columns-4 gap-0 pt-0">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={(e) => handleProfileClick(e, card.id.toString())} // Hier übergeben wir die ID als String")}
            className="relative break-inside-avoid mb-0 cursor-pointer group overflow-hidden"
          >
            <img
              src={card.image}
              alt={card.name}
              className="w-full block object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition duration-300" />

            {card.match && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-[10px] tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2A6087]" />
                Match
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
              <h3 className="text-white text-[18px] font-medium">
                {card.name}
              </h3>
              <p className="text-white/80 text-sm">{card.role}</p>
              <div className="flex items-center gap-1 mt-1 text-white/70 text-xs">
                <MapPin className="w-3 h-3" />
                {card.city}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SIDEBAR LOGIK (Deine Vermutung war absolut richtig!) */}
      {showFilter && (
        <>
          {/* Overlay schließt bei Klick die Sidebar */}
          <div
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            onClick={() => setShowFilter(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-black border-l border-white/20 z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-light text-white uppercase tracking-wider">
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-white/60"
                >
                  ✕
                </button>
              </div>

              {/* Hier kommen deine Filter-Optionen rein (Role, Location, etc.) */}
              <div className="space-y-6">
                {/* Beispiel: Role Filter */}
                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white outline-none"
                    placeholder="e.g. Chef"
                  />
                </div>

                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City or Remote"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Experience
                  </label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white focus:border-white/40 focus:outline-none transition-colors appearance-none">
                    <option className="bg-black">All levels</option>
                    <option className="bg-black">Junior (0-2 years)</option>
                    <option className="bg-black">Mid (3-5 years)</option>
                    <option className="bg-black">Senior (5-8 years)</option>
                    <option className="bg-black">Expert (8+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Work Model
                  </label>
                  <div className="space-y-2">
                    {["Remote", "Office", "Hybrid"].map((model) => (
                      <label key={model} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="bg-white/5 border-white/20"
                        />
                        <span className="text-sm font-light text-white/70">
                          {model}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 bg-white/10 border border-white/20 text-white uppercase tracking-wider">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNavigation />
      </div>
    </main>
  );
}
