import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Eye, MessageCircle, FileText, MousePointerClick, Radio, Activity as ActivityIcon } from "lucide-react";

const ICONS = {
  pageview: { Icon: Eye, color: "text-blue-300 bg-blue-500/20" },
  whatsapp_click: { Icon: MessageCircle, color: "text-emerald-300 bg-emerald-500/20" },
  lead_created: { Icon: FileText, color: "text-amber-300 bg-amber-500/20" },
  hero_slide_click: { Icon: MousePointerClick, color: "text-pink-300 bg-pink-500/20" },
  heartbeat: { Icon: Radio, color: "text-purple-300 bg-purple-500/20" },
};

const LABELS = {
  pageview: "Visitou página",
  whatsapp_click: "Clicou no WhatsApp",
  lead_created: "Enviou orçamento",
  hero_slide_click: "Clicou no carrossel",
  heartbeat: "Sessão ativa",
};

function timeAgo(iso) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `há ${s}s`;
  if (s < 3600) return `há ${Math.floor(s / 60)}min`;
  if (s < 86400) return `há ${Math.floor(s / 3600)}h`;
  return `há ${Math.floor(s / 86400)}d`;
}

export default function AdminActivity() {
  const [items, setItems] = useState([]);
  const [live, setLive] = useState(true);
  const sinceRef = useRef(null);

  useEffect(() => {
    document.title = "Atividade · Painel";
    let alive = true;

    const initial = async () => {
      const r = await api.get("/admin/activity", { params: { limit: 100 } });
      if (!alive) return;
      setItems(r.data.items);
      if (r.data.items[0]) sinceRef.current = r.data.items[0].created_at;
    };
    initial();

    const t = setInterval(async () => {
      if (!live) return;
      try {
        const r = await api.get("/admin/activity", {
          params: { limit: 50, since: sinceRef.current || undefined },
        });
        if (r.data.items.length && alive) {
          setItems((prev) => [...r.data.items, ...prev].slice(0, 300));
          sinceRef.current = r.data.items[0].created_at;
        }
      } catch {}
    }, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [live]);

  return (
    <div className="space-y-6" data-testid="admin-activity">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Atividade em tempo real</h1>
          <p className="text-purple-200/60 text-sm">
            Cada evento do site aparece aqui em segundos
          </p>
        </div>
        <button
          onClick={() => setLive((s) => !s)}
          data-testid="btn-toggle-live"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition ${
            live
              ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-200"
              : "bg-gray-600/20 border-gray-500/40 text-gray-300"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              live ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
            }`}
          />
          {live ? "Ao vivo" : "Pausado"}
        </button>
      </div>

      <div className="bg-[#160828] border border-purple-500/20 rounded-2xl p-4 lg:p-6">
        {items.length === 0 ? (
          <p className="text-sm text-purple-200/60 py-10 text-center">
            <ActivityIcon className="inline mr-2" size={16} />
            Nenhuma atividade registrada ainda. Abra o site em outra aba para começar.
          </p>
        ) : (
          <ul className="divide-y divide-purple-900/30" data-testid="activity-list">
            {items.map((e, idx) => {
              const cfg = ICONS[e.type] || { Icon: ActivityIcon, color: "text-purple-300 bg-purple-500/20" };
              const Icon = cfg.Icon;
              return (
                <li
                  key={`${e.created_at}-${idx}`}
                  className="flex items-center gap-4 py-3"
                  data-testid={`activity-item-${idx}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cfg.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium">
                      {LABELS[e.type] || e.type}
                      {e.page && (
                        <span className="text-purple-300/70 text-xs ml-2 font-mono">{e.page}</span>
                      )}
                    </div>
                    <div className="text-xs text-purple-200/50">
                      Sessão {e.session_id ? e.session_id.slice(0, 8) : "-"} · {e.ip || "-"}
                    </div>
                  </div>
                  <div className="text-xs text-purple-200/60 shrink-0">{timeAgo(e.created_at)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
