import { Outlet } from "react-router-dom";

import AdminLayout from "./admin-layout";
export default function AdLayout() {
   return (
      <AdminLayout>
         <Outlet />
      </AdminLayout>
   )
}