import { useEffect, useState } from "react";
import { X, Users, Eye, MessageCircle, FileText, TrendingUp, UserCheck } from "lucide-react";
import { api } from "@/lib/api";

const META = {
  visitors: {
    title: "Visitantes únicos",
    icon: Users,
    color: "text-purple-300",
    description:
      "Cada aparelho/navegador que visitou o site é contado 1 vez. Se a mesma pessoa entra duas vezes no mesmo navegador, conta como 1 visitante.",
  },
  pageviews: {
    title: "Pageviews",
    icon: Eye,
    color: "text-blue-300",
    description:
      "Cada abertura ou navegação para uma página. Se um visitante abre 5 páginas, gera 5 pageviews.",
  },
  whatsapp: {
    title: "Cliques no WhatsApp",
    icon: MessageCircle,
    color: "text-emerald-300",
    description:
      "Cada vez que alguém clicou no ícone flutuante, num slide ou nos botões do WhatsApp para abrir a conversa.",
  },
  leads_period: {
    title: "Orçamentos recebidos",
    icon: FileText,
    color: "text-amber-300",
    description:
      "Formulários enviados pela página /orcamento no período selecionado.",
  },
  events: {
    title: "Eventos totais",
    icon: TrendingUp,
    color: "text-pink-300",
    description:
      "Tudo que acontece no site é um evento: pageview (abrir página), whatsapp_click (clicar no WhatsApp), lead_created (novo orçamento), heartbeat (aba aberta), etc. Este número é a soma de todos.",
  },
  leads_all: {
    title: "Orçamentos · todos os tempos",
    icon: UserCheck,
    color: "text-indigo-300",
    description:
      "Total de orçamentos recebidos desde o início do sistema, sem filtro de período.",
  },
};

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function DeviceLabel({ ua }) {
  if (!ua) return <span className="text-purple-300/40">-</span>;
  const m = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|SamsungBrowser)/i);
  const os = ua.match(/(Windows|Mac OS|Linux|Android|iPhone|iPad|iOS)/i);
  return (
    <span className="text-xs text-purple-200/70">
      {m?.[0] || "?"} · {os?.[0] || "?"}
    </span>
  );
}

export default function DashboardDetailModal({ kind, period, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!kind) return;
    setLoading(true);
    api
      .get("/admin/details", { params: { kind, period, limit: 500 } })
      .then((r) => setData(r.data))
      .catch(() => setData({ items: [] }))
      .finally(() => setLoading(false));
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [kind, period, onClose]);

  if (!kind) return null;
  const meta = META[kind] || { title: kind, icon: TrendingUp, description: "" };
  const Icon = meta.icon;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      data-testid="dash-detail-modal"
    >
      <div
        className="relative w-full max-w-4xl max-h-[85vh] bg-[#160828] border border-purple-500/30 rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-6 border-b border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl bg-purple-900/50 flex items-center justify-center ${meta.color}`}>
              <Icon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{meta.title}</h2>
              <p className="text-sm text-purple-200/70 mt-1 max-w-2xl">
                {meta.description}
              </p>
              <p className="text-xs text-purple-300/60 mt-1">
                Período: {period === "24h" ? "últimas 24 horas" : period === "7d" ? "últimos 7 dias" : period === "30d" ? "últimos 30 dias" : "todos os tempos"}
                {data?.items && ` · ${data.items.length} registro${data.items.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            data-testid="dash-detail-close"
            className="text-purple-200/70 hover:text-white p-2 rounded-lg hover:bg-purple-900/40"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-purple-200/70">Carregando...</div>
          ) : !data?.items?.length ? (
            <div className="text-purple-200/60 text-center py-8">
              Nenhum registro nesse período.
            </div>
          ) : (
            <DetailTable kind={kind} items={data.items} />
          )}
        </div>
      </div>
    </div>
  );
}

function DetailTable({ kind, items }) {
  if (kind === "visitors") {
    return (
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-purple-300/70 tracking-wider text-left">
          <tr>
            <th className="py-2 pr-2">Sessão</th>
            <th className="py-2 pr-2">IP</th>
            <th className="py-2 pr-2">Dispositivo</th>
            <th className="py-2 pr-2">Última página</th>
            <th className="py-2 pr-2">Páginas visitadas</th>
            <th className="py-2 pr-2 text-right">Eventos</th>
            <th className="py-2 pr-2">Última atividade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-900/40">
          {items.map((v, i) => (
            <tr key={i} className="text-purple-100/90">
              <td className="py-2 pr-2 font-mono text-xs">{v._id.slice(0, 10)}…</td>
              <td className="py-2 pr-2 text-xs">{v.ip || "-"}</td>
              <td className="py-2 pr-2"><DeviceLabel ua={v.user_agent} /></td>
              <td className="py-2 pr-2 text-xs">{v.last_page || "-"}</td>
              <td className="py-2 pr-2 text-xs">{(v.pages || []).filter(Boolean).length}</td>
              <td className="py-2 pr-2 text-right">{v.events}</td>
              <td className="py-2 pr-2 text-xs">{fmtTime(v.last_seen)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (kind === "leads_period" || kind === "leads_all") {
    return (
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-purple-300/70 tracking-wider text-left">
          <tr>
            <th className="py-2 pr-2">Data</th>
            <th className="py-2 pr-2">Nome</th>
            <th className="py-2 pr-2">Telefone</th>
            <th className="py-2 pr-2">Cidade / UF</th>
            <th className="py-2 pr-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-900/40">
          {items.map((l, i) => (
            <tr key={i} className="text-purple-100/90">
              <td className="py-2 pr-2 text-xs">{fmtTime(l.created_at)}</td>
              <td className="py-2 pr-2 font-medium text-white">{l.nome}</td>
              <td className="py-2 pr-2">{l.telefone}</td>
              <td className="py-2 pr-2">{[l.cidade, l.estado].filter(Boolean).join(" / ") || "-"}</td>
              <td className="py-2 pr-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-purple-500/40 bg-purple-500/20 text-purple-100">
                  {l.status || "novo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // events / pageviews / whatsapp
  return (
    <table className="w-full text-sm">
      <thead className="text-xs uppercase text-purple-300/70 tracking-wider text-left">
        <tr>
          <th className="py-2 pr-2">Quando</th>
          <th className="py-2 pr-2">Tipo</th>
          <th className="py-2 pr-2">Página</th>
          <th className="py-2 pr-2">Sessão</th>
          <th className="py-2 pr-2">IP</th>
          {kind === "whatsapp" && <th className="py-2 pr-2">Origem</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-purple-900/40">
        {items.map((e, i) => (
          <tr key={i} className="text-purple-100/90">
            <td className="py-2 pr-2 text-xs">{fmtTime(e.created_at)}</td>
            <td className="py-2 pr-2">
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-purple-900/50 text-purple-200">
                {e.type}
              </span>
            </td>
            <td className="py-2 pr-2 text-xs font-mono">{e.page || "-"}</td>
            <td className="py-2 pr-2 font-mono text-xs">
              {e.session_id ? e.session_id.slice(0, 10) + "…" : "-"}
            </td>
            <td className="py-2 pr-2 text-xs">{e.ip || "-"}</td>
            {kind === "whatsapp" && (
              <td className="py-2 pr-2 text-xs text-purple-200/70">
                {e.meta?.source || "-"}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
