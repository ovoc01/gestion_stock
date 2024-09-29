
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type StatsCardProps = {
   title:string,
   icon?:IconProp,
   percentage?:string,
   number:number,
}
export default function StatsCard({title,percentage,number,icon}:StatsCardProps) {
   return (
      <div className="border-solid border-1  flex flex-col justify-around border-gray-300  rounded-lg shadow-md w-[250px] h-[140px] p-8 cursor-pointer">
         <div className="flex justify-between font-semibold text-2xl items-center ">
            <span className=" ">
               {title}
            </span>
            <span className="">
               <FontAwesomeIcon icon={icon!}/>
            </span>
         </div>
         <div className="flex justify-between items-center ">
            <span className="text-5xl  text-primary italic">
               {number}
            </span>
            <span className=" text-md text-primary mt-5 italic">
               {percentage}
            </span>
         </div>
      </div>
   )
}