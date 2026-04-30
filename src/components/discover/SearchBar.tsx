import { Search, X } from "lucide-react";
import { useDiscover } from "../../context/DiscoverContext";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useDiscover();

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Suche nach Skills, Standort, Unternehmen..."
        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-white/60 transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
