const ENGEMIX_LINKS = [
  { label: "Quem somos", href: "#" },
  { label: "Nossas unidades", href: "#" },
  { label: "Nossos produtos", href: "#" },
  { label: "App Engemix", href: "#" },
];

const DUVIDAS_LINKS = [
  { label: "FAQ", href: "#" },
  { label: "Calculadora de Concreto", href: "#" },
  { label: "Nosso Blog", href: "#" },
  { label: "Política de privacidade", href: "#" },
];

export default function Footer() {
  return (
    <footer
      className="bg-[#0000bf] w-full text-white"
      data-testid="site-footer"
    >
      <nav className="container mx-auto px-4 lg:px-14 py-10 flex flex-col gap-12 lg:gap-16 lg:flex-row lg:flex-wrap lg:justify-between lg:items-start">
        {/* Top row: logos + social */}
        <div className="w-full flex flex-col lg:flex-row gap-8 items-center lg:justify-between">
          <a
            href="#"
            className="flex justify-center"
            aria-label="Engemix"
            data-testid="footer-logo-engemix"
          >
            <img
              src="https://www.engemix.com.br/wp-content/uploads/2024/04/LOGO-ENGEMIX-1.png"
              alt="Logo Engemix"
              className="w-52 h-12 object-contain"
            />
          </a>
          <a
            href="#"
            className="flex justify-center items-center"
            aria-label="Votorantim Cimentos"
            data-testid="footer-logo-vcimentos"
          >
            <img
              src="https://www.engemix.com.br/wp-content/uploads/2022/10/logo-v-e.png"
              alt="Logo Votorantim Cimentos"
              className="max-h-14 object-contain"
            />
          </a>

          {/* Social */}
          <div
            className="flex justify-center items-center gap-4"
            data-testid="footer-social"
          >
            <a
              href="#"
              aria-label="WhatsApp"
              data-testid="social-whatsapp"
              className="hover:scale-110 transition"
            >
              <svg width="36" height="36" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 34.5a34 34 0 0 0 4.6 17L.8 69.2l18-4.8A34.1 34.1 0 1 0 1 34.4Zm10.8 16.1-.7-1a28.2 28.2 0 0 1 24-43.4 28.2 28.2 0 0 1 28.4 28.3 28.3 28.3 0 0 1-42.8 24.4l-1-.6L9 61l2.8-10.5Z" fill="#25D366" />
                <path d="M26.6 20.2c-.6-1.4-1.3-1.4-1.9-1.4h-1.6c-.6 0-1.5.2-2.3 1-.8.9-3 3-3 7.1 0 4.2 3 8.3 3.5 8.8.4.6 5.9 9.5 14.5 12.9 7.2 2.8 8.7 2.3 10.3 2.1 1.5-.1 5-2 5.7-4 .7-2 .7-3.7.5-4a142.4 142.4 0 0 0-7.5-3.8c-.7-.3-1.3-.5-1.9.4-.5.8-2.2 2.7-2.6 3.3-.5.6-1 .6-1.9.2-.8-.4-3.6-1.3-6.8-4.2-2.6-2.3-4.3-5-4.8-5.9-.5-.9 0-1.3.4-1.7l1.3-1.5c.4-.5.5-.9.8-1.5.3-.5.2-1 0-1.4l-2.7-6.4Z" fill="#fff" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" data-testid="social-youtube" className="hover:scale-110 transition">
              <svg width="38" height="32" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M26 .7c2.2 0 4.5 0 6.7.2l2.6.1 2.4.2 2.4.1 2 .2a9.8 9.8 0 0 1 9.1 8.8l.1 1.1.2 2.4a105.1 105.1 0 0 1 0 15.2l-.2 2.4v1a9.8 9.8 0 0 1-9.1 9H40l-2.4.2-2.4.2-2.6.1a159.2 159.2 0 0 1-13.4 0l-2.6-.1-2.4-.2-2.4-.1-2-.2a9.8 9.8 0 0 1-9.1-8.8l-.1-1.1L.5 29a105 105 0 0 1 0-15.2l.2-2.4v-1a9.8 9.8 0 0 1 9.1-9h2.1l2.3-.2 2.5-.2 2.6-.1L26 .7Zm-5.2 14.4v12.6c0 1.2 1.3 2 2.4 1.3L34 22.7a1.6 1.6 0 0 0 0-2.6l-10.8-6.3a1.6 1.6 0 0 0-2.4 1.3Z" fill="#fff" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" data-testid="social-instagram" className="hover:scale-110 transition">
              <svg width="36" height="36" viewBox="0 0 56 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M29.86 5.49c2.57 0 3.88.02 5.01.05l.45.02 1.63.06c2.44.12 4.1.5 5.56 1.07 1.51.58 2.79 1.37 4.06 2.64a11.25 11.25 0 0 1 2.64 4.06c.57 1.46.95 3.13 1.07 5.57l.07 1.63.01.44c.04 1.13.05 2.44.05 5.02v4.7c.01 1.68 0 3.35-.05 5.02l-.01.45-.07 1.63a17 17 0 0 1-1.07 5.56 11.2 11.2 0 0 1-2.64 4.06 11.26 11.26 0 0 1-4.06 2.65c-1.46.56-3.12.95-5.56 1.06l-1.63.07-.45.01c-1.13.04-2.44.05-5.01.06h-4.71c-1.68 0-3.35-.01-5.02-.05l-.44-.02-1.64-.07c-2.43-.11-4.1-.5-5.56-1.06a11.2 11.2 0 0 1-4.06-2.65 11.24 11.24 0 0 1-2.64-4.06 16.93 16.93 0 0 1-1.07-5.56l-.07-1.63v-.45c-.05-1.67-.07-3.34-.07-5.01v-4.71c0-1.67.01-3.35.05-5.02l.02-.44.07-1.63c.11-2.44.5-4.1 1.06-5.57a11.18 11.18 0 0 1 2.65-4.06A11.22 11.22 0 0 1 12.5 6.7c1.46-.57 3.12-.95 5.56-1.07l1.64-.06.44-.02c1.67-.04 3.34-.06 5.01-.05h4.72ZM27.5 16.94a11.46 11.46 0 1 0 0 22.92 11.46 11.46 0 0 0 0-22.92Zm0 4.59a6.88 6.88 0 1 1 0 13.75 6.88 6.88 0 0 1 0-13.75m12.03-8.02a2.86 2.86 0 1 0 0 5.73 2.86 2.86 0 0 0 0-5.73Z" fill="#fff" />
              </svg>
            </a>
          </div>
        </div>

        {/* Menu columns */}
        <div className="w-full lg:w-auto grid grid-cols-2 gap-10 lg:gap-16">
          <div>
            <p className="text-lg font-bold pb-3">Engemix</p>
            <ul className="flex flex-col gap-2">
              {ENGEMIX_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm hover:underline"
                    data-testid={`footer-eng-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-lg font-bold pb-3">Dúvidas</p>
            <ul className="flex flex-col gap-2">
              {DUVIDAS_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm hover:underline"
                    data-testid={`footer-duv-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contatos */}
        <div className="w-full lg:w-auto">
          <p className="text-xl font-black">Contatos</p>
          <ul className="flex flex-col justify-center items-start gap-4 pt-5">
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.427 13.362c-.153 1.111-.725 2.132-1.609 2.87-.884.738-2.02 1.144-3.194 1.143C5.802 17.375.25 12.076.25 5.562a5.325 5.325 0 011.197-3.048A5.352 5.352 0 014.454.979a2.42 2.42 0 011.479.163c.257.141.46.357.578.617L7.697 5.627c.09.199.127.416.107.632a1.516 1.516 0 01-.665.874l-1.789 2.025c.644 1.248 2.012 2.543 3.337 3.159l2.091-1.699a1.5 1.5 0 01.635-.185c.227-.02.457.015.667.102l4.049 1.732c.273.112.5.305.648.551.148.246.209.53.173.812z" fill="white" />
              </svg>
              <a
                className="text-base font-medium hover:underline"
                href="tel:+554121122023"
                data-testid="footer-tel-1"
              >
                +55 41 2112-2023
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.427 13.362c-.153 1.111-.725 2.132-1.609 2.87-.884.738-2.02 1.144-3.194 1.143C5.802 17.375.25 12.076.25 5.562a5.325 5.325 0 011.197-3.048A5.352 5.352 0 014.454.979a2.42 2.42 0 011.479.163c.257.141.46.357.578.617L7.697 5.627c.09.199.127.416.107.632a1.516 1.516 0 01-.665.874l-1.789 2.025c.644 1.248 2.012 2.543 3.337 3.159l2.091-1.699a1.5 1.5 0 01.635-.185c.227-.02.457.015.667.102l4.049 1.732c.273.112.5.305.648.551.148.246.209.53.173.812z" fill="white" />
              </svg>
              <a
                className="text-base font-medium hover:underline"
                href="tel:+5508003336272"
                data-testid="footer-tel-2"
              >
                +55 0800-333-6272
              </a>
            </li>
          </ul>
        </div>

        {/* App download */}
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-6">
          <p className="w-5/6 lg:w-64 text-lg lg:text-xl font-semibold text-center">
            Já é cliente? Baixe nosso App e acompanhe cada passo do seu pedido.
          </p>
          <div className="flex justify-center items-center gap-4">
            <a
              href="#"
              data-testid="app-appstore"
              aria-label="Baixar na App Store"
              className="hover:opacity-90 transition"
            >
              <img
                src="https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist-mediamonks/imgs/appleStore-button-download.png"
                alt="Baixar na App Store"
                className="h-12"
              />
            </a>
            <a
              href="#"
              data-testid="app-playstore"
              aria-label="Disponível no Google Play"
              className="hover:opacity-90 transition"
            >
              <img
                src="https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist-mediamonks/imgs/playStore-button-download.png"
                alt="Disponível no Google Play"
                className="h-12"
              />
            </a>
          </div>
        </div>
      </nav>

      <hr className="w-11/12 m-auto border-white/20" />

      {/* Bottom bar */}
      <div className="w-full">
        <div className="w-full lg:w-11/12 flex flex-col lg:flex-row justify-around items-center px-4 py-6 gap-3 lg:gap-16 lg:px-0 lg:m-auto text-xs lg:text-sm">
          <span className="text-center">
            Votorantim Cimentos © Todos os direitos reservados 2026
          </span>
          <a
            href="#"
            className="hover:underline"
            data-testid="footer-privacidade"
          >
            Política de privacidade
          </a>
          <a
            href="#"
            className="hover:underline"
            data-testid="footer-termo"
          >
            Termo de privacidade
          </a>
          <img
            className="max-h-8 hidden lg:block"
            src="https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist-mediamonks/imgs/logo-vc.svg"
            alt="Votorantim Cimentos"
          />
        </div>
      </div>
    </footer>
  );
}
