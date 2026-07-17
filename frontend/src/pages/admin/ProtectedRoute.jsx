import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function ProtectedRoute({ children }) {
  const { user, checked } = useAuth();
  if (!checked) {
    return (
      <div className="min-h-screen bg-[#0d0518] flex items-center justify-center text-purple-200">
        Carregando...
      </div>
    );
  }
  if (!user) return <Navigate to="/donascimentopainel" replace />;
  return children;
}
