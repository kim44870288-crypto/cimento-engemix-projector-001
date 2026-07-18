import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { trackPageview, track } from "@/lib/tracker";
import { api } from "@/lib/api";

const HERO_SLIDES = [
  {
    img: "/hero-56-anos.avif",
    alt: "Há 56 anos oferecendo o melhor concreto para pequenas e grandes obras",
  },
  {
    img: "https://www.engemix.com.br/wp-content/uploads/2024/07/1440-x-600-DESK-v2_.avif",
    alt: "funcionário engemix com capacete azul segurando cartão de crédito",
  },
  {
    img: "https://www.engemix.com.br/wp-content/uploads/2024/07/1440-x-600-DESK-v1.avif",
    alt: "cantor sertanejo Leonardo apoiado em uma betoneira da engemix",
  },
  {
    img: "https://www.engemix.com.br/wp-content/uploads/2024/06/40-centrais-engemix-desk.avif",
    alt: "engemix centrais de atendimento",
  },
  {
    img: "https://www.engemix.com.br/wp-content/uploads/2024/06/tecnologia-engemix-desktop.avif",
    alt: "engemix usando tecnologia avançada na produção de concreto",
  },
  {
    img: "https://www.engemix.com.br/wp-content/uploads/2025/12/DESK.webp",
    alt: "banner promocional engemix",
  },
];

