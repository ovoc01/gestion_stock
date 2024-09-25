import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import 'leaflet/dist/leaflet.js'

import "@/styles/globals.css";

import { routes } from "./routes/routes.tsx";
import { NextUIProvider } from "@nextui-org/system";
import { AuthProvider } from "./providers/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </NextUIProvider>
  </React.StrictMode>,
);
