import { Spinner } from "@nextui-org/react";

export default function CSpinner ({label}:{label:string}) {
   return <div className="w-full h-full flex justify-center items-center">
         <Spinner label={label}/>
   </div>
}