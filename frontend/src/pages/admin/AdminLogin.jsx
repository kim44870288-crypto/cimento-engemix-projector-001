import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const nav = useNavigate();
  const { login, user, checked } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Painel Administrativo · Acesso";
    return () => {
      document.title =
        "Engemix | O melhor Concreto Usinado do Brasil para sua Obra!";
    };
  }, []);

  useEffect(() => {
    if (checked && user) nav("/donascimentopainel/dashboard", { replace: true });
  }, [checked, user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, password);
      nav("/donascimentopainel/dashboard", { replace: true });
    } catch (e2) {
      setErr(formatApiError(e2?.response?.data?.detail) || "Falha no login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full text-white flex flex-col lg:flex-row"
      data-testid="admin-login-page"
      style={{ background: "linear-gradient(135deg,#0d0518 0%,#1a0b2e 60%,#2b1152 100%)" }}
    >
      {/* Left: Image */}
      <div
        className="hidden lg:block lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/painel-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d0518]" />
        <div className="absolute bottom-10 left-10 max-w-md">
          <span
            className="inline-flex items-center gap-2 bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md"
            data-testid="acesso-restrito-badge"
          >
            <span className="w-2 h-2 rounded-full bg-purple-300 animate-pulse" />
            Acesso restrito
          </span>
          <p className="mt-6 text-lg italic text-purple-100/90 leading-relaxed">
            O conhecimento é como uma escada: quanto mais alto você sobe,{" "}
            <span className="underline decoration-purple-400 decoration-2">
              mais ampla é sua visão
            </span>
            .
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-0">
        <div
          className="w-full max-w-md bg-[#150826]/80 border border-purple-500/20 rounded-2xl p-8 lg:p-10 shadow-2xl backdrop-blur-xl"
          data-testid="admin-login-card"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-900/50">
              P
            </div>
            <div>
              <div className="text-white font-bold leading-tight">Ipatinga MG</div>
              <div className="text-[10px] tracking-[0.25em] text-purple-300/70 uppercase">
                Painel Administrativo
              </div>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Acessar painel</h1>
          <p className="text-sm text-purple-200/70 mb-8">
            Digite suas credenciais para continuar.
          </p>

          <form onSubmit={submit} className="space-y-5" data-testid="admin-login-form">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.2em] text-purple-200/80 uppercase mb-2">
                Usuário
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="donas@gmail.com"
                autoComplete="username"
                required
                data-testid="admin-login-email"
                className="w-full h-12 rounded-xl bg-purple-50 text-gray-900 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-[0.2em] text-purple-200/80 uppercase mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  data-testid="admin-login-password"
                  className="w-full h-12 rounded-xl bg-purple-50 text-gray-900 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  data-testid="admin-login-toggle-pwd"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {err && (
              <div
                className="text-sm text-red-300 bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-2"
                data-testid="admin-login-error"
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              data-testid="admin-login-submit"
              className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-purple-900/40"
            >
              {busy ? "Entrando..." : (
                <>
                  Entrar <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 flex items-center gap-2 text-xs text-purple-200/60">
            <Lock size={12} /> Conexão segura · Apenas administradores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}
