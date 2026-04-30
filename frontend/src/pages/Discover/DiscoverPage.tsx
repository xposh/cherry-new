import { Search, SlidersHorizontal, MapPin, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
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

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden font-['Helvetica_Neue',sans-serif]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 pt-5">
        <div className="mx-auto max-w-[520px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />

            <input
              placeholder="Search for talents..."
              className="w-full h-14 border border-white/30 bg-transparent pl-12 pr-14 outline-none placeholder:text-white/50 backdrop-blur-[2px]"
            />

            <button className="absolute right-4 top-1/2 -translate-y-1/2">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="mt-5">
            <Logo className="!relative !top-0 !left-0" />
          </div>
        </div>
      </header>

      {/* GRID */}
      <section className="columns-2 md:columns-3 lg:columns-4 gap-0 pt-0">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate("/talent-profile")}
            className="relative break-inside-avoid mb-0 cursor-pointer group overflow-hidden"
          >
            <img
              src={card.image}
              alt=""
              className="w-full block object-cover transition duration-500 group-hover:scale-[1.03]"
            />

            {/* dark overlay */}
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition duration-300" />

            {/* badge */}
            {card.match && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-[10px] tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2A6087]" />
                Match
              </div>
            )}

            {/* content */}
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

      {/* GLOBAL OVERLAY */}
      <div className="fixed inset-0 pointer-events-none bg-black/20 z-10" />

      {/* NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNavigation />
      </div>
    </main>
  );
}
