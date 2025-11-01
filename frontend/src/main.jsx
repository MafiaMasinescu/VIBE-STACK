import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AboutPage from "./AboutPage.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Signup from "./Signup.jsx";
import Feed from "./Feed.jsx";
import Profile from "./Profile.jsx";

const Router = createBrowserRouter([
  { path: "/", element: <Navigate to="/feed" /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Signup /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/feed", element: <Feed /> },
  { path: "/profile/:userId", element: <Profile /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>
);
