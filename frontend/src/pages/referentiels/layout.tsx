import { Outlet } from "react-router-dom";

import DefaultLayout from "@/layouts/default";

export default function Layout() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}
