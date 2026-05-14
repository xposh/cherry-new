/* Speichert:
- allProfiles (alle verfügbaren Profile)
- filteredProfiles (nach Filter/Suche)
- searchQuery (Suchtext)
- selectedCategory (gewählte Kategorie)
- filters (weitere Filter)

Funktionen:
- setSearchQuery(query)
- setCategory(category)
- applyFilters()
*/

import { createContext, useContext, useState, type ReactNode } from "react";

interface DiscoverContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  clearFilters: () => void;
  viewedProfiles: string[];
  markAsViewed: (id: string) => void;
}

const DiscoverContext = createContext<DiscoverContextType | undefined>(
  undefined,
);

export function DiscoverProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  const markAsViewed = (id: string) => {
    setViewedProfiles((prev) => [...new Set([...prev, id])]);
  };

  return (
    <DiscoverContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategories,
        toggleCategory,
        clearFilters,
        viewedProfiles,
        markAsViewed,
      }}
    >
      {children}
    </DiscoverContext.Provider>
  );
}

export function useDiscover() {
  const context = useContext(DiscoverContext);
  if (!context) {
    throw new Error("useDiscover must be used within DiscoverProvider");
  }
  return context;
}
