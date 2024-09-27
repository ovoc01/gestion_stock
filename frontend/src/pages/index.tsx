import Logo from "@/components/ui/logo";
import { login } from "@/services/api/auth.service";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [username, setUsername] = useState('RAZAFIM5')
  const [password, setPassword] = useState('test1234!!')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')




  const authentificate = async () => {
    if (username.trim() === '') {
      setUsernameError('Le nom d\'utilisateur est requis')
    }
    if (password === '') {
      setPasswordError('Le mot de passe est requis')
    }
    login(username, password).then((response) => {
      console.table(response)
      const token = response.token;
      const user = response.userFullname;
      localStorage.setItem('token', token)
      localStorage.setItem('user', user)
      
      navigate("/referentiels/unite-operationnels")
    }).catch((error) => {
      console.log(error)
      setPasswordError('Nom d\'utilisateur ou mot de passe incorrect')
    })

  }
  const navigate = useNavigate()




  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="flex px-8 rounded-lg flex-col w-[400px] h-[500px] justify-center items-center mx-auto flex-wrap md:flex-nowrap gap-4 shadow-lg ">
        <div className="pb-8">
          <Logo className="mb-8" height={100} width={200} logo="title" />
          <h1 className="font-bold text-4xl">
            Gestion de Stock
          </h1>
        </div>
        <div className="w-full flex flex-col gap-4 pb-5">
          <Input value={username} type="text" label="Nom d'utilisateur" errorMessage={usernameError} isRequired onChange={(e) => { setUsername(e.target.value) }} />
          <Input value={password} type={isPasswordShown ? 'text' : 'password'} label="Mot de passe" isRequired onChange={(e) => { setPassword(e.target.value) }} errorMessage={passwordError} />
          <div className="flex flex-col justify-start w-full gap-3 ">
            <Checkbox radius="sm" onClick={() => setIsPasswordShown(!isPasswordShown)} >
              Afficher mot de passe
            </Checkbox>
          </div>
        </div>
        <Button className="mt-6 w-full h-[40px] dark" onClick={authentificate}>
          Se connectez
        </Button>
      </div>
    </div>

  );
}
