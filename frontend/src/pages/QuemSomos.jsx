import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { trackPageview, track } from "@/lib/tracker";
import { api } from "@/lib/api";

const CASES = [
  {
    title: "Obras Icônicas",
    img: "https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist/img/img-obras-iconicas@3x.webp",
  },
  {
    title: "Papo Construtivo - A Evolução da Concretagem",
    img: "https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist/img/img-papo-evolucao@3x.webp",
  },
  {
    title: "Papo Construtivo - Cidade Matarazzo",
    img: "https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist/img/img-papo-matarazzo@3x.webp",
  },
  {
    title: "Papo Construtivo - Concretagem Obra do Pontal",
    img: "https://www.engemix.com.br/wp-content/themes/engemix-2020-2/assets/dist/img/img-papo-concretagem@3x.webp",
  },
];

export default function QuemSomos() {
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
  return (
    <div className="bg-gray-100" data-testid="quem-somos-page">
      <Header />
      <div className="h-20" aria-hidden="true" />

      <main className="bg-gray-100">
        <article>
          {/* Hero banner */}
          <section>
            <img
              src="/quem-somos-hero.avif"
              alt="Quem somos - Engemix"
              className="w-full h-60 lg:h-96 object-cover"
              loading="eager"
              decoding="sync"
              data-testid="qs-hero-img"
            />
          </section>

          {/* Title */}
          <section className="container mx-auto flex justify-center py-10 lg:py-12">
            <div className="w-full lg:max-w-5xl px-4">
              <h1
                className="text-2xl font-bold text-gray-900"
                data-testid="qs-h1"
              >
                Quem somos
              </h1>
              <h2 className="text-2xl lg:text-4xl font-semibold text-[#E30613] mt-1">
                Conheça a Engemix
              </h2>
            </div>
          </section>

          {/* Text + video */}
          <section className="container mx-auto flex justify-center">
            <div className="lg:max-w-5xl w-full p-4">
              <p
                className="text-base lg:text-lg text-gray-800 leading-relaxed"
                data-testid="qs-text"
              >
                A Engemix é a unidade de negócio de concreto da Votorantim
                Cimentos, empresa de materiais de construção e soluções
                sustentáveis. Com mais de 55 anos de atuação no mercado de
                concreto, a Engemix foi adquirida pela Votorantim Cimentos em
                2002. Líder no mercado, a Engemix está presente em nove estados
                brasileiros, conta com 44 unidades de concreto, possui uma frota
                com mais de 600 caminhões betoneira e mais de 130 caminhões
                bomba. Entre as obras emblemáticas que têm a marca registrada da
                Engemix estão Cidade Matarazzo (SP), Linha Amarela do Metrô
                (SP), Linha Lilás do Metrô (SP), Ponte Estaiada (SP), Estádios
                do Grêmio (RS) e do Corinthians (SP), Shoppings Morumbi (SP),
                Market Place (SP), Cidade Jardim (SP) e Vila Olímpia (SP), Hotel
                Unique (SP), Parque Eólico Aracati (CE) e Ponte de Laguna (SC).
              </p>

              <div className="w-full lg:w-8/12 lg:mx-auto py-10 lg:py-12">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/6kXvDO4P4ag"
                    title="50 anos de Engemix"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                    data-testid="qs-video"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Cases */}
          <section className="pb-16 lg:pb-20">
            <div className="container mx-auto flex justify-center px-4">
              <div className="lg:max-w-5xl w-full">
                <h3 className="text-2xl lg:text-4xl font-semibold text-gray-800 mb-6">
                  <strong>
                    Conheça algumas obras e cases da Engemix e da Votorantim
                    Cimentos!
                  </strong>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CASES.map((c, i) => (
                    <a
                      key={i}
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("case_click", { index: i, title: c.title })}
                      data-testid={`qs-case-${i}`}
                      className="group block relative bg-black text-white overflow-hidden rounded-3xl shadow-lg"
                    >
                      <img
                        src={c.img}
                        alt={c.title}
                        className="w-full h-64 object-cover group-hover:scale-110 duration-300 ease-in"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                        <h4 className="text-lg font-bold group-hover:text-[#E30613] duration-300 ease-in">
                          {c.title}
                        </h4>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="w-full pt-8">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("outros_cases_click")}
                    data-testid="qs-outros-cases-btn"
                    className="inline-flex items-center gap-3 bg-[#E30613] hover:bg-[#b40510] text-white font-semibold px-8 py-3 rounded-full transition"
                  >
                    Conheça outros cases
                    <ArrowRight size={20} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>

      <FloatingButtons />
      <Footer />
    </div>
  );
}
