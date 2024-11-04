import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { To, useNavigate } from "react-router-dom";

import { getUserLandingUrl, login } from "@/services/api/auth.service";
import Logo from "@/components/ui/logo";

interface LoginPageProps {
  home: string,
  defaultUser: string,
  defaultPwd: string
}

export default function IndexPage({ defaultUser }: LoginPageProps) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [username, setUsername] = useState(defaultUser);
  const [password, setPassword] = useState("test1234!!");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const authentificate = async () => {
    if (username.trim() === "") {
      setUsernameError("Le nom d'utilisateur est requis");
    }
    if (password === "") {
      setPasswordError("Le mot de passe est requis");
    }
    login(username, password)
      .then((response) => {
        const token = response.token;

        const landingUrl = getUserLandingUrl(token);
        localStorage.setItem("token", token);
        navigate(landingUrl as To);
      })
      .catch((error) => {
        console.log(error);
        setLoginError(error.response.data.error);
        setTimeout(() => {
          setLoginError("")
        }, 7000)
      });
  };
  const navigate = useNavigate();

  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="flex px-8 rounded-lg flex-col w-[400px] h-fit justify-center items-center mx-auto  gap-4 shadow-lg ">
        <div className="pb-8 flex flex-col justify-center items-center">
          <Logo className="mb-8" height={100} logo="title" width={200} />
          <h1 className="font-bold text-4xl">Gestion de Stock</h1>
        </div>
        <div className="w-full flex flex-col gap-4 pb-5">
          <Input
            isRequired
            errorMessage={usernameError}
            label="Nom d'utilisateur"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            isRequired
            errorMessage={passwordError}
            label="Mot de passe"
            type={isPasswordShown ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="flex flex-col justify-start w-full gap-3 ">
            <Checkbox
              radius="sm"
              onClick={() => setIsPasswordShown(!isPasswordShown)}
            >
              Afficher mot de passe
            </Checkbox>
          </div>
          {
            loginError === "" ? (
              <></>
            ) : <h1 className=" text-red-600">
              * {loginError}
            </h1>
          }
        </div>
        <div className="w-full p-5 mb-3">
          <Button
            className=" w-full h-12   bg-dark text-light"
            size="md"
            onClick={authentificate}
          >
            Se connectez
          </Button>
        </div>
      </div>
    </div>
  );
}
