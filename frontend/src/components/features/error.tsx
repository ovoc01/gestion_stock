import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ErrorProps = {
   error: string;
   message: string;
   illustration: string
}


export default function Error({ error, message, illustration }: ErrorProps) {
   const [timer, setTimer] = useState(10);
   const router = useNavigate()
   useEffect(() => {
      const interval = setInterval(() => {
         setTimer((prevTimer) => {
            if (prevTimer <= 1) {
               clearInterval(interval);
               //router('/')
               return 0;
            }
            return prevTimer - 1;
         });
      }, 1000);

      return () => clearInterval(interval); // Clean up the interval on unmount
   }, [history]);


   return (
      <div className="container flex justify-center items-center h-full">
         <div className="text-8xl font-semibold w-2/5 flex flex-col items-center justify-center">
            <h1 className="text-primary">{error}</h1>
            <h1 className="text-default-600 text-xl font-light">
               {message}
            </h1>
            <h1 className="text-default-600 text-xl font-light">
               Vous serez redirigé  dans <span className="text-primary">{timer}</span> seconde.
            </h1>
            <Button color="primary" className="mt-4 " radius="sm" size="lg">
               Retour à la page de connexion
            </Button>
         </div>
         <div>
            <img src={`/svg/error/${illustration}`} alt="authentication" />
         </div> 
      </div>
   );
}
