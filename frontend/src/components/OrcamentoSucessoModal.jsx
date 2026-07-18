import { Link } from "react-router-dom";
import { X, CheckCircle2, MessageCircle } from "lucide-react";
import { useEffect } from "react";

export default function OrcamentoSucessoModal({ open, onClose, nome }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      data-testid="orc-success-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="orc-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header vermelho com logo */}
        <div className="bg-[#E30613] px-6 pt-6 pb-10 flex items-center justify-center relative">
          <img
            src="https://www.engemix.com.br/wp-content/uploads/2024/04/LOGO-ENGEMIX-1.png"
            alt="Engemix"
            className="h-12 object-contain"
            data-testid="orc-modal-logo"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            data-testid="orc-modal-close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Check flutuante */}
        <div className="relative flex justify-center -mt-8">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={30} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pt-4 pb-8 text-center">
          <h2
            id="orc-modal-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Orçamento enviado!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {nome ? (
              <>
                <strong>{nome}</strong>, recebemos sua solicitação.
                <br />
              </>
            ) : (
              <>Recebemos sua solicitação. </>
            )}
            Em até 48h um consultor Engemix entrará em contato.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/whatsapp"
              onClick={onClose}
              data-testid="orc-modal-whatsapp"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1FAF38] text-white font-semibold py-3 rounded-full transition shadow-lg shadow-emerald-500/30"
            >
              <MessageCircle size={18} />
              Ir para o WhatsApp
            </Link>
            <button
              type="button"
              onClick={onClose}
              data-testid="orc-modal-dismiss"
              className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
            >
              Continuar navegando no site
            </button>
          </div>
        </div>

        {/* Rodapé sutil */}
        <div className="px-8 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-500">
            Engemix · Votorantim Cimentos · Concreto usinado de qualidade
          </p>
        </div>
      </div>
    </div>
  );
}
