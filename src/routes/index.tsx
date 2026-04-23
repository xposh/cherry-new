import { createBrowserRouter } from 'react-router';
// Importiere deine Komponenten hier (Pfade ggf. anpassen)
import { WelcomeSlides } from '../pages/WelcomeSlides';
import { LoginPage } from '../pages/Authentication/LoginPage';
import { SignUpPage } from '../pages/Authentication/SignUpPage';
import { TalentProfileSetup1 } from "../pages//Talent/TalentProfileSetup1";
import { TalentProfileSetup2 } from "../pages//Talent/TalentProfileSetup2"; 
import { TalentProfileSetup3 } from "../pages/Talent/TalentProfileSetup3"; 
import { TalentProfileSummary } from "../pages/Talent/TalentProfileSummary"; // Beispiel für die Profilübersicht nach Setup

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <WelcomeSlides />, // Deine Startseite mit den Slides

  },
  {
    path: "login", // Jetzt explizit erreichbar
    element: <LoginPage />,
  },
  {
    path: "signup", // Jetzt explizit erreichbar
    element: <SignUpPage />, // Das wird erst funktionieren, wenn die Datei existiert
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