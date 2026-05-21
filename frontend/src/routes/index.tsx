import { createBrowserRouter } from "react-router";
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
import { AccountPage } from "../pages/Account/AccountPage";
import { TalentProfileView } from "../pages/Profile/TalentProfileView";
import { CompanyProfileView } from "../pages/Profile/CompanyProfileView";
import { TalentMatchDetailsPage } from "../pages/Matches/TalentMatchDetailsPage.tsx";
import { CompanyMatchDetailsPage } from "../pages/Matches/CompanyMatchDetailsPage";
import { ProtectedRoute } from "../components/ProtectedRoute.tsx";
import { RequireProfile } from "../components/RequireProfile.tsx";

export const routes = createBrowserRouter([
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
      // Open to any logged-in user: new users fill these step by step,
      // existing users revisit them to edit their profile.
      { path: "/talent-profile-setup-1", element: <TalentProfileSetup1 /> },
      { path: "/talent-profile-setup-2", element: <TalentProfileSetup2 /> },
      { path: "/talent-profile-setup-3", element: <TalentProfileSetup3 /> },
      { path: "/company-profile-setup-1", element: <CompanyProfileSetup1 /> },
      { path: "/company-profile-setup-2", element: <CompanyProfileSetup2 /> },
      { path: "/company-profile-setup-3", element: <CompanyProfileSetup3 /> },

      // PROFILE-COMPLETE ROUTES — a completed, server-stored profile required
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
              { path: "talent/:id", element: <TalentProfileView /> },
              { path: "company/:id", element: <CompanyProfileView /> },
              { path: "cherry-picks", element: <CherryPicksPage /> },
              { path: "match/talent/:id", element: <TalentMatchDetailsPage /> },
              {
                path: "match/company/:id",
                element: <CompanyMatchDetailsPage />,
              },
              { path: "messages", element: <MessagesPage /> },
              { path: "account", element: <AccountPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
