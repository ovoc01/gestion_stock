import LoginPage from "@/components/features/login"

export default function CommonUserAuthentication() {
   return <LoginPage home="/magasins" defaultUser="Test" defaultPwd="test" />
}