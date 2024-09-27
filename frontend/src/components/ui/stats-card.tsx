import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function StatsCard() {
   return (
      <div className="border-solid border-1  flex flex-col justify-around border-gray-300  rounded-lg shadow-md w-[300px] h-[140px] p-8">
         <div className="flex justify-between font-semibold text-2xl items-center ">
            <span className=" ">
               Utilisateurs Active
            </span>
            <span className="">
               <FontAwesomeIcon icon={faUserGear}/>
            </span>
         </div>
         <div className="flex justify-between items-center ">
            <span className="text-5xl font-bold text-primary">
               250
            </span>
            <span className=" text-md text-primary mt-5 italic">
               +6,5%
            </span>
         </div>
      </div>
   )
}