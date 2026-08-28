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
// ✅ MatchProvider wurde hieraus entfernt — er wird jetzt im Root-Layout der
// Routes eingebunden, damit useNavigate() einen aktiven Router-Context vorfindet.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProfileProvider>
      <CompanyProfileProvider>
        <AuthProvider>
          <DiscoverProvider>
            <RouterProvider router={routes} />
          </DiscoverProvider>
        </AuthProvider>
      </CompanyProfileProvider>
    </ProfileProvider>
  </StrictMode>,
);
