import { useEffect, useState } from "react";
import { api, API_URL } from "@/lib/api";
import { Phone, Mail, MapPin, Search, Download, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";

const STATUS = [
  { v: "novo", label: "Novo", bg: "bg-amber-500/20 text-amber-200 border-amber-500/40" },
  { v: "contatado", label: "Contatado", bg: "bg-blue-500/20 text-blue-200 border-blue-500/40" },
  { v: "convertido", label: "Convertido", bg: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40" },
  { v: "descartado", label: "Descartado", bg: "bg-gray-500/20 text-gray-300 border-gray-500/40" },
];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    document.title = "Orçamentos · Painel";
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  const load = async () => {
    try {
      const r = await api.get("/admin/leads", { params: { limit: 500 } });
      setLeads(r.data.items || []);
    } catch {}
  };

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/leads/${id}`, { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      toast.success(`Status atualizado para "${STATUS.find((s) => s.v === status)?.label}"`);
    } catch {
      toast.error("Falha ao atualizar status");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/leads/${id}`);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setConfirmDel(null);
      toast.success("Orçamento excluído");
    } catch {
      toast.error("Falha ao excluir");
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/admin/leads/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("fail");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orcamentos_engemix_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Exportação concluída");
    } catch {
      toast.error("Falha ao exportar");
    } finally {
      setExporting(false);
    }
  };

  const filtered = leads.filter((l) => {
    if (filter && (l.status || "novo") !== filter) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      (l.nome || "").toLowerCase().includes(s) ||
      (l.telefone || "").toLowerCase().includes(s) ||
      (l.cidade || "").toLowerCase().includes(s) ||
      (l.email || "").toLowerCase().includes(s)
    );
  });

  const stats = STATUS.reduce(
    (acc, s) => ({ ...acc, [s.v]: leads.filter((l) => (l.status || "novo") === s.v).length }),
    {}
  );

  return (
    <div className="space-y-6" data-testid="admin-leads">
      <Toaster position="top-center" richColors theme="dark" />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orçamentos</h1>
          <p className="text-purple-200/60 text-sm">
            {leads.length} leads recebidos ·
            <span className="text-amber-300 ml-2">{stats.novo || 0} novos</span> ·
            <span className="text-emerald-300 ml-2">{stats.convertido || 0} convertidos</span>
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={exporting || leads.length === 0}
          data-testid="btn-export-csv"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition"
        >
          <Download size={16} />
          {exporting ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/60" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, telefone, cidade, email..."
            data-testid="leads-search"
            className="w-full pl-10 h-11 rounded-xl bg-[#160828] border border-purple-500/30 text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-400 px-3"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          data-testid="leads-status-filter"
          className="h-11 rounded-xl bg-[#160828] border border-purple-500/30 text-white px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Todos os status</option>
          {STATUS.map((s) => (
            <option key={s.v} value={s.v}>
              {s.label} ({stats[s.v] || 0})
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#160828] border border-purple-500/20 rounded-2xl p-10 text-center text-purple-200/60">
          {leads.length === 0
            ? "Nenhum orçamento recebido ainda. Aguardando primeiro lead..."
            : "Nenhum resultado com esses filtros."}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="leads-list">
          {filtered.map((l) => {
            const st = STATUS.find((s) => s.v === (l.status || "novo")) || STATUS[0];
            const isConf = confirmDel === l.id;
            return (
              <div
                key={l.id}
                className="bg-[#160828] border border-purple-500/20 rounded-2xl p-5 relative"
                data-testid={`lead-card-${l.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-white font-semibold text-lg">{l.nome}</div>
                    <div className="text-xs text-purple-200/50">
                      {new Date(l.created_at).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${st.bg}`}>
                      {st.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm text-purple-100/90">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-purple-300/70" />
                    <a href={`tel:${l.telefone}`} className="hover:underline">
                      {l.telefone}
                    </a>
                    <a
                      href={`https://wa.me/${l.telefone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full"
                      data-testid={`lead-wa-${l.id}`}
                    >
                      Abrir WhatsApp
                    </a>
                  </div>
                  {l.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-purple-300/70" />
                      <a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a>
                    </div>
                  )}
                  {(l.cidade || l.estado) && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-purple-300/70" />
                      {[l.cidade, l.estado].filter(Boolean).join(" / ")}
                    </div>
                  )}
                  {l.tipo_obra && (
                    <div className="text-xs text-purple-200/70 mt-2">
                      <b>Tipo:</b> {l.tipo_obra}
                    </div>
                  )}
                  {l.volume && (
                    <div className="text-xs text-purple-200/70">
                      <b>Volume:</b> {l.volume} m³
                    </div>
                  )}
                  {l.cep && (
                    <div className="text-xs text-purple-200/70">
                      <b>CEP:</b> {l.cep}
                    </div>
                  )}
                  {l.cargo && (
                    <div className="text-xs text-purple-200/70">
                      <b>Cargo:</b> {l.cargo}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-purple-900/40 flex flex-wrap items-center gap-2">
                  {STATUS.map((s) => (
                    <button
                      key={s.v}
                      onClick={() => setStatus(l.id, s.v)}
                      data-testid={`lead-status-${l.id}-${s.v}`}
                      className={`text-xs px-3 py-1 rounded-full border transition ${
                        (l.status || "novo") === s.v
                          ? s.bg
                          : "bg-transparent border-purple-500/30 text-purple-200/60 hover:bg-purple-500/10"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                  <div className="ml-auto">
                    {!isConf ? (
                      <button
                        onClick={() => setConfirmDel(l.id)}
                        data-testid={`lead-del-${l.id}`}
                        aria-label="Excluir"
                        className="text-red-300/70 hover:text-red-200 hover:bg-red-600/10 p-2 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-2">
                        <span className="text-xs text-red-300">Excluir?</span>
                        <button
                          onClick={() => remove(l.id)}
                          data-testid={`lead-del-confirm-${l.id}`}
                          className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setConfirmDel(null)}
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full"
                        >
                          Não
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
