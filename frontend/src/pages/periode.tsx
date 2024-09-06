
import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";

import { Input } from "@nextui-org/input";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Periode() {
   const usernameRef = useRef(null)
   const navigate = useNavigate()


   return (
      <DefaultLayout>

         <div className="flex px-8 rounded-lg flex-col w-full h-[400px] justify-center items-center mx-auto flex-wrap md:flex-nowrap gap-4 shadow-lg ">
            <h1 className="text-3xl font-bold justify-self-start w-full ">Création nouveau Période</h1>
            <Input ref={usernameRef} type="text" label="Libellé"  />
            <Button className="mt-6 w-full h-[40px] dark" onClick={() => navigate("/docs")}>
               Validez
            </Button>
         </div>
      </DefaultLayout>

   );
}
