import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast, Toaster } from "sonner";
import { MessageCircle, Save, ExternalLink, History } from "lucide-react";
import WhatsAppHistoryModal from "./WhatsAppHistoryModal";

export default function AdminSettings() {
  const [cfg, setCfg] = useState({ whatsapp_number: "", whatsapp_message: "" });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    document.title = "Configurações · Painel";
    api
      .get("/admin/config")
      .then((r) => setCfg(r.data))
      .finally(() => setLoaded(true));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const digits = cfg.whatsapp_number.replace(/\D/g, "");
    if (digits.length < 10) {
      toast.error("Número inválido — informe DDI+DDD+número (ex: 554121122023)");
      return;
    }
    setSaving(true);
    try {
      await api.put("/admin/config", {
        whatsapp_number: digits,
        whatsapp_message: cfg.whatsapp_message,
      });
      toast.success("Configuração salva! O site público já foi atualizado.");
      setCfg((c) => ({ ...c, whatsapp_number: digits }));
    } catch (err) {
      toast.error("Falha ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const previewLink = `https://wa.me/${cfg.whatsapp_number}?text=${encodeURIComponent(cfg.whatsapp_message || "")}`;

  if (!loaded) return <div className="text-purple-200/70">Carregando...</div>;

  return (
    <div className="space-y-6 max-w-3xl" data-testid="admin-settings">
      <Toaster position="top-center" richColors theme="dark" />

      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-purple-200/60 text-sm">
          Ajustes que refletem instantaneamente no site público.
        </p>
      </div>

      <form onSubmit={save} className="bg-[#160828] border border-purple-500/20 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">WhatsApp de contato</h3>
            <p className="text-xs text-purple-200/60">
              Usado no ícone flutuante e na página /whatsapp
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest text-purple-200/70 uppercase mb-2">
            Número (com DDI e DDD)
          </label>
          <input
            type="text"
            value={cfg.whatsapp_number}
            onChange={(e) => setCfg({ ...cfg, whatsapp_number: e.target.value })}
            placeholder="554121122023"
            required
            data-testid="cfg-wa-number"
            className="w-full h-11 rounded-xl bg-[#0d0518] border border-purple-500/30 text-white px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <p className="mt-1 text-[11px] text-purple-200/50">
            Formato: 55 (DDI) + 41 (DDD) + número. Exemplo: 554121122023
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest text-purple-200/70 uppercase mb-2">
            Mensagem padrão
          </label>
          <textarea
            value={cfg.whatsapp_message}
            onChange={(e) => setCfg({ ...cfg, whatsapp_message: e.target.value })}
            rows={3}
            placeholder="Olá! Gostaria de solicitar um orçamento..."
            data-testid="cfg-wa-message"
            className="w-full rounded-xl bg-[#0d0518] border border-purple-500/30 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            data-testid="cfg-save"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <a
            href={previewLink}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="cfg-preview"
            className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 underline"
          >
            <ExternalLink size={14} /> Testar link no WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            data-testid="cfg-history-btn"
            className="ml-auto inline-flex items-center gap-2 border border-purple-500/40 hover:border-purple-400 text-purple-100 font-semibold px-5 py-2.5 rounded-xl transition hover:bg-purple-500/10"
          >
            <History size={16} />
            Histórico
          </button>
        </div>
      </form>

      <WhatsAppHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
