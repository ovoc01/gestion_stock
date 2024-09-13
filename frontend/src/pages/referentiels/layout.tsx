import DefaultLayout from "@/layouts/default";
import { Outlet } from "react-router-dom";

export default function Layout(){
   return <DefaultLayout>
      <Outlet/>
   </DefaultLayout>
}