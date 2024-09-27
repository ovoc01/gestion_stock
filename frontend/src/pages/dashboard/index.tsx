import ChartBar from "@/components/features/chart-bar";
import StatsCard from "@/components/ui/stats-card";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashboardPage() {
   return <div className="w-full flex  h-[100%]  gap-8 py-8">
      <div className=" p-8 border-solid flex flex-col gap-6 h-full w-4/5">
         <div className="w-full flex gap-5 ">
            <StatsCard />
         </div>
         <div className="w-full flex gap-5 mt-6">
            <ChartBar />
         </div>
         <div className="w-full flex gap-5 mt-6">
            <div className="w-full flex items-center justify-between">
               <h1 className="text-2xl text-gray-500">Historiques de mouvements  </h1>
               <h1 className=" text-xl flex items-center text-gray-300 hover:text-primary">
                  Voir tout
                  <span className="text-md ml-3">
                     <FontAwesomeIcon icon={faChevronRight} />

                  </span>
               </h1>
            </div>
         </div>
      </div>
      <div className=" p-8 border-solid border-1  border-gray-300 rounded-lg shadow-md h-full max-h-[800px] w-2/6 ">

      </div>
   </div>
}