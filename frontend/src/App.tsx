import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import UniteOperationnelPage from "./pages/referentiels/uniteOperationnel";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
        <Route element={<UniteOperationnelPage />} path="/referentiels/uniteOperationnel" />
    </Routes>
  );
}

export default App;
