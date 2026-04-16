import { createBrowserRouter } from "react-router";
import { WelcomeSlides } from "../pages/WelcomeSlides";
import { LoginPage } from "../pages/LoginPage";
import { Layout } from "../pages/Layout";
import { ContactPage } from "../pages/ContactPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <WelcomeSlides />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },
]);
