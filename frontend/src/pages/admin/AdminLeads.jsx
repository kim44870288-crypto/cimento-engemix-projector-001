import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Phone, Mail, MapPin, Search } from "lucide-react";

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

  useEffect(() => {
    document.title = "Orçamentos · Painel";
    load();
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
    } catch {}
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

  return (
    <div className="space-y-6" data-testid="admin-leads">
      <div>
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <p className="text-purple-200/60 text-sm">
          Leads recebidos pelo formulário do site — total: {leads.length}
        </p>
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
            <option key={s.v} value={s.v}>{s.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#160828] border border-purple-500/20 rounded-2xl p-10 text-center text-purple-200/60">
          Nenhum orçamento encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="leads-list">
          {filtered.map((l) => {
            const st = STATUS.find((s) => s.v === (l.status || "novo")) || STATUS[0];
            return (
              <div
                key={l.id}
                className="bg-[#160828] border border-purple-500/20 rounded-2xl p-5"
                data-testid={`lead-card-${l.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-white font-semibold">{l.nome}</div>
                    <div className="text-xs text-purple-200/50">
                      {new Date(l.created_at).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${st.bg}`}>
                    {st.label}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-purple-100/90">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-purple-300/70" />
                    <a href={`tel:${l.telefone}`} className="hover:underline">{l.telefone}</a>
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

                <div className="mt-4 pt-4 border-t border-purple-900/40 flex flex-wrap gap-2">
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
