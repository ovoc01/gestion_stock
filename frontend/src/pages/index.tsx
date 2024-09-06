import Logo from "@/components/logo";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const usernameRef = useRef(null)
  const navigate = useNavigate()


  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="flex px-8 rounded-lg flex-col w-[400px] h-[400px] justify-center items-center mx-auto flex-wrap md:flex-nowrap gap-4 shadow-lg ">
        <Logo className="mb-8" height={100} width={200} logo="title"/>
        <Input ref={usernameRef} type="text" label="Nom d'utilisateur" isRequired />
        <Input type={isPasswordShown ? 'text' : 'password'} label="Mot de passe" isRequired  />
        <div className="flex flex-col justify-start w-full gap-3 ">
          <Checkbox onClick={() => setIsPasswordShown(!isPasswordShown)} >
          Afficher mot de passe
          </Checkbox>
        </div>
        <Button className="mt-6 w-full h-[40px] dark" onClick={()=>navigate("/docs")}>
          Se connectez
        </Button>
      </div>
    </div>

  );
}
