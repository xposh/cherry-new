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

export const routes = createBrowserRouter([
  // PUBLIC ROUTES (No Navigation)
  { path: "/", element: <OpenerPage /> },
  { path: "/welcome", element: <WelcomeSlides /> },
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignUpPage /> },

  // PROFILE SETUP ROUTES (No Navigation)
  { path: "/talent-profile-setup-1", element: <TalentProfileSetup1 /> },
  { path: "/talent-profile-setup-2", element: <TalentProfileSetup2 /> },
  { path: "/talent-profile-setup-3", element: <TalentProfileSetup3 /> },
  { path: "/talent-profile-summary", element: <TalentProfileSummary /> },
  { path: "/company-profile-setup-1", element: <CompanyProfileSetup1 /> },
  { path: "/company-profile-setup-2", element: <CompanyProfileSetup2 /> },
  { path: "/company-profile-setup-3", element: <CompanyProfileSetup3 /> },
  { path: "/company-profile-summary", element: <CompanyProfileSummary /> },

  // MAIN APP ROUTES (With Bottom Navigation)
  {
    path: "/home",
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: "/discover",
    element: (
      <MainLayout>
        <DiscoverPage />
      </MainLayout>
    ),
  },
  {
    path: "/talent/:id",
    element: (
      <MainLayout>
        <TalentProfileView />
      </MainLayout>
    ),
  },
  {
    path: "/company/:id",
    element: (
      <MainLayout>
        <CompanyProfileView />
      </MainLayout>
    ),
  },
  {
    path: "/cherry-picks",
    element: (
      <MainLayout>
        <CherryPicksPage />
      </MainLayout>
    ),
  },
  {
    path: "/match/talent/:id",
    element: (
      <MainLayout>
        <TalentMatchDetailsPage />
      </MainLayout>
    ),
  },
  {
    path: "/match/company/:id",
    element: (
      <MainLayout>
        <CompanyMatchDetailsPage />
      </MainLayout>
    ),
  },
  {
    path: "/messages",
    element: (
      <MainLayout>
        <MessagesPage />
      </MainLayout>
    ),
  },
  {
    path: "/account",
    element: (
      <MainLayout>
        <AccountPage />
      </MainLayout>
    ),
  },
]);
