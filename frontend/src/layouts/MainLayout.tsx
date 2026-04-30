import { ReactNode } from "react";
import { BottomNavigation } from "../components/navigation/BottomNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-black pb-20">
      <main>{children}</main>
      <BottomNavigation />
    </div>
  );
}
