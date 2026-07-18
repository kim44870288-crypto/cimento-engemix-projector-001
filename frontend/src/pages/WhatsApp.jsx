import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Download, Menu, X } from "lucide-react";
import { trackPageview, track } from "@/lib/tracker";
import { api } from "@/lib/api";

const WA_LOGO = (
  <svg
    width="120"
    height="26"
    viewBox="0 0 1487.13 346"
    fill="none"
    role="img"
    aria-label="Logotipo do WhatsApp"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#25D366"
      d="M1127.34,188.81l21.43-65.42,21.65,65.42h-43.08ZM1428.25,229.87c-15.56,0-24.36-10.83-24.36-32.93v-5.64c0-20.08,9.25-32.26,25.26-32.26,13.08,0,23.68,9.25,23.68,34.96s-9.7,35.87-24.59,35.87ZM1370.28,297.09h33.38v-55.94c8.12,10.83,20.08,15.79,32.93,15.79,31.13,0,50.53-24.36,50.53-63.84s-16.69-61.13-48.27-61.13c-15.56,0-27.29,5.64-36.09,17.37v-13.76h-32.48v161.51ZM1296.75,229.87c-15.56,0-24.36-10.83-24.36-32.93v-5.64c0-20.08,9.25-32.26,25.26-32.26,13.08,0,23.68,9.25,23.68,34.96s-9.7,35.87-24.59,35.87ZM1238.77,297.09h33.38v-55.94c8.12,10.83,20.08,15.79,32.93,15.79,31.13,0,50.53-24.36,50.53-63.84s-16.69-61.13-48.27-61.13c-15.56,0-27.29,5.64-36.09,17.37v-13.76h-32.48v161.51ZM1070.95,253.32h35.64l11.96-35.64h60.68l11.96,35.64h36.77l-57.52-161.06h-41.73l-57.75,161.06ZM1014.33,256.93c34.06,0,51.43-13.99,51.43-36.99s-10.83-32.48-41.96-37.67l-14.66-2.48c-12.63-2.03-16.47-6.09-16.47-12.63s4.96-11.73,19.17-11.73c13.31,0,18.72,4.96,20.98,17.59h31.13c-1.8-26.84-18.95-41.05-52.11-41.05-30.9,0-50.75,13.31-50.75,36.09s13.31,31.58,43.08,36.54l13.53,2.26c12.41,2.03,15.34,6.54,15.34,13.31,0,7.89-5.19,12.86-19.4,12.86s-22.33-5.41-23.68-17.82h-31.81c1.13,29.32,22.56,41.73,56.17,41.73ZM921.85,256.03c10.38,0,20.98-2.93,27.29-7.22v-25.26c-6.32,3.61-12.41,5.41-18.05,5.41-9.7,0-14.89-4.06-14.89-16.47v-50.75h32.93v-26.17h-32.93v-32.48h-29.78v18.05c0,10.15-2.48,14.44-12.63,14.44h-8.8v26.17h17.82v51.88c0,27.29,10.38,42.41,39.02,42.41ZM796.89,233.47c-10.83,0-16.92-4.74-16.92-13.08,0-9.47,6.99-13.99,23.23-16.69,9.02-1.58,16.02-3.38,21.43-7.22v11.5c0,15.56-11.05,25.49-27.75,25.49ZM788.31,256.93c17.37,0,29.55-7.22,39.02-17.82,1.13,5.64,3.16,10.38,5.86,14.21h31.58c-5.64-8.8-8.12-21.88-8.12-39.25v-37.67c0-27.97-14.89-44.44-50.08-44.44-31.13,0-49.4,12.86-53.01,41.05h30.45c1.8-10.83,8.35-17.14,21.43-17.14,12.18,0,19.17,4.96,19.17,13.53s-5.19,11.5-28.2,14.89c-25.04,3.61-48.05,12.63-48.05,37.9,0,22.56,16.02,34.74,39.93,34.74ZM625.23,253.32h33.38v-69.02c0-8.12,2.03-11.96,6.99-16.92,4.96-4.96,11.5-7.67,18.5-7.67,11.05,0,16.92,6.09,16.92,20.98v72.63h33.38v-78.95c0-27.29-13.53-42.41-39.02-42.41-13.08,0-25.26,4.06-36.77,17.59v-57.29h-33.38v161.06ZM444.09,253.32h36.77l26.62-116.17,27.07,116.17h37.22l42.63-161.06h-36.99l-25.26,118.87-27.07-117.97h-33.38l-27.52,118.42-25.26-119.33h-38.12l43.31,161.06Z"
    />
    <g fill="#25D366">
      <path d="M173,0C77.45,0,0,77.45,0,173c0,31.43,8.38,60.91,23.04,86.31L0,346l89.87-21.25c24.67,13.54,53,21.25,83.13,21.25,95.55,0,173-77.45,173-173S268.55,0,173,0ZM173,315.01c-28.91,0-55.81-8.64-78.24-23.48l-53.1,13.52,14.89-50.75c-16.11-23.03-25.56-51.06-25.56-81.3,0-78.43,63.58-142.01,142.01-142.01s142.01,63.58,142.01,142.01-63.58,142.01-142.01,142.01Z" />
      <path d="M213.54,195.84l41.86,19.73c1.92.91,3.15,2.85,2.98,4.97-.45,5.51-2.66,16.55-12.56,26.44-27.93,27.93-78.09-3.67-80.13-4.89-12.34-6.63-24.06-15.49-35.17-26.61-11.11-11.11-19.98-22.84-26.61-35.17-1.22-2.04-32.82-52.19-4.89-80.13,9.9-9.9,20.93-12.1,26.44-12.56,2.12-.17,4.07,1.06,4.97,2.98l19.73,41.86c.93,1.98.52,4.33-1.02,5.88l-14.71,14.71c-3.18,3.18-4.12,8.13-1.92,12.06,5.37,9.63,12.59,18.9,20.95,27.43,8.53,8.36,17.8,15.58,27.43,20.95,3.93,2.19,8.88,1.26,12.06-1.92l14.71-14.71c1.55-1.55,3.9-1.96,5.88-1.02Z" />
    </g>
  </svg>
);

