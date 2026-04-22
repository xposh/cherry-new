import { createBrowserRouter } from 'react-router';
// Importiere deine Komponenten hier (Pfade ggf. anpassen)
import { TalentProfileSetup1 } from "../pages//Talent/TalentProfileSetup1";
import { TalentProfileSetup2 } from "../pages//Talent/TalentProfileSetup2"; 
import { TalentProfileSetup3 } from "../pages/Talent/TalentProfileSetup3"; 
import { TalentProfileSummary } from "../pages/Talent/TalentProfileSummary"; // Beispiel für die Profilübersicht nach Setup

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <TalentProfileSetup1 />,
  },
  {
    path: "/talent-profile-setup-1", // Jetzt explizit erreichbar
    element: <TalentProfileSetup1 />,
  },
  {
    path: "/talent-profile-setup-2",
    element: <TalentProfileSetup2 />,
  },
  {
    path: "/talent-profile-setup-3",
    element: <TalentProfileSetup3 />, // Das wird erst funktionieren, wenn die Datei existiert
  },
  {
    path: "/talent-profile-summary", 
    element: <TalentProfileSummary />, 
  },
]);