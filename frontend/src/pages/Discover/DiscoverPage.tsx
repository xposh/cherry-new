import { Search, SlidersHorizontal, MapPin, Sparkles, X } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useState, useMemo } from "react";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { Logo } from "../../components/Logo";

// Datensatz erweitert um die Felder für die Filter-Logik
const cards = [
  {
    id: 1,
    image: "/Photographer/IMG_4417.JPG",
    name: "Marcus Klein",
    role: "Photographer",
    city: "Hamburg",
    experience: "Senior (5-8 years)",
    model: "Office",
    match: true,
  },
  {
    id: 2,
    image: "/barkeeper-sommelier/IMG_4431.JPG",
    name: "Jason Brick",
    role: "Sommelier",
    city: "Berlin",
    experience: "Mid (3-5 years)",
    model: "Hybrid",
  },
  {
    id: 3,
    image: "/barkeeper-sommelier/IMG_4435.JPG",
    name: "Steven Cole",
    role: "Bar Manager",
    city: "Frankfurt",
    experience: "Expert (8+ years)",
    model: "Office",
  },
  {
    id: 4,
    image: "/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg",
    name: "Danni Chang",
    role: "Head Chef",
    city: "Berlin",
    experience: "Senior (5-8 years)",
    model: "Office",
    match: true,
  },
  {
    id: 5,
    image: "/barista/brent-gorwin-vhQUnmnOLys-unsplash.jpg",
    name: "Emma Ford",
    role: "Barista",
    city: "Köln",
    experience: "Junior (0-2 years)",
    model: "Remote",
  },
  {
    id: 6,
    image: "/pilates/Pilates Black 1.png",
    name: "Zara Makovic",
    role: "Pilates Instructor",
    city: "Hamburg",
    experience: "Mid (3-5 years)",
    model: "Hybrid",
  },
];

export function DiscoverPage() {
  const navigate = useNavigate();

  // --- LOGIK-BLOCK ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Zentraler Filter-State für einfache Backend-Anbindung
  const [filters, setFilters] = useState({
    role: "",
    city: "",
    experience: "All levels",
    models: [] as string[],
  });

  // Kombinierte Filter-Funktion (Searchbar + Sidebar)
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const s = searchQuery.toLowerCase();
      // Suche über Name, Rolle oder Stadt
      const matchesSearch =
        card.name.toLowerCase().includes(s) ||
        card.role.toLowerCase().includes(s) ||
        card.city.toLowerCase().includes(s);

      // Abgleich mit den Sidebar-Filtern
      const matchesRole =
        filters.role === "" ||
        card.role.toLowerCase().includes(filters.role.toLowerCase());
      const matchesCity =
        filters.city === "" ||
        card.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesExp =
        filters.experience === "All levels" ||
        card.experience === filters.experience;
      const matchesModel =
        filters.models.length === 0 || filters.models.includes(card.model);

      return (
        matchesSearch &&
        matchesRole &&
        matchesCity &&
        matchesExp &&
        matchesModel
      );
    });
  }, [searchQuery, filters]);

  // DEINE ONCLICK LOGIK (Wiederhergestellt)
  const handleProfileClick = (e: React.MouseEvent, profileId: string) => {
    e.preventDefault();
    if (activeProfileId === profileId) {
      // Zweiter Klick -> Navigation zur dynamischen ID
      navigate(`/talent/${profileId}`);
    } else {
      // Erster Klick -> Zeigt Details (Hover-Zustand fixieren)
      setActiveProfileId(profileId);
    }
  };

  const toggleModel = (model: string) => {
    setFilters((prev) => ({
      ...prev,
      models: prev.models.includes(model)
        ? prev.models.filter((m) => m !== model)
        : [...prev.models, model],
    }));
  };

  // Funktion zum Zurücksetzen aller Filter- und Suchzustände
  const resetFilters = () => {
    setSearchQuery(""); // Leert das Suchfeld
    setFilters({
      // Setzt das Filter-Objekt auf Initialwerte
      role: "",
      city: "",
      experience: "All levels",
      models: [],
    });
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden font-['Helvetica_Neue',sans-serif]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 pt-20">
        <div className="mx-auto max-w-[520px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for talents..."
              className="w-full h-14 border border-white/30 bg-transparent pl-12 pr-14 outline-none placeholder:text-white/50 backdrop-blur-[2px]"
            />
            <button
              onClick={() => setShowFilter(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
          {/* Logo */}

          <Link to="/">
            <Logo className="fixed" />
          </Link>
        </div>
      </header>

      {/* GRID */}
      <section className="columns-2 md:columns-3 lg:columns-4 gap-0 pt-0">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={(e) => handleProfileClick(e, card.id.toString())}
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

            {/* Sichtbarkeit gesteuert durch Hover ODER aktiven State (erster Tap) */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 transition duration-300 ${activeProfileId === card.id.toString() ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"}`}
            >
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

      {/* SIDEBAR */}
      {showFilter && (
        <>
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
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={filters.role}
                    onChange={(e) =>
                      setFilters({ ...filters, role: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white outline-none focus:border-white/40 transition-colors"
                    placeholder="e.g. Chef"
                  />
                </div>

                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters({ ...filters, city: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white outline-none focus:border-white/40 transition-colors"
                    placeholder="City or Remote"
                  />
                </div>

                <div>
                  <label className="text-sm font-light text-white/80 block mb-2">
                    Experience
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) =>
                      setFilters({ ...filters, experience: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white focus:border-white/40 focus:outline-none transition-colors appearance-none"
                  >
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
                      <label
                        key={model}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.models.includes(model)}
                          onChange={() => toggleModel(model)}
                          className="bg-white/5 border-white/20"
                        />
                        <span className="text-sm font-light text-white/70">
                          {model}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="w-full py-3 bg-white/10 border border-white/20 text-white uppercase tracking-wider hover:bg-white/20 transition-all"
                  >
                    Apply Filters
                  </button>

                  {/* Reset Button */}
                  <button
                    onClick={resetFilters}
                    className="w-full py-2 text-xs text-white/50 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
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
