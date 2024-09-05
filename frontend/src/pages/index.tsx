import Logo from "@/components/logo";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

export default function IndexPage() {
  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="flex px-8 rounded-lg flex-col w-[400px] h-[400px] justify-center items-center mx-auto flex-wrap md:flex-nowrap gap-4 shadow-lg ">
        <Logo className="mb-8"/>

        <Input type="text" label="Nom d'utilisateur" isRequired />
        <Input type="password" label="Mot de passe" isRequired />

        <Button className="mt-6 w-full h-[40px] dark">
          Se connectez
        </Button>
      </div>
    </div>

  );
}