const BENEFITS = [
  {
    title: "Pequenas obras",
    desc: "Atendimento para obras de pequeno porte",
    icon: (
      <svg
        className="w-full max-h-10 lg:min-h-16 lg:max-w-none"
        width="49"
        height="45"
        viewBox="0 0 49 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.584 1.384a4.75 4.75 0 0 1 5.502-.235l.33.237 19.912 15.485c1.713 1.333.88 4.019-1.185 4.24l-.275.014H43.5v19a4.75 4.75 0 0 1-4.394 4.738l-.356.012h-28.5a4.75 4.75 0 0 1-4.736-4.394l-.014-.356v-19H3.132c-2.168 0-3.163-2.631-1.67-4.073l.21-.18L21.583 1.383zm2.916 3.75L9.36 16.91c.543.44.89 1.112.89 1.865v21.351h7.125V28.25a7.125 7.125 0 1 1 14.25 0v11.875h7.125V18.774c0-.753.347-1.425.89-1.865L24.5 5.134zm0 20.741a2.375 2.375 0 0 0-2.375 2.375v11.875h4.75V28.25a2.375 2.375 0 0 0-2.375-2.375z"
          fill="#790800"
        />
      </svg>
    ),
  },
  {
    title: "Grandes obras",
    desc: "Atendimento para obras de grande porte",
    icon: (
      <svg
        className="w-full max-h-10 lg:min-h-16 lg:max-w-none"
        width="63"
        height="50"
        viewBox="0 0 63 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50.16-.685a3.167 3.167 0 0 1 3.145 2.797l.023.37V7.44l.367.32.877.731c.159.133.33.266.5.4 1.689 1.314 3.728 2.634 5.59 3.255a3.167 3.167 0 1 1-2.001 6.011 21.738 21.738 0 0 1-4.529-2.198l-.804-.519v15.547h9.5a3.167 3.167 0 0 1 .371 6.312l-.37.023h-9.502v9.501a3.167 3.167 0 0 1-6.311.37l-.023-.37v-9.501h-31.67v9.501a3.167 3.167 0 0 1-6.313.37l-.022-.37v-9.501H-.514a3.167 3.167 0 0 1-.37-6.312l.37-.023h9.502v-15.55c-1.571 1.048-3.414 2.08-5.334 2.72a3.169 3.169 0 0 1-2.001-6.01c1.862-.622 3.902-1.942 5.59-3.257l.5-.399.877-.731.368-.32V2.482a3.167 3.167 0 0 1 6.312-.37l.022.37v5.454a15.068 15.068 0 0 0 2.968 3.158c2.448 1.96 6.511 4.057 12.868 4.057 6.356 0 10.42-2.097 12.868-4.054a15.024 15.024 0 0 0 2.635-2.695l.332-.466V2.482A3.167 3.167 0 0 1 50.16-.685zm-3.167 17.473a23.923 23.923 0 0 1-5.276 2.835l-1.058.383v10.98h6.334V16.788zm-12.668 4.548c-1.766.17-3.542.197-5.312.083l-1.022-.083v9.65h6.334v-9.65zm-19.003-4.548v14.198h6.334v-10.98l-1.057-.38a24.084 24.084 0 0 1-4.523-2.322l-.754-.516z"
          fill="#790800"
        />
      </svg>
    ),
  },
  {
    title: "Atendimento",
    desc: "Equipe altamente qualificada para te atender",
    icon: (
      <svg
        className="w-full max-h-10 lg:min-h-16 lg:max-w-none"
        width="49"
        height="46"
        viewBox="0 0 49 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.875 17.375a16.625 16.625 0 0 1 33.25 0v2.458a8.317 8.317 0 0 1 7.125 8.23v.593c0 4.216-3.636 7.911-7.913 7.714-1.758 5.035-6.228 8.43-11.051 9.289-1.117.408-2.437.216-3.599.216a3.563 3.563 0 1 1 0-7.125c1.884 0 3.97-.273 5.242 1.446 3.078-1.465 5.446-4.56 5.446-8.571v-14.25a11.875 11.875 0 0 0-23.75 0v14.844a4.156 4.156 0 0 1-4.156 4.156A7.719 7.719 0 0 1 .75 28.656v-.593a8.312 8.312 0 0 1 7.125-8.23v-2.458z"
          fill="#790800"
        />
      </svg>
    ),
  },
  {
    title: "Qualidade",
    desc: "Qualidade Votorantim Cimentos para a sua obra",
    icon: (
      <svg
        className="w-full max-h-10 lg:min-h-16 lg:max-w-none"
        width="51"
        height="51"
        viewBox="0 0 51 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.875 48.396V32.14a16.217 16.217 0 0 1-3.104-5.05c-.736-1.894-1.104-3.91-1.104-6.05 0-4.699 1.63-8.679 4.892-11.94C16.82 5.839 20.8 4.208 25.5 4.208c4.7 0 8.68 1.631 11.941 4.893 3.262 3.261 4.892 7.241 4.892 11.94 0 2.14-.368 4.156-1.104 6.05a16.22 16.22 0 0 1-3.104 5.05v16.255L25.5 44.187l-12.625 4.209zM25.5 33.666c3.507 0 6.488-1.227 8.943-3.682 2.455-2.454 3.682-5.435 3.682-8.942 0-3.507-1.227-6.488-3.682-8.943-2.455-2.455-5.436-3.682-8.943-3.682-3.507 0-6.488 1.227-8.943 3.682-2.455 2.455-3.682 5.436-3.682 8.943 0 3.507 1.227 6.488 3.682 8.942 2.455 2.455 5.436 3.683 8.943 3.683z"
          fill="#790800"
        />
      </svg>
    ),
  },
  {
    title: "40 Centrais",
    desc: "Centrais de concreto em diferentes lugares do Brasil",
    icon: (
      <svg
        className="w-full max-h-10 lg:min-h-16 lg:max-w-none"
        width="63"
        height="71"
        viewBox="0 0 63 71"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.5 39.5c1.81 0 3.36-.644 4.651-1.932 1.29-1.288 1.935-2.839 1.932-4.651 0-1.81-.644-3.36-1.932-4.648-1.288-1.288-2.838-1.933-4.651-1.936-1.81 0-3.36.646-4.648 1.936-1.288 1.29-1.933 2.84-1.935 4.648 0 1.81.645 3.36 1.935 4.65 1.29 1.291 2.84 1.935 4.648 1.933zm0-32.917c1.097 0 2.194.07 3.292.208 1.097.138 2.194.343 3.291.615v5.76c0 1.811.645 3.361 1.936 4.652 1.29 1.29 2.84 1.934 4.648 1.932h3.291v3.292c0 1.81.645 3.36 1.936 4.65 1.29 1.291 2.84 1.935 4.648 1.933h3.044c.11.604.18 1.249.208 1.936.028.686.042 1.358.04 2.014 0 3.62-.838 7.214-2.512 10.78a58.145 58.145 0 0 1-6.004 10.04c-2.333 3.127-4.747 5.912-7.242 8.354-2.495 2.443-4.566 4.376-6.215 5.8-.603.549-1.289.96-2.057 1.234a6.812 6.812 0 0 1-2.304.412 6.812 6.812 0 0 1-2.304-.412 6.059 6.059 0 0 1-2.058-1.234c-3.565-3.292-6.72-6.501-9.463-9.628-2.743-3.127-5.033-6.158-6.87-9.092-1.839-2.936-3.238-5.761-4.197-8.476C.65 38.64.168 36.046.167 33.575c0-8.23 2.647-14.785 7.942-19.668C13.405 9.025 19.535 6.583 26.5 6.583zm19.75 9.875h-6.583c-.933 0-1.714-.316-2.344-.948-.63-.632-.946-1.413-.948-2.343 0-.933.316-1.714.948-2.344.632-.63 1.413-.946 2.344-.948h6.583V3.292c0-.933.316-1.714.948-2.344.632-.63 1.413-.946 2.344-.948.932 0 1.715.316 2.347.948.632.632.947 1.413.944 2.344v6.583h6.584c.932 0 1.715.316 2.347.948.632.632.947 1.413.944 2.344 0 .932-.316 1.715-.948 2.347-.632.632-1.413.947-2.343.944h-6.584v6.584c0 .932-.316 1.715-.948 2.347-.632.632-1.413.947-2.343.944-.933 0-1.714-.316-2.344-.948-.63-.632-.946-1.413-.948-2.343v-6.584z"
          fill="#790800"
        />
      </svg>
    ),
  },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [waHref, setWaHref] = useState(
    "https://wa.me/554121122023?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento."
  );

  useEffect(() => {
    trackPageview();
    api
      .get("/config/public")
      .then((r) => {
        const digits = (r.data.whatsapp_number || "").replace(/\D/g, "");
        const msg = encodeURIComponent(r.data.whatsapp_message || "");
        setWaHref(`https://wa.me/${digits}${msg ? `?text=${msg}` : ""}`);
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback(
    (index) => {
      const total = HERO_SLIDES.length;
      setSlide(((index % total) + total) % total);
    },
    []
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white" data-testid="home-page">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-20" aria-hidden="true" />
      {/* Hero Carousel */}
      <section
        id="home-hero-carrossel"
        className="relative w-full overflow-hidden"
        aria-label="Carrossel principal"
        data-testid="hero-carousel"
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className="min-w-full"
              role="tabpanel"
              aria-label={`${i + 1} of ${HERO_SLIDES.length}`}
            >
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.alt}
                data-testid={`hero-slide-link-${i}`}
                onClick={() => track("hero_slide_click", { slide: i })}
                className="block"
              >
                <picture>
                  <img
                    src={s.img}
                    alt={s.alt}
                    className="w-full block"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding={i === 0 ? "sync" : "async"}
                  />
                </picture>
              </a>
            </div>
          ))}
        </div>

        {/* Prev/Next */}
        <button
          type="button"
          onClick={() => goTo(slide - 1)}
          aria-label="Slide anterior"
          data-testid="hero-prev-btn"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => goTo(slide + 1)}
          aria-label="Próximo slide"
          data-testid="hero-next-btn"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
        >
          ›
        </button>

        {/* Pagination */}
        <ul
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"
          role="tablist"
          aria-label="Selecione um slide"
        >
          {HERO_SLIDES.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                role="tab"
                aria-selected={slide === i}
                aria-label={`Ir para slide ${i + 1}`}
                data-testid={`hero-dot-${i}`}
                onClick={() => goTo(i)}
                className="p-4 group"
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full transition-all ${
                    slide === i
                      ? "bg-white scale-110"
                      : "bg-white/50 group-hover:bg-white/80"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <main className="bg-white">
        {/* Quem Somos */}
        <section id="quem-somos" className="relative">
          <div className="w-full px-6 py-12 lg:px-24 lg:py-14 flex flex-col lg:flex-row lg:gap-24">
            <figure className="pb-9 lg:pb-0 max-w-screen-sm w-full z-10">
              <img
                className="w-full shadow-xl rounded-2xl"
                width="346"
                height="222"
                src="https://www.engemix.com.br/wp-content/uploads/2024/06/funcion%C3%A1rio-na-usina.avif"
                alt="funcionário na usina"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="w-full text-center lg:text-left max-w-3xl lg:w-3/4 z-10">
              <h2 className="text-2xl lg:text-3xl font-semibold text-black pb-4">
                A Engemix
              </h2>
              <div className="text-lg lg:text-xl font-light text-black pb-8 lg:pb-16">
                Com mais de 50 anos de expertise, a Engemix, empresa do grupo
                Votorantim Cimentos, tornou-se{" "}
                <strong>referência no mercado de concreto,</strong> deixando sua
                marca em <strong>grandes empreendimentos no Brasil.</strong>{" "}
                Com mais de 30 centrais de concreto, a Engemix está presente em
                todo território nacional.
              </div>
              <a
                href="#"
                data-testid="quem-somos-saiba-mais-btn"
                className="inline-block bg-[#790800] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#5c0600] transition"
              >
                Saiba mais
              </a>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section
          id="beneficios-do-site"
          className="flex flex-col justify-center items-center gap-y-10 lg:gap-y-12 bg-[#790800] px-4 py-10 lg:px-4 lg:py-16"
        >
          <ul className="flex flex-wrap justify-center items-center gap-6 lg:gap-12">
            {BENEFITS.map((b, i) => (
              <li
                key={i}
                className="w-full bg-white px-2 lg:px-4 py-4 lg:py-5 flex flex-col justify-start items-center text-center gap-2 max-w-[169px] lg:max-w-52 min-h-[181px] lg:min-h-[240px] rounded-2xl lg:rounded-3xl transition hover:shadow-[0_0_28px_rgba(255,255,255,0.35)]"
                data-testid={`beneficio-${i}`}
              >
                <div className="lg:h-20 flex items-center">{b.icon}</div>
                <h3 className="text-lg lg:text-xl font-semibold text-[#790800]">
                  {b.title}
                </h3>
                <p className="text-sm lg:text-base">{b.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Nossos Produtos */}
        <section id="nossos-produtos" className="bg-white">
          <div className="container mx-auto pb-0 pt-10 lg:py-16">
            <div className="w-full m-auto flex flex-wrap justify-center items-center gap-7 lg:gap-20 px-4">
              <article
                className="group w-11/12 max-w-96 lg:w-90 flex flex-col justify-center items-center gap-5 shadow-lg rounded-3xl border-2 border-gray-300 pb-6 overflow-hidden bg-white"
                data-testid="produto-pequenas"
              >
                <div className="px-4 pt-6 overflow-hidden">
                  <p className="text-center text-base lg:text-xl px-3 font-light pb-4">
                    As melhores soluções para a construção de médias e pequenas
                    obras!
                  </p>
                  <p className="hidden lg:flex lg:text-center lg:font-medium text-xl lg:pt-4 max-h-0 group-hover:max-h-32 transition-all duration-1000 ease-in-out overflow-hidden group-hover:pb-4 px-3">
                    Exemplo: Residenciais, reformas e obras de médio e pequeno
                    porte
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="#"
                      data-testid="produto-pequenas-btn"
                      className="inline-block bg-[#790800] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#5c0600] transition"
                    >
                      Saiba mais
                    </a>
                  </div>
                </div>
              </article>

              <article
                className="group w-11/12 max-w-96 lg:w-90 flex flex-col justify-center items-center gap-5 shadow-lg rounded-3xl border-2 border-gray-300 pb-6 overflow-hidden bg-white"
                data-testid="produto-grandes"
              >
                <div className="px-4 pt-6 overflow-hidden">
                  <p className="text-center text-base lg:text-xl px-3 font-light pb-4">
                    Soluções de excelência para atender às construções de
                    grandes obras!
                  </p>
                  <p className="hidden lg:flex lg:text-center lg:font-medium text-xl lg:pt-4 max-h-0 group-hover:max-h-32 transition-all duration-1000 ease-in-out overflow-hidden group-hover:pb-4 px-3">
                    Exemplos: Edificações e obras com exigências particulares
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="#"
                      data-testid="produto-grandes-btn"
                      className="inline-block bg-[#790800] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#5c0600] transition"
                    >
                      Saiba mais
                    </a>
                  </div>
                </div>
              </article>
            </div>

            {/* Pavimento de Concreto */}
            <section
              id="sessao-produto-pavimento-concreto"
              className="flex justify-center items-center pb-0 pt-16 lg:py-8 px-4"
            >
              <div className="max-w-7xl w-full flex flex-col-reverse lg:flex-row items-center justify-center lg:rounded-xl bg-zinc-200 p-6 pb-16 lg:p-12 border-b-2 border-b-red-700">
                <div className="flex flex-col gap-4">
                  <p className="text-center lg:text-left text-base lg:text-xl font-light max-w-xl px-0 pb-4">
                    O pavimento de concreto, ou pavimento rígido, é uma solução
                    usada para a pavimentação de rodovias e vias urbanas no
                    mundo todo. Esse tipo de pavimento conta com diversas
                    metodologias de dimensionamento e execução, permitindo a
                    escolha da melhor opção técnica e econômica, conforme o tipo
                    de obra executada.
                  </p>
                  <div>
                    <a
                      href="#"
                      data-testid="pavimento-saiba-mais-btn"
                      className="inline-block bg-[#790800] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#5c0600] transition"
                    >
                      Saiba mais
                    </a>
                  </div>
                </div>
                <img
                  className="max-w-60 lg:max-w-lg"
                  src="https://www.engemix.com.br/wp-content/uploads/2025/06/Logo-Pavimento-de-Concreto.webp"
                  alt="pavimento de concreto engemix"
                  loading="lazy"
                  decoding="async"
                  height="78"
                  width="512"
                />
              </div>
            </section>
          </div>
        </section>

        {/* Onde Estamos */}
        <section
          id="onde-estamos"
          className="bg-[#790800] px-4 pt-16 pb-8 lg:py-14 lg:px-28"
        >
          <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-36">
            <div className="max-w-md flex flex-col justify-center items-center lg:items-start text-white text-center lg:text-left gap-3 lg:gap-6">
              <div className="text-lg lg:text-xl font-light">
                <p>
                  Com mais de 50 anos de expertise e produtos de qualidade, a
                  Engemix conseguiu expandir suas filiais e hoje conta com 44
                  centrais de concreto estrategicamente distribuídas em todo
                  território brasileiro para atender com agilidade e segurança.
                </p>
                <p className="mt-4">
                  <strong>Encontre a filial mais próxima para sua obra!</strong>
                </p>
              </div>
              <div className="py-4 lg:flex">
                <a
                  href="#"
                  data-testid="onde-estamos-btn"
                  className="inline-block bg-white text-[#790800] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
                >
                  Conferir unidades
                </a>
              </div>
            </div>
            <figure className="w-full flex justify-center pt-7 pb-3 px-8 lg:p-0">
              <img
                className="w-11/12 lg:w-full min-w-56 max-w-md lg:max-w-xl lg:min-w-96"
                width="572"
                height="572"
                src="https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist-mediamonks/imgs/onde-estamos-mapa.avif"
                alt="Mapa mostrando nossa localização"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        {/* Proposta de valor / Votorantim */}
        <section
          id="proposta-valor"
          className="container mx-auto relative flex flex-col justify-center lg:flex-row gap-12 py-10 lg:py-16 lg:px-2 overflow-hidden bg-white"
        >
          <div className="w-full lg:w-5/12 px-4 flex flex-col justify-center items-center lg:items-start gap-2">
            <div className="text-base lg:text-xl font-light text-center lg:text-left max-w-lg">
              <p>
                A Engemix é uma empresa do grupo Votorantim Cimentos, uma das
                maiores fabricantes de cimento do Brasil e do mundo. São 88
                anos de história e tradição, trazendo confiança e qualidade em
                seus produtos.
              </p>
              <p className="mt-4">
                Votorantim Cimentos e Engemix é a mistura perfeita para a sua
                obra!
              </p>
            </div>
          </div>
          <div className="relative w-full lg:w-1/2 flex justify-center items-center min-h-[300px] lg:min-h-[400px]">
            <img
              className="absolute inset-0 w-full h-full object-contain opacity-90"
              src="https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist-mediamonks/imgs/Logo-symbol-4.avif"
              alt="ilustração de fundo em espiral"
              loading="lazy"
              decoding="async"
            />
            <div className="relative z-10 flex flex-col justify-center items-center gap-3 px-8 lg:px-0">
              <img
                className="w-full max-w-40 lg:max-w-72"
                src="https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist-mediamonks/imgs/logo-engemix-327-73.avif"
                alt="logo engemix"
                loading="lazy"
                decoding="async"
              />
              <img
                className="w-full max-w-72 lg:max-w-96"
                src="https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist-mediamonks/imgs/votorantim-cimentos-logo.avif"
                alt="logo votorantim cimentos"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* Banner Parceria */}
        <a
          href="#"
          data-testid="banner-parceria"
          className="w-full flex items-center justify-center p-4 lg:p-12 bg-[#790800]"
        >
          <picture>
            <img
              src="https://www.engemix.com.br/wp-content/uploads/2025/07/1.184-x-369.33-1.webp"
              alt="banner parceria engemix"
              className="w-full max-w-6xl"
              loading="lazy"
            />
          </picture>
        </a>
      </main>
      <FloatingButtons />
      <Footer />
    </div>
  );
}
