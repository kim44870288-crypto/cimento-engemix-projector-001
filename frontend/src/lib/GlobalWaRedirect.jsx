import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { track } from "@/lib/tracker";

/**
 * Intercepta todos os cliques nas páginas públicas e redireciona para o
 * WhatsApp configurado no painel administrativo.
 *
 * Exceções (o clique passa normalmente):
 *  - Rotas do painel admin ("/donascimentopainel*")
 *  - Elementos dentro de <form>, <input>, <textarea>, <select>, <label>
 *  - Elementos com o atributo [data-no-wa-redirect]
 *  - Links para "/quem-somos" e "/orcamento" (os itens de menu)
 *  - Links que já apontam para wa.me / api.whatsapp.com / tel: / mailto:
 *  - Botão "Voltar ao topo" (data-testid="back-to-top")
 */
export default function GlobalWaRedirect() {
  const waHrefRef = useRef(
    "https://wa.me/554121122023?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento."
  );

  useEffect(() => {
    api
      .get("/config/public")
      .then((r) => {
        const digits = (r.data.whatsapp_number || "").replace(/\D/g, "");
        const msg = encodeURIComponent(r.data.whatsapp_message || "");
        if (digits) {
          waHrefRef.current = `https://wa.me/${digits}${msg ? `?text=${msg}` : ""}`;
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handler(ev) {
      // Skip modifier-click (open in new tab), middle-click, right-click
      if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) {
        return;
      }

      // Skip admin panel entirely
      if (window.location.pathname.startsWith("/donascimentopainel")) {
        return;
      }

      const target = ev.target;
      if (!(target instanceof Element)) return;

      // Skip if inside form fields or interactive form widgets
      if (target.closest("form, input, textarea, select, label")) {
        return;
      }

      // Skip if any ancestor opts out
      if (target.closest("[data-no-wa-redirect]")) {
        return;
      }

      // Skip back-to-top and other explicit safe controls
      if (target.closest('[data-testid="back-to-top"]')) {
        return;
      }

      // Inspect nearest <a> to allow specific links to work as-is
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        // Already going to WhatsApp / phone / mail → let it through
        if (
          href.startsWith("https://wa.me") ||
          href.startsWith("http://wa.me") ||
          href.includes("api.whatsapp.com") ||
          href.includes("web.whatsapp.com") ||
          href.startsWith("tel:") ||
          href.startsWith("mailto:") ||
          href.startsWith("whatsapp://")
        ) {
          return;
        }
        // Menu items explicitly allowed
        if (
          href === "/quem-somos" ||
          href === "/orcamento" ||
          href.startsWith("/quem-somos") ||
          href.startsWith("/orcamento") ||
          href.startsWith("/donascimentopainel")
        ) {
          return;
        }
      }

      // Everything else → redirect to WhatsApp
      ev.preventDefault();
      ev.stopPropagation();
      try {
        track("global_wa_redirect", {
          page: window.location.pathname,
          tag: (target.tagName || "").toLowerCase(),
        });
      } catch (_) {}
      window.open(waHrefRef.current, "_blank", "noopener,noreferrer");
    }

    // Capture phase so we run before component onClick handlers
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}
