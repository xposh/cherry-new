import { Outlet } from "react-router";
import { MatchProvider } from "../context/MatchContext";

export function RootLayout() {
  return (
    <MatchProvider>
      <Outlet />
    </MatchProvider>
  );
}
