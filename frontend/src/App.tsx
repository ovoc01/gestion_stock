import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import UniteOperationnelPage from "./pages/referentiels/uniteOperationnel";
import FamillePage from "./pages/referentiels/famille";
import ServiceExploitantPage from "./pages/referentiels/serviceExploitant";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
        <Route element={<UniteOperationnelPage />} path="/referentiels/unite-operationnels" />
        <Route element={<FamillePage />} path="/referentiels/familles" />
        <Route element={<ServiceExploitantPage />} path="/referentiels/service-exploitants" />
    </Routes>
  );
}

export default App;
