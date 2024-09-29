import ChartBar from "@/components/features/chart-bar";
import StatsCard from "@/components/ui/stats-card";
import { faChevronRight, faUsers, faWeightScale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip } from "@nextui-org/react";

export default function DashboardPage() {
   return <div className="w-full flex  h-[100%]  gap-8 py-8">
      <div className=" p-8 border-solid flex flex-col gap-6 h-full w-3/5">
         <div className="w-full flex gap-5 ">
            <StatsCard number={250} title="Utilisateur Active" icon={faUsers} percentage="+6,45" />
            <StatsCard number={10} title="Demande Régularisation" icon={faWeightScale} />
         </div>
         <Tooltip delay={500} content={
            <Button size="lg" className="rounded-md border-solid border-primary text-primary" variant="light">
               Voirs les détails
            </Button>
         }>
            <div className="w-full flex gap-5 mt-6 cursor-pointer ">
               <ChartBar />
            </div>
         </Tooltip>
         <div className="w-full flex flex-col gap-5 mt-6">
            <div className="w-full flex items-center justify-between">
               <h1 className="text-2xl text-gray-500">Historiques de mouvements  </h1>
               <h1 className=" text-xl flex items-center text-gray-300 transition cursor-pointer hover:text-primary">
                  Voir tout
                  <span className="text-md ml-3">
                     <FontAwesomeIcon icon={faChevronRight} />
                  </span>
               </h1>
            </div>
         </div>
      </div>
      {/* <div className=" p-8 border-solid border-1  border-gray-300 rounded-lg shadow-md h-full max-h-[800px] w-2/6 ">
         
      </div> */}
   </div>
}