import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider } from "react-router-dom";


import "@/styles/globals.css";

import { routes } from "./routes/routes.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <RouterProvider router={routes} />
  </React.StrictMode>,
);