const NAV = [
  { label: "Página inicial", href: "#" },
  { label: "Apps", href: "#" },
  {
    label: "Recursos",
    href: "#",
    children: [
      { label: "Ligações", href: "#" },
      { label: "Mensagens", href: "#" },
      { label: "Grupos", href: "#" },
      { label: "Status", href: "#" },
      { label: "Canais", href: "#" },
      { label: "Meta AI", href: "#" },
    ],
  },
  { label: "Segurança", href: "#" },
  { label: "Privacidade", href: "#" },
  { label: "Central de Ajuda", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Para empresas", href: "#" },
];

const FOOTER_COLS = [
  {
    title: "O que fazemos",
    links: ["Recursos", "Blog", "Segurança", "Para empresas"],
  },
  {
    title: "Quem somos",
    links: ["Quem somos", "Carreiras", "Central de marcas", "Privacidade"],
  },
  {
    title: "Use o WhatsApp",
    links: ["Android", "iPhone", "Mac/PC", "WhatsApp Web"],
  },
  {
    title: "Precisa de ajuda?",
    links: [
      "Fale conosco",
      "Central de Ajuda",
      "Apps",
      "Alertas de Segurança",
    ],
  },
];

export default function WhatsAppPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [recOpen, setRecOpen] = useState(false);
  const [waCfg, setWaCfg] = useState({
    whatsapp_number: "554121122023",
    whatsapp_message: "Olá! Gostaria de solicitar um orçamento.",
  });

  useEffect(() => {
    trackPageview();
    document.title = "Compartilhe no WhatsApp";
    api
      .get("/config/public")
      .then((r) => setWaCfg(r.data))
      .catch(() => {});
    return () => {
      document.title =
        "Engemix | O melhor Concreto Usinado do Brasil para sua Obra!";
    };
  }, []);

  const digits = (waCfg.whatsapp_number || "").replace(/\D/g, "");
  const msg = encodeURIComponent(waCfg.whatsapp_message || "");
  const appLink = `whatsapp://send?phone=${digits}${msg ? `&text=${msg}` : ""}`;
  const webLink = `https://web.whatsapp.com/send?phone=${digits}${msg ? `&text=${msg}` : ""}`;
  const downloadLink = "https://www.whatsapp.com/download";

  const handleOpen = (source) => track("whatsapp_open", { source });

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      data-testid="whatsapp-page"
    >
      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link to="/home" aria-label="Página inicial" data-testid="wa-header-logo">
            {WA_LOGO}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setRecOpen(true)}
                  onMouseLeave={() => setRecOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-gray-800 hover:text-[#00A884] font-medium"
                    data-testid={`wa-nav-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${recOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {recOpen && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                      {item.children.map((c) => (
                        <a
                          key={c.label}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#00A884]"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href="#"
                  data-testid={`wa-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-gray-800 hover:text-[#00A884] font-medium"
                >
                  {item.label}
                </a>
              )
            )}
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="wa-header-download"
              className="flex items-center gap-2 bg-[#00A884] hover:bg-[#00966F] text-white text-sm font-semibold px-5 py-2 rounded-full transition"
            >
              Baixar
              <Download size={16} />
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden text-gray-700 p-2"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label={menuOpen ? "Fechar" : "Abrir menu"}
            data-testid="mobile-menu-toggle"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <ul className="py-2">
              {NAV.map((item) => (
                <li key={item.label} className="border-b border-gray-50">
                  <a
                    href="#"
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-sm text-gray-800 hover:bg-gray-50"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="px-6 py-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-[#00A884] text-white text-sm font-semibold px-5 py-2 rounded-full"
                >
                  Baixar <Download size={16} />
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 lg:py-16 bg-gray-50">
        <section
          className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 lg:p-12 text-center"
          data-testid="wa-card"
        >
          <div className="flex justify-center mb-5">
            <img
              src="/wa-engemix-avatar.jpg"
              alt="Votorantim - Engemix"
              className="w-28 h-28 rounded-full object-contain bg-white ring-1 ring-gray-200"
              data-testid="wa-avatar"
            />
          </div>

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

          <div className="flex flex-col items-center gap-3">
            <a
              href={appLink}
              target="_blank"
              rel="noopener noreferrer"
              role="button"
              onClick={() => handleOpen("open_app")}
              data-testid="wa-open-app"
              className="w-full max-w-[240px] bg-[#00A884] hover:bg-[#00966F] text-white font-semibold py-3 rounded-full transition"
            >
              Abrir app
            </a>
            <a
              href={webLink}
              target="_blank"
              rel="noopener noreferrer"
              role="button"
              onClick={() => handleOpen("open_web")}
              data-testid="wa-open-web"
              className="w-full max-w-[240px] border-2 border-[#00A884] text-[#00A884] hover:bg-[#00A884]/5 font-semibold py-3 rounded-full transition"
            >
              Continuar para o WhatsApp Web
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-800">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#00DB40]">
              <svg
                width="14"
                height="14"
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
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="wa-download"
              onClick={() => handleOpen("download_link")}
              className="underline underline-offset-4 decoration-[#00DB40] decoration-2 font-semibold text-gray-900 hover:opacity-80"
            >
              Baixar agora
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className="w-full bg-[#111B21] text-white"
        data-testid="wa-footer"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          {/* Top: logo + download button */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-white/10">
            <a href="#" aria-label="WhatsApp" className="inline-block">
              <svg
                width="130"
                height="28"
                viewBox="0 0 1487.13 346"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#fff"
                  d="M1127.34,188.81l21.43-65.42,21.65,65.42h-43.08ZM1428.25,229.87c-15.56,0-24.36-10.83-24.36-32.93v-5.64c0-20.08,9.25-32.26,25.26-32.26,13.08,0,23.68,9.25,23.68,34.96s-9.7,35.87-24.59,35.87ZM1370.28,297.09h33.38v-55.94c8.12,10.83,20.08,15.79,32.93,15.79,31.13,0,50.53-24.36,50.53-63.84s-16.69-61.13-48.27-61.13c-15.56,0-27.29,5.64-36.09,17.37v-13.76h-32.48v161.51ZM1296.75,229.87c-15.56,0-24.36-10.83-24.36-32.93v-5.64c0-20.08,9.25-32.26,25.26-32.26,13.08,0,23.68,9.25,23.68,34.96s-9.7,35.87-24.59,35.87ZM1238.77,297.09h33.38v-55.94c8.12,10.83,20.08,15.79,32.93,15.79,31.13,0,50.53-24.36,50.53-63.84s-16.69-61.13-48.27-61.13c-15.56,0-27.29,5.64-36.09,17.37v-13.76h-32.48v161.51ZM1070.95,253.32h35.64l11.96-35.64h60.68l11.96,35.64h36.77l-57.52-161.06h-41.73l-57.75,161.06ZM1014.33,256.93c34.06,0,51.43-13.99,51.43-36.99s-10.83-32.48-41.96-37.67l-14.66-2.48c-12.63-2.03-16.47-6.09-16.47-12.63s4.96-11.73,19.17-11.73c13.31,0,18.72,4.96,20.98,17.59h31.13c-1.8-26.84-18.95-41.05-52.11-41.05-30.9,0-50.75,13.31-50.75,36.09s13.31,31.58,43.08,36.54l13.53,2.26c12.41,2.03,15.34,6.54,15.34,13.31,0,7.89-5.19,12.86-19.4,12.86s-22.33-5.41-23.68-17.82h-31.81c1.13,29.32,22.56,41.73,56.17,41.73ZM921.85,256.03c10.38,0,20.98-2.93,27.29-7.22v-25.26c-6.32,3.61-12.41,5.41-18.05,5.41-9.7,0-14.89-4.06-14.89-16.47v-50.75h32.93v-26.17h-32.93v-32.48h-29.78v18.05c0,10.15-2.48,14.44-12.63,14.44h-8.8v26.17h17.82v51.88c0,27.29,10.38,42.41,39.02,42.41ZM796.89,233.47c-10.83,0-16.92-4.74-16.92-13.08,0-9.47,6.99-13.99,23.23-16.69,9.02-1.58,16.02-3.38,21.43-7.22v11.5c0,15.56-11.05,25.49-27.75,25.49ZM788.31,256.93c17.37,0,29.55-7.22,39.02-17.82,1.13,5.64,3.16,10.38,5.86,14.21h31.58c-5.64-8.8-8.12-21.88-8.12-39.25v-37.67c0-27.97-14.89-44.44-50.08-44.44-31.13,0-49.4,12.86-53.01,41.05h30.45c1.8-10.83,8.35-17.14,21.43-17.14,12.18,0,19.17,4.96,19.17,13.53s-5.19,11.5-28.2,14.89c-25.04,3.61-48.05,12.63-48.05,37.9,0,22.56,16.02,34.74,39.93,34.74ZM625.23,253.32h33.38v-69.02c0-8.12,2.03-11.96,6.99-16.92,4.96-4.96,11.5-7.67,18.5-7.67,11.05,0,16.92,6.09,16.92,20.98v72.63h33.38v-78.95c0-27.29-13.53-42.41-39.02-42.41-13.08,0-25.26,4.06-36.77,17.59v-57.29h-33.38v161.06ZM444.09,253.32h36.77l26.62-116.17,27.07,116.17h37.22l42.63-161.06h-36.99l-25.26,118.87-27.07-117.97h-33.38l-27.52,118.42-25.26-119.33h-38.12l43.31,161.06Z"
                />
                <g fill="#fff">
                  <path d="M173,0C77.45,0,0,77.45,0,173c0,31.43,8.38,60.91,23.04,86.31L0,346l89.87-21.25c24.67,13.54,53,21.25,83.13,21.25,95.55,0,173-77.45,173-173S268.55,0,173,0ZM173,315.01c-28.91,0-55.81-8.64-78.24-23.48l-53.1,13.52,14.89-50.75c-16.11-23.03-25.56-51.06-25.56-81.3,0-78.43,63.58-142.01,142.01-142.01s142.01,63.58,142.01,142.01-63.58,142.01-142.01,142.01Z" />
                  <path d="M213.54,195.84l41.86,19.73c1.92.91,3.15,2.85,2.98,4.97-.45,5.51-2.66,16.55-12.56,26.44-27.93,27.93-78.09-3.67-80.13-4.89-12.34-6.63-24.06-15.49-35.17-26.61-11.11-11.11-19.98-22.84-26.61-35.17-1.22-2.04-32.82-52.19-4.89-80.13,9.9-9.9,20.93-12.1,26.44-12.56,2.12-.17,4.07,1.06,4.97,2.98l19.73,41.86c.93,1.98.52,4.33-1.02,5.88l-14.71,14.71c-3.18,3.18-4.12,8.13-1.92,12.06,5.37,9.63,12.59,18.9,20.95,27.43,8.53,8.36,17.8,15.58,27.43,20.95,3.93,2.19,8.88,1.26,12.06-1.92l14.71-14.71c1.55-1.55,3.9-1.96,5.88-1.02Z" />
                </g>
              </svg>
            </a>
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="wa-footer-download"
              className="inline-flex items-center gap-2 bg-[#00A884] hover:bg-[#00966F] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition self-start"
            >
              Baixar
              <Download size={16} />
            </a>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-10">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-base font-semibold text-white mb-4">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        data-testid={`wa-footer-${l
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")}`}
                        className="text-sm text-white/80 hover:text-white hover:underline"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-xs text-white/60">
            <p>© 2026 WhatsApp LLC</p>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="hover:text-white hover:underline">
                Termos e Política de Privacidade
              </a>
              <a href="#" className="hover:text-white hover:underline">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
