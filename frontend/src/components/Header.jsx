import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const MENU = [
  { label: "Quem somos", href: "#" },
  { label: "Orçamento", href: "#" },
  {
    label: "Produtos",
    href: "#",
    children: [
      { label: "Residenciais e pequenas obras", href: "#" },
      { label: "Edificações e obras especiais", href: "#" },
      { label: "Pavimento de Concreto", href: "#" },
    ],
  },
  { label: "Compre Aqui", href: "#" },
  { label: "Nosso App", href: "#" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const [mProdOpen, setMProdOpen] = useState(false);

  return (
    <header
      className="bg-[#E30613] w-full fixed top-0 left-0 z-30 shadow-md"
      data-testid="site-header"
    >
      <nav className="container mx-auto px-6 py-4 h-20 flex items-center">
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            data-testid="header-logo"
            aria-label="Engemix - Página Inicial"
            className="flex items-center"
          >
            <img
              src="https://www.engemix.com.br/wp-content/uploads/2024/04/LOGO-ENGEMIX-1.png"
              alt="Engemix"
              title="Engemix - Voltar para a página inicial"
              className="w-40 h-10 lg:w-56 lg:h-14 object-contain"
            />
          </a>

          {/* Desktop menu */}
          <ul className="hidden lg:flex items-center gap-6">
            {MENU.map((item) =>
              item.children ? (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setProdOpen(true)}
                  onMouseLeave={() => setProdOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 text-white text-base font-medium hover:text-gray-200 transition"
                    data-testid={`menu-${item.label.toLowerCase()}`}
                    onClick={() => setProdOpen((s) => !s)}
                    aria-expanded={prodOpen}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        prodOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {prodOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-56 bg-white rounded-lg shadow-xl overflow-hidden"
                      data-testid="produtos-dropdown"
                    >
                      <ul className="py-2">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a
                              href={c.href}
                              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-[#790800]"
                              data-testid={`submenu-${c.label
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.label}>
                  <a
                    href={item.href}
                    data-testid={`menu-${item.label
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-white text-base font-medium hover:text-gray-200 transition"
                  >
                    {item.label}
                  </a>
                </li>
              )
            )}
          </ul>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden text-white p-2"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden bg-[#E30613] border-t border-white/20"
          data-testid="mobile-menu"
        >
          <ul className="flex flex-col py-2">
            {MENU.map((item) =>
              item.children ? (
                <li key={item.label} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setMProdOpen((s) => !s)}
                    className="w-full flex items-center justify-between px-6 py-3 text-white font-medium"
                    aria-expanded={mProdOpen}
                    data-testid={`mmenu-${item.label.toLowerCase()}`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        mProdOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mProdOpen && (
                    <ul className="bg-black/20">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <a
                            href={c.href}
                            className="block px-10 py-2.5 text-sm text-white/90 hover:bg-black/30"
                            onClick={() => setOpen(false)}
                            data-testid={`msubmenu-${c.label
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.label} className="border-b border-white/10">
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-3 text-white font-medium hover:bg-black/20"
                    data-testid={`mmenu-${item.label
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {item.label}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
