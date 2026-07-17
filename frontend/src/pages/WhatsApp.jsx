import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function WhatsApp() {
  useEffect(() => {
    document.title = "Compartilhe no WhatsApp";
    return () => {
      document.title =
        "Engemix | O melhor Concreto Usinado do Brasil para sua Obra!";
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      data-testid="whatsapp-page"
    >
      {/* Simple header - WhatsApp style */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/home"
            aria-label="Voltar para Engemix"
            data-testid="wa-back-home"
            className="flex items-center gap-2 text-[#00A884] hover:opacity-80 transition"
          >
            {/* WhatsApp brand mark */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 3C8.82 3 3 8.82 3 16c0 2.29.62 4.44 1.72 6.29L3 29l6.85-1.71A12.94 12.94 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3z"
                fill="#00A884"
              />
              <path
                d="M22.62 19.36c-.36-.18-2.12-1.04-2.44-1.16-.33-.12-.57-.18-.8.18-.24.36-.92 1.16-1.13 1.4-.21.24-.42.27-.78.09-.36-.18-1.51-.56-2.87-1.77-1.06-.94-1.78-2.11-1.99-2.47-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.8-1.92-1.09-2.63-.29-.7-.58-.6-.8-.61h-.68c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3s1.29 3.47 1.47 3.71c.18.24 2.54 3.87 6.15 5.43.86.37 1.53.59 2.05.75.86.27 1.65.23 2.27.14.69-.1 2.12-.87 2.42-1.7.3-.83.3-1.55.21-1.7-.09-.15-.33-.24-.69-.42z"
                fill="#fff"
              />
            </svg>
            <span className="text-lg font-semibold text-gray-700">
              WhatsApp
            </span>
          </Link>

          <Link
            to="/home"
            data-testid="wa-close"
            aria-label="Fechar"
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            Fechar
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <section
          className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 lg:p-10 text-center"
          data-testid="wa-card"
        >
          {/* Avatar with verified badge */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src="/wa-engemix-avatar.jpg"
                alt="Votorantim - Engemix"
                className="w-24 h-24 rounded-full object-contain bg-white ring-1 ring-gray-200"
                data-testid="wa-avatar"
              />
            </div>
          </div>

          {/* Name */}
          <h1
            className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2 mb-1"
            data-testid="wa-name"
          >
            Votorantim - Engemix
            <img
              src="/wa-verified.png"
              alt="Perfil verificado"
              className="w-5 h-5"
            />
          </h1>
          <p className="text-sm text-gray-500 mb-8">Compartilhe no WhatsApp</p>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-3">
            <a
              href="#"
              role="button"
              data-testid="wa-open-app"
              className="w-full max-w-[220px] bg-[#00A884] hover:bg-[#00966F] text-white font-semibold py-3 rounded-full transition"
            >
              Abrir app
            </a>
            <a
              href="#"
              role="button"
              data-testid="wa-open-web"
              className="w-full max-w-[220px] border-2 border-[#00A884] text-[#00A884] hover:bg-[#00A884]/5 font-semibold py-3 rounded-full transition"
            >
              Continuar para o WhatsApp Web
            </a>
          </div>

          {/* Divider */}
          <div className="mt-10 mb-6 border-t border-gray-100" />

          {/* No app CTA */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#00DB40]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 1024 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M522 141C320.4 141 157 304.4 157 506c0 66.3 17.7 128.5 48.6 182.1L157 871l189.6-44.8C398.7 854.7 458.4 871 522 871c201.6 0 365-163.4 365-365S723.6 141 522 141zm0 664.6c-61-.001-117.7-18.2-165.1-49.5L244.9 784.6l31.4-107.1C242.3 628.9 222.4 569.8 222.4 506c0-165.5 134.1-299.6 299.6-299.6 165.5 0 299.6 134.1 299.6 299.6S687.5 805.6 522 805.6z"
                  fill="#fff"
                />
                <path
                  d="M607.5 554.2l88.3 41.6c4.1 1.9 6.7 6 6.3 10.5-1 11.6-5.6 34.9-26.5 55.8-58.9 58.9-164.8-7.7-169.1-10.3-26-14-50.8-32.7-74.2-56.1-23.4-23.4-42.2-48.2-56.1-74.2-2.6-4.3-69.3-110.1-10.3-169.1 20.9-20.9 44.2-25.5 55.8-26.5 4.5-.4 8.6 2.2 10.5 6.3l41.6 88.3c2 4.2 1.1 9.2-2.2 12.4l-31 31c-6.7 6.7-8.7 17.2-4.1 25.5 11.3 20.3 26.6 39.9 44.2 57.9 18 17.6 37.6 32.9 57.9 44.2 8.3 4.6 18.8 2.7 25.5-4.1l31-31c3.3-3.3 8.3-4.1 12.4-2.2z"
                  fill="#fff"
                />
              </svg>
            </span>
            <span>Não tem o app?</span>
            <a
              href="#"
              data-testid="wa-download"
              className="underline underline-offset-4 decoration-[#00DB40] decoration-2 font-semibold text-gray-900 hover:opacity-80"
            >
              Baixar agora
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-gray-400 bg-white border-t border-gray-100">
        © Engemix - Votorantim Cimentos
      </footer>
    </div>
  );
}
