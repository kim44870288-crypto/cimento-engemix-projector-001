import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Users,
  MessageCircle,
  Eye,
  UserCheck,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const CARDS = [
  { key: "visitors_24h", label: "Visitantes únicos (24h)", icon: Users, color: "from-purple-500 to-fuchsia-500" },
  { key: "pageviews_24h", label: "Pageviews (24h)", icon: Eye, color: "from-blue-500 to-cyan-500" },
  { key: "whatsapp_clicks_24h", label: "Cliques no WhatsApp (24h)", icon: MessageCircle, color: "from-emerald-500 to-teal-500" },
  { key: "leads_24h", label: "Novos orçamentos (24h)", icon: FileText, color: "from-amber-500 to-orange-500" },
  { key: "events_24h", label: "Eventos totais (24h)", icon: TrendingUp, color: "from-pink-500 to-rose-500" },
  { key: "leads", label: "Orçamentos (total)", icon: UserCheck, color: "from-indigo-500 to-violet-500" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [presence, setPresence] = useState({ online: 0, sessions: [] });

  useEffect(() => {
    document.title = "Dashboard · Painel";
    let alive = true;
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/presence"),
        ]);
        if (alive) {
          setStats(s.data);
          setPresence(p.data);
        }
      } catch {}
    };
    load();
    const t = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (!stats)
    return <div className="text-purple-200/70" data-testid="dash-loading">Carregando métricas...</div>;

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-purple-200/60 text-sm">
            Atualizado em tempo real · atualiza a cada 5s
          </p>
        </div>
        <div
          className="inline-flex items-center gap-3 bg-emerald-600/15 border border-emerald-500/30 px-5 py-2.5 rounded-full"
          data-testid="presence-badge"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>
          <span className="text-emerald-200 text-sm font-semibold">
            {presence.online} {presence.online === 1 ? "usuário" : "usuários"} online agora
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c) => {
          const Icon = c.icon;
          const value =
            (c.key.includes("_24h") || c.key === "leads"
              ? stats.totals[c.key]
              : stats.totals[c.key]) ?? 0;
          return (
            <div
              key={c.key}
              className="relative overflow-hidden bg-[#160828] border border-purple-500/20 rounded-2xl p-5"
              data-testid={`card-${c.key}`}
            >
              <div
                className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl`}
              />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-purple-200/60 text-xs uppercase tracking-widest">
                    {c.label}
                  </div>
                  <div className="text-3xl font-bold mt-2">{value}</div>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 bg-[#160828] border border-purple-500/20 rounded-2xl p-5"
          data-testid="chart-24h"
        >
          <h3 className="text-sm font-semibold text-purple-200/80 uppercase tracking-widest mb-4">
            Pageviews nas últimas 24h
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.series_24h}>
                <CartesianGrid stroke="#3b1a5c" strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#9d7cd0" fontSize={11} />
                <YAxis stroke="#9d7cd0" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#1a0b2e",
                    border: "1px solid #5c2d9c",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#c084fc"
                  strokeWidth={2.5}
                  dot={{ fill: "#a855f7", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#160828] border border-purple-500/20 rounded-2xl p-5" data-testid="chart-top-pages">
          <h3 className="text-sm font-semibold text-purple-200/80 uppercase tracking-widest mb-4">
            Páginas mais vistas (7d)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top_pages} layout="vertical">
                <XAxis type="number" stroke="#9d7cd0" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="page" type="category" stroke="#9d7cd0" fontSize={11} width={90} />
                <Tooltip
                  contentStyle={{
                    background: "#1a0b2e",
                    border: "1px solid #5c2d9c",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#a855f7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Online sessions */}
      <div className="bg-[#160828] border border-purple-500/20 rounded-2xl p-5" data-testid="online-sessions">
        <h3 className="text-sm font-semibold text-purple-200/80 uppercase tracking-widest mb-4">
          Usuários ativos agora ({presence.online})
        </h3>
        {presence.sessions.length === 0 ? (
          <p className="text-sm text-purple-200/50">Nenhum visitante ativo no momento.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-purple-300/60 tracking-wider">
                <tr>
                  <th className="text-left py-2">Sessão</th>
                  <th className="text-left py-2">Última página</th>
                  <th className="text-left py-2">IP</th>
                  <th className="text-left py-2">Eventos</th>
                  <th className="text-left py-2">Última atividade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {presence.sessions.map((s) => (
                  <tr key={s._id} className="text-purple-100/80">
                    <td className="py-2 font-mono text-xs">{s._id.slice(0, 10)}…</td>
                    <td className="py-2">{s.last_page || "-"}</td>
                    <td className="py-2 text-xs">{s.ip || "-"}</td>
                    <td className="py-2">{s.events}</td>
                    <td className="py-2 text-xs">
                      {new Date(s.last_seen).toLocaleTimeString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
