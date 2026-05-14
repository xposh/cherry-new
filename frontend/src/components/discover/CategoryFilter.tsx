import { useDiscover } from "../../context/DiscoverContext";
import { useAuth } from "../../context/useAuth";

export function CategoryFilter() {
  const { selectedCategories, toggleCategory, clearFilters } = useDiscover();
  const { user } = useAuth();

  // Categories based on user role
  const talentCategories = [
    "Design",
    "Development",
    "Marketing",
    "Sales",
    "Product",
    "HR",
    "Data",
  ];

  const companyCategories = [
    "Software",
    "Marketing",
    "Finance",
    "Healthcare",
    "E-Commerce",
    "Education",
    "Energie",
    "Logistik",
  ];

  if (!user) {
    console.log("user not logged in");
    return null;
  }

  const categories =
    user.role === "employer" ? talentCategories : companyCategories;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white/60 uppercase tracking-wider text-xs font-light">
          Filter
        </h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
              selectedCategories.includes(category)
                ? "bg-white text-black"
                : "bg-white/10 text-white border border-white/20 hover:border-white/40"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
