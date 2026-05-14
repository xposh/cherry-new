import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Outlet } from "react-router";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-black pb-20">
      <main>
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
