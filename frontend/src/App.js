import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import QuemSomos from "@/pages/QuemSomos";
import Orcamento from "@/pages/Orcamento";
import WhatsApp from "@/pages/WhatsApp";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/orcamento" element={<Orcamento />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
