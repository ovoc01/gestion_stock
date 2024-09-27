import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import UniteOperationnelPage from "./pages/referentiels/unop";
import FamillePage from "./pages/referentiels/article/famille";
import ServiceExploitantPage from "./pages/referentiels/service";

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
