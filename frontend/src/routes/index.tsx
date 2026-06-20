import { createBrowserRouter } from "react-router"; // Ich ergänze Outlet — ohne das crasht RootLayout beim Rendern
import { OpenerPage } from "../pages/Start/OpenerPage";
import { WelcomeSlides } from "../pages/Start/WelcomeSlides";
import { LoginPage } from "../pages/Authentication/LoginPage";
import { SignUpPage } from "../pages/Authentication/SignUpPage";
import { TalentProfileSetup1 } from "../pages/Talent/TalentProfileSetup1";
import { TalentProfileSetup2 } from "../pages/Talent/TalentProfileSetup2";
import { TalentProfileSetup3 } from "../pages/Talent/TalentProfileSetup3";
import { TalentProfileSummary } from "../pages/Talent/TalentProfileSummary";
import { CompanyProfileSetup1 } from "../pages/Company/CompanyProfileSetup1";
import { CompanyProfileSetup2 } from "../pages/Company/CompanyProfileSetup2";
import { CompanyProfileSetup3 } from "../pages/Company/CompanyProfileSetup3";
import { CompanyProfileSummary } from "../pages/Company/CompanyProfileSummary";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../pages/Home/HomePage.tsx";
import { DiscoverPage } from "../pages/Discover/DiscoverPage";
import { CherryPicksPage } from "../pages/Matches/CherryPicksPage";
import { MessagesPage } from "../pages/Messages/MessagesPage";
import { ConversationPage } from "../pages/Messages/ConversationPage"; // Ich importiere die neue Chat-Detailseite
import { StartConversationPage } from "../pages/Messages/StartConversationPage"; // Ich importiere die Weiterleitungsseite für neue Chats
import { AccountPage } from "../pages/Account/AccountPage";
import { PreferencesPage } from "../pages/Account/PreferencesPage";
import { PrivacySecurityPage } from "../pages/Account/PrivacySecurityPage";
import { TalentProfileView } from "../pages/Profile/TalentProfileView";
import { CompanyProfileView } from "../pages/Profile/CompanyProfileView";
import { TalentMatchDetailsPage } from "../pages/Matches/TalentMatchDetailsPage.tsx";
import { CompanyMatchDetailsPage } from "../pages/Matches/CompanyMatchDetailsPage";
import { ProtectedRoute } from "../components/ProtectedRoute.tsx";
import { RequireProfile } from "../components/RequireProfile.tsx";
import { RootLayout } from "..//layouts/RootLayout";

// Note: Ich halte den MatchProvider hier im RootLayout, weil useNavigate() einen
// aktiven Router-Context voraussetzt. Wäre MatchProvider in main.tsx über
// RouterProvider gewickelt, würde useNavigate() beim Mount einen Fehler werfen.

export const routes = createBrowserRouter([
  // Note: Ich wrappe alle Routen in RootLayout, damit MatchProvider Router-Zugriff hat
  {
    element: <RootLayout />,
    children: [
      // PUBLIC ROUTES (No Navigation)
      { path: "/", element: <OpenerPage /> },
      { path: "/welcome", element: <WelcomeSlides /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },

      // AUTHENTICATED ROUTES — login required
      {
        element: <ProtectedRoute />,
        children: [
          // PROFILE SETUP (No Navigation)
          { path: "/talent-profile-setup-1", element: <TalentProfileSetup1 /> },
          { path: "/talent-profile-setup-2", element: <TalentProfileSetup2 /> },
          { path: "/talent-profile-setup-3", element: <TalentProfileSetup3 /> },
          {
            path: "/company-profile-setup-1",
            element: <CompanyProfileSetup1 />,
          },
          {
            path: "/company-profile-setup-2",
            element: <CompanyProfileSetup2 />,
          },
          {
            path: "/company-profile-setup-3",
            element: <CompanyProfileSetup3 />,
          },

          // PROFILE-COMPLETE ROUTES
          {
            element: <RequireProfile />,
            children: [
              // MAIN APP ROUTES (With Bottom Navigation)
              {
                element: <MainLayout />,
                children: [
                  {
                    path: "/talent-profile-summary",
                    element: <TalentProfileSummary />,
                  },
                  {
                    path: "/company-profile-summary",
                    element: <CompanyProfileSummary />,
                  },
                  { path: "home", element: <HomePage /> },
                  { path: "discover", element: <DiscoverPage /> },

                  // Profil-Detailseiten (von Discover aus)
                  { path: "talent/:id", element: <TalentProfileView /> },
                  { path: "company/:id", element: <CompanyProfileView /> },

                  // Ich habe die alte match/:targetType/:id Route entfernt —
                  // MatchScreen wird jetzt als globales Overlay aus dem MatchContext
                  // heraus gerendert, nicht mehr als eigene Route navigiert.
                  {
                    path: "match-details/talent/:id",
                    element: <TalentMatchDetailsPage />,
                  },
                  {
                    path: "match-details/company/:id",
                    element: <CompanyMatchDetailsPage />,
                  },

                  { path: "cherry-picks", element: <CherryPicksPage /> },

                  // Messaging-System: Liste → Chat → neuen Chat starten
                  { path: "messages", element: <MessagesPage /> },
                  {
                    path: "messages/:conversationId",
                    element: <ConversationPage />,
                  },
                  {
                    path: "messages/start/:partnerId",
                    element: <StartConversationPage />,
                  },

                  { path: "account", element: <AccountPage /> },
                  { path: "preferences/:role", element: <PreferencesPage /> },
                  {
                    path: "account/privacy-security",
                    element: <PrivacySecurityPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
