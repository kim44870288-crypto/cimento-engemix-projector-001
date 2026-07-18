import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { X, History, Check, Loader2 } from "lucide-react";

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function fmtDuration(seconds) {
  if (seconds == null || seconds < 0) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m || parts.length === 0) parts.push(`${m}min`);
  return parts.join(" ");
}

function fmtNumber(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  // +55 (11) 91234-5678 style, best effort
  if (digits.length >= 12) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, -4)}-${digits.slice(-4)}`;
  }
  return digits ? `+${digits}` : "—";
}

export default function WhatsAppHistoryModal({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .get("/admin/config/whatsapp-history")
      .then((r) => setItems(r.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      data-testid="wa-history-modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#160828] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-200">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Histórico do WhatsApp
              </h3>
              <p className="text-xs text-purple-200/60">
                Todos os números que já foram configurados
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="wa-history-close"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-purple-200/70 hover:text-white hover:bg-white/10 transition"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-10 flex items-center justify-center text-purple-200/70">
              <Loader2 className="animate-spin mr-2" size={18} /> Carregando...
            </div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-purple-200/60 text-sm">
              Nenhum histórico registrado ainda.
            </div>
          ) : (
            <table className="w-full text-sm" data-testid="wa-history-table">
              <thead className="text-xs uppercase tracking-widest text-purple-200/60 bg-[#0d0518]">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Número</th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Adicionado em
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Removido em
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Tempo ativo
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr
                    key={it.id}
                    data-testid={`wa-history-row-${i}`}
                    className="border-t border-purple-500/10 hover:bg-white/5"
                  >
                    <td className="px-6 py-3 text-white font-medium">
                      <div className="flex items-center gap-2">
                        {fmtNumber(it.number)}
                        {it.is_current && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                            data-testid="wa-history-current-badge"
                          >
                            <Check size={10} /> Atual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-purple-100/90">
                      {fmtDate(it.added_at)}
                    </td>
                    <td className="px-4 py-3 text-purple-100/90">
                      {it.removed_at ? fmtDate(it.removed_at) : "—"}
                    </td>
                    <td className="px-4 py-3 text-purple-100/90">
                      {fmtDuration(it.duration_seconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
