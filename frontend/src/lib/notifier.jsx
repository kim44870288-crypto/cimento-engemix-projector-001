import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Bell } from "lucide-react";
import { toast } from "sonner";

// Polls new leads and fires a toast + updates a badge count.
// Also plays a subtle beep (using Web Audio) when a new lead arrives.
let audioCtx = null;
function beep() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.25);
    g.gain.setValueAtTime(0.001, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.3);
  } catch {}
}

export function useLeadsNotifier() {
  const [count, setCount] = useState(0);
  const [lastCount, setLastCount] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await api.get("/admin/leads", { params: { limit: 1 } });
        if (!alive) return;
        const c = r.data.count ?? 0;
        setCount(c);
        setLastCount((prev) => {
          if (prev !== null && c > prev) {
            const diff = c - prev;
            const latest = r.data.items?.[0];
            toast.success(
              `${diff} novo${diff > 1 ? "s" : ""} orçamento${diff > 1 ? "s" : ""} recebido${diff > 1 ? "s" : ""}!`,
              {
                description: latest?.nome
                  ? `${latest.nome}${latest.cidade ? " - " + latest.cidade : ""}`
                  : undefined,
                icon: <Bell size={18} className="text-amber-400" />,
                duration: 8000,
              }
            );
            beep();
          }
          return c;
        });
      } catch {}
    };
    load();
    const t = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return count;
}
