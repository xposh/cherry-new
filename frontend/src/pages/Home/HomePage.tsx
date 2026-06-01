import { useAuth } from "../../context/useAuth";
import { TalentHomePage } from "./TalentHomePage";
import { CompanyHomePage } from "./CompanyHomePage";

export function HomePage() {
  const { user } = useAuth();

  // Route based on user role
  if (user?.role === "talent") {
    return <TalentHomePage />;
  } else if (user?.role === "company") {
    return <CompanyHomePage />;
  }

  // Fallback (should not happen with ProtectedRoute)
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );
}
