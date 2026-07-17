import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Users,
  MessageCircle,
  Eye,
  UserCheck,
  FileText,
  TrendingUp,
  Target,
  Zap,
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
  Area,
  AreaChart,
} from "recharts";

const PERIODS = [
  { v: "24h", label: "24 horas" },
  { v: "7d", label: "7 dias" },
  { v: "30d", label: "30 dias" },
];

const CARDS = [
  {
    key: "visitors_period",
    label: "Visitantes únicos",
    icon: Users,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    key: "pageviews_period",
    label: "Pageviews",
    icon: Eye,
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "whatsapp_clicks_period",
    label: "Cliques no WhatsApp",
    icon: MessageCircle,
    color: "from-emerald-500 to-teal-500",
  },
  {
    key: "leads_period",
    label: "Orçamentos recebidos",
    icon: FileText,
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "events_period",
    label: "Eventos totais",
    icon: TrendingUp,
    color: "from-pink-500 to-rose-500",
  },
  {
    key: "leads",
    label: "Orçamentos (todos os tempos)",
    icon: UserCheck,
    color: "from-indigo-500 to-violet-500",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [presence, setPresence] = useState({ online: 0, sessions: [] });
  const [period, setPeriod] = useState("24h");

  useEffect(() => {
    document.title = "Dashboard · Painel";
    let alive = true;
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          api.get("/admin/stats", { params: { period } }),
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
  }, [period]);

  if (!stats)
    return (
      <div className="text-purple-200/70" data-testid="dash-loading">
        Carregando métricas...
      </div>
    );

  const funnel = [
    { name: "Visitantes", value: stats.totals.visitors_period, color: "#a855f7" },
    { name: "Pageviews", value: stats.totals.pageviews_period, color: "#3b82f6" },
    { name: "Cliques WhatsApp", value: stats.totals.whatsapp_clicks_period, color: "#10b981" },
    { name: "Orçamentos", value: stats.totals.leads_period, color: "#f59e0b" },
  ];

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
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="inline-flex items-center gap-3 bg-emerald-600/15 border border-emerald-500/30 px-5 py-2.5 rounded-full"
            data-testid="presence-badge"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
            </span>
            <span className="text-emerald-200 text-sm font-semibold">
              {presence.online} {presence.online === 1 ? "usuário" : "usuários"} online
            </span>
          </div>

          <div className="inline-flex bg-[#160828] border border-purple-500/30 rounded-full p-1" data-testid="period-toggle">
            {PERIODS.map((p) => (
              <button
                key={p.v}
                onClick={() => setPeriod(p.v)}
                data-testid={`period-${p.v}`}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                  period === p.v
                    ? "bg-purple-600 text-white"
                    : "text-purple-200/70 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="relative overflow-hidden bg-gradient-to-br from-purple-900/60 to-fuchsia-900/40 border border-purple-500/30 rounded-2xl p-6"
          data-testid="card-conversion"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-200/80 text-xs uppercase tracking-widest">
                <Target size={14} />
                Taxa de conversão · orçamentos
              </div>
              <div className="text-4xl font-bold mt-2">
                {stats.totals.conversion_rate}%
              </div>
              <div className="text-xs text-purple-200/60 mt-1">
                {stats.totals.leads_period} orçamentos / {stats.totals.visitors_period}{" "}
                visitantes
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/30 flex items-center justify-center">
              <Target size={28} className="text-purple-200" />
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border border-emerald-500/30 rounded-2xl p-6"
          data-testid="card-wa-rate"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-200/80 text-xs uppercase tracking-widest">
                <Zap size={14} />
                Engajamento WhatsApp
              </div>
              <div className="text-4xl font-bold mt-2">
                {stats.totals.wa_click_rate}%
              </div>
              <div className="text-xs text-emerald-200/60 mt-1">
                {stats.totals.whatsapp_clicks_period} cliques /{" "}
                {stats.totals.visitors_period} visitantes
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/30 flex items-center justify-center">
              <MessageCircle size={28} className="text-emerald-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c) => {
          const Icon = c.icon;
          const value = stats.totals[c.key] ?? 0;
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

      {/* Chart 1: pageviews trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 bg-[#160828] border border-purple-500/20 rounded-2xl p-5"
          data-testid="chart-trend"
        >
          <h3 className="text-sm font-semibold text-purple-200/80 uppercase tracking-widest mb-4">
            Pageviews · {PERIODS.find((p) => p.v === period)?.label}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.series}>
                <defs>
                  <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#3b1a5c" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#9d7cd0" fontSize={11} />
                <YAxis stroke="#9d7cd0" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#1a0b2e",
                    border: "1px solid #5c2d9c",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#c084fc"
                  strokeWidth={2.5}
                  fill="url(#gViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="bg-[#160828] border border-purple-500/20 rounded-2xl p-5"
          data-testid="chart-top-pages"
        >
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

      {/* Funnel */}
      <div
        className="bg-[#160828] border border-purple-500/20 rounded-2xl p-6"
        data-testid="funnel-conversion"
      >
        <h3 className="text-sm font-semibold text-purple-200/80 uppercase tracking-widest mb-6">
          Funil de conversão · {PERIODS.find((p) => p.v === period)?.label}
        </h3>
        <div className="space-y-3">
          {funnel.map((f, i) => {
            const max = Math.max(...funnel.map((x) => x.value), 1);
            const pct = (f.value / max) * 100;
            const prev = i > 0 ? funnel[i - 1].value : null;
            const dropoff =
              prev && prev > 0
                ? Math.round(((prev - f.value) / prev) * 100)
                : null;
            return (
              <div key={f.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white font-medium">{f.name}</span>
                  <div className="flex items-center gap-3">
                    {dropoff !== null && dropoff > 0 && (
                      <span className="text-[10px] text-red-300/80">
                        ↓ {dropoff}%
                      </span>
                    )}
                    <span className="text-sm text-purple-200 font-bold">{f.value}</span>
                  </div>
                </div>
                <div className="h-4 bg-purple-950/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${f.color}, ${f.color}bb)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
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
