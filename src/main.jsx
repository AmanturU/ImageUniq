// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./store/index.js";
import {
  DashboardPage,
  LogIn,
  NotFoundPage,
  Pricing,
  ProfilePage,
  SignUp,
  SuccessfulPage,
} from "./pages/index.js";
import { MainLayout } from "./layouts/Main.layout.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { ProtectedRoute } from "./hoc/ProtectedRoute.jsx";
import { RedirectIfAuthenticated } from "./hoc/RedirectIfAuthenticated.jsx";
import { SecondaryLayout } from "./layouts/Secondary.layout.jsx";
import { CancelPage } from "./pages/CancelPage/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/profile",
        element: <ProtectedRoute element={<ProfilePage />} />,
      },
    ],
  },
  {
    element: <SecondaryLayout />,
    children: [
      {
        path: "/login",
        element: <RedirectIfAuthenticated element={<LogIn />} />,
      },
      {
        path: "/signup",
        element: <RedirectIfAuthenticated element={<SignUp />} />,
      },
    ],
  },
  {
    path: "/success",
    element: <SuccessfulPage />,
  },
  {
    path: "/cancel",
    element: <CancelPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
