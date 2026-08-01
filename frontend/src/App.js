import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import QuemSomos from "@/pages/QuemSomos";
import Orcamento from "@/pages/Orcamento";
import WhatsApp from "@/pages/WhatsApp";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminActivity from "@/pages/admin/AdminActivity";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminSettings from "@/pages/admin/AdminSettings";
import ProtectedRoute from "@/pages/admin/ProtectedRoute";
import { AuthProvider } from "@/lib/auth";
import { startHeartbeat } from "@/lib/tracker";
import GlobalWaRedirect from "@/lib/GlobalWaRedirect";

function TrackerBoot() {
  useEffect(() => {
    if (!window.location.pathname.startsWith("/donascimentopainel")) {
      startHeartbeat();
    }
  }, []);
  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <TrackerBoot />
          <GlobalWaRedirect />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/orcamento" element={<Orcamento />} />
            <Route path="/whatsapp" element={<WhatsApp />} />

            {/* Admin */}
            <Route path="/donascimentopainel" element={<AdminLogin />} />
            <Route
              path="/donascimentopainel"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="atividade" element={<AdminActivity />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="configuracoes" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
