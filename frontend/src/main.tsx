import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Pfad zur Routen-Konfiguration
import { routes } from "./routes/index.tsx";
// KORREKTUR: Wir nutzen das moderne Paket ohne "-dom" Suffix
import { RouterProvider } from "react-router";
// Context Provider für die Datenhaltung
import { ProfileProvider } from "./context/ProfileContext.tsx";
import { CompanyProfileProvider } from "./context/CompanyProfileContext.tsx";
import { AuthProvider } from "./context/AuthProvider";
import { DiscoverProvider } from "./context/DiscoverContext.tsx";
import { MatchProvider } from "./context/MatchContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProfileProvider>
      <CompanyProfileProvider>
        <AuthProvider>
          <DiscoverProvider>
            <MatchProvider>
              <RouterProvider router={routes} />
            </MatchProvider>
          </DiscoverProvider>
        </AuthProvider>
      </CompanyProfileProvider>
    </ProfileProvider>
  </StrictMode>,
);
