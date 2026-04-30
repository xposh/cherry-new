import { Search, SlidersHorizontal } from "lucide-react";
import { BottomNavigation } from "../../components/navigation/BottomNavigation";
import { Logo } from "../../components/Logo";

const cards = [
  { id: 1, image: "/Photographer/IMG_4417.JPG" },
  { id: 2, image: "/barkeeper-sommelier/IMG_4431.JPG" },
  { id: 3, image: "/barkeeper-sommelier/IMG_4435.JPG" },
  { id: 4, image: "/chef-restaurant/joshua-hoehne-t4WnlmQtUnE-unsplash.jpg" },
  { id: 5, image: "/barista/brent-gorwin-vhQUnmnOLys-unsplash.jpg" },
  { id: 6, image: "/pilates/Pilates Black 1.png" },
];

export function DiscoverPage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden font-['Helvetica_Neue',sans-serif]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 pt-5">
        <div className="mx-auto max-w-[520px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />

            <input
              type="text"
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

      {/* PERFECT GAPLESS MASONRY */}
      <section className="columns-2 md:columns-3 lg:columns-4 gap-0 pt-0">
        {cards.map((card) => (
          <div key={card.id} className="mb-0 break-inside-avoid">
            <img src={card.image} alt="" className="w-full block" />
          </div>
        ))}
      </section>

      {/* OVERLAY */}
      <div className="fixed inset-0 bg-black/45 z-10 pointer-events-none" />

      {/* NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNavigation />
      </div>
    </main>
  );
}
