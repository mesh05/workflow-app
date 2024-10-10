import Flow from "./pages/flow/Flow";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";

function App() {
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
