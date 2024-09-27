
import { Button } from "@nextui-org/react";

export default function ChartBar() {
   return (
      <div className="flex flex-col gap-8 w-full" >
         <div className="flex justify-between w-full">
            <h1 className="text-2xl text-gray-500">Statistiques de mouvements  </h1>
            <div className="flex gap-5">
               <Button size="lg" className="rounded-md border-solid border-primary text-primary" variant="ghost">
                  Semaine
               </Button>
               <Button size="lg" className="rounded-md text-background" color="primary">
                  Mois
               </Button>
               <Button size="lg" className="rounded-md border-solid border-primary text-primary" variant="ghost">
                  Trimestre
               </Button>
            </div>
         </div>
         <div className=" bg-primary rounded-md w-full h-[350px]">
         </div>
      </div>
   )
}