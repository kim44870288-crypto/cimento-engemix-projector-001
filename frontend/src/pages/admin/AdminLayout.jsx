import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Users,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Toaster } from "sonner";
import { useAuth } from "@/lib/auth";
import { useLeadsNotifier } from "@/lib/notifier";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const leadsCount = useLeadsNotifier();

  const items = [
    { to: "/donascimentopainel/dashboard", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
    { to: "/donascimentopainel/atividade", label: "Atividade", icon: Activity, testid: "nav-atividade" },
    {
      to: "/donascimentopainel/leads",
      label: "Orçamentos",
      icon: Users,
      testid: "nav-leads",
      badge: leadsCount,
    },
    { to: "/donascimentopainel/configuracoes", label: "Configurações", icon: Settings, testid: "nav-config" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0416] text-white flex" data-testid="admin-layout">
      <Toaster position="top-right" richColors theme="dark" />

      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#130726] border-r border-purple-900/40 hidden lg:flex flex-col">
        <div className="px-6 py-6 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-purple-900/50">
              P
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">Ipatinga MG</div>
              <div className="text-[9px] tracking-[0.25em] text-purple-300/70 uppercase">
                Painel Admin
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              data-testid={it.testid}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition ${
                  isActive
                    ? "bg-purple-600/20 text-white border-r-2 border-purple-400"
                    : "text-purple-100/70 hover:bg-purple-900/30 hover:text-white"
                }`
              }
            >
              <it.icon size={18} />
              <span className="flex-1">{it.label}</span>
              {it.badge > 0 && (
                <span
                  className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center"
                  data-testid={`badge-${it.testid}`}
                >
                  {it.badge > 99 ? "99+" : it.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-purple-900/40 space-y-2">
          <a
            href="/home"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center gap-2 text-xs text-purple-200/70 hover:text-white px-3 py-2 rounded-lg hover:bg-purple-900/30"
            data-testid="nav-ver-site"
          >
            <ExternalLink size={14} /> Ver site público
          </a>
          <div className="px-3 py-2">
            <div className="text-[10px] tracking-widest uppercase text-purple-300/50">
              Logado como
            </div>
            <div className="text-sm text-white truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            data-testid="btn-logout"
            className="w-full inline-flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 text-sm px-3 py-2 rounded-lg border border-red-500/30"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#130726] border-b border-purple-900/40 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-bold">Painel Admin</div>
          <button
            onClick={logout}
            data-testid="btn-logout-mobile"
            className="text-red-300 text-xs bg-red-600/20 px-3 py-1.5 rounded-lg"
          >
            Sair
          </button>
        </div>
        <div className="flex overflow-x-auto gap-1 px-2 pb-2">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `whitespace-nowrap text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                  isActive ? "bg-purple-600 text-white" : "text-purple-200/70 bg-purple-900/30"
                }`
              }
            >
              {it.label}
              {it.badge > 0 && (
                <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                  {it.badge > 99 ? "99+" : it.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 pt-24 lg:pt-0 p-6 lg:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
