import Flow from "./pages/flow/Flow";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { workflowState } from "./recoil/atoms";

function App() {
  const [workflows, setWorkflows] = useRecoilState(workflowState);
  useEffect(() => {
    const result = axios.get("http://localhost:3001/api/v1/workflows");
    result.then((response) => {
      setWorkflows(response.data.data);
    });
  }, []);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workflow">
          <Route index path="/workflow/:id" element={<Flow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
