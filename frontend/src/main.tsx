import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/system";

import { routes } from "./routes/routes.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import {
  QueryClient,
  QueryClientProvider,
}
  from "@tanstack/react-query";


const client = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <RouterProvider router={routes} />
        </AuthProvider>
      </QueryClientProvider>
    </NextUIProvider>
  </React.StrictMode>,
);
