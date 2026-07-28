import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import OrcamentoSucessoModal from "@/components/OrcamentoSucessoModal";
import { MapPin, Mail, Phone } from "lucide-react";
import { toast, Toaster } from "sonner";
import { api } from "@/lib/api";
import { trackPageview, track } from "@/lib/tracker";

const ESTADOS = [
  { v: "BA", l: "Bahia" },
  { v: "CE", l: "Ceará" },
  { v: "DF", l: "Distrito Federal" },
  { v: "GO", l: "Goiás" },
  { v: "MG", l: "Minas Gerais" },
  { v: "PA", l: "Pará" },
  { v: "PE", l: "Pernambuco" },
  { v: "PR", l: "Paraná" },
  { v: "RJ", l: "Rio de Janeiro" },
  { v: "RS", l: "Rio Grande do Sul" },
  { v: "SC", l: "Santa Catarina" },
  { v: "SP", l: "São Paulo" },
];

const TIPOS_OBRA = [
  "Residenciais, reformas e obras de pequeno porte",
  "Edificações e Obras Especiais",
];

const SOLUCOES = [
  {
    title: "Produção Técnica",
    desc: "Produção de concreto usinado com controle industrial e padronização rigorosa, garantindo consistência, qualidade e conformidade técnica para diferentes tipos de obras, independentemente da complexidade, escala ou aplicação estrutural.",
  },
  {
    title: "Soluções aplicadas",
    desc: "Oferta de linhas de concreto desenvolvidas para usos específicos da construção civil, atendendo demandas como edificações, pisos, pavimentação e obras especiais, com produtos adequados às condições de uso, desempenho esperado e exigências do projeto.",
  },
  {
    title: "Logística Estratégica",
    desc: "Ampla operação que assegura fornecimento confiável, pontualidade e qualidade do concreto até o canteiro de obras, apoiando o cumprimento de prazos e a execução eficiente de projetos em diferentes regiões.",
  },
];

export default function Orcamento() {
  const [form, setForm] = useState({
    telefone: "",
    nome: "",
    cargo: "",
    email: "",
    tipoObra: "",
    cep: "",
    cidade: "",
    estado: "",
    volume: "",
  });
  const [sending, setSending] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastNome, setLastNome] = useState("");
  const [waHref, setWaHref] = useState(
    "https://wa.me/554121122023?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento."
  );
  const [phone, setPhone] = useState("+55 41 2112-2023");

  useEffect(() => {
    trackPageview();
    api
      .get("/config/public")
      .then((r) => {
        const digits = (r.data.whatsapp_number || "").replace(/\D/g, "");
        const msg = encodeURIComponent(r.data.whatsapp_message || "");
        setWaHref(`https://wa.me/${digits}${msg ? `?text=${msg}` : ""}`);
        if (r.data.phone) setPhone(r.data.phone);
      })
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.telefone.trim() || !form.nome.trim()) {
      toast.error("Preencha telefone e nome (campos obrigatórios).");
      return;
    }
    setSending(true);
    try {
      await api.post("/leads", {
        telefone: form.telefone,
        nome: form.nome,
        cargo: form.cargo,
        email: form.email,
        tipo_obra: form.tipoObra,
        cep: form.cep,
        cidade: form.cidade,
        estado: form.estado,
        volume: form.volume,
      });
      track("lead_submitted");
      setLastNome(form.nome);
      setSuccessOpen(true);
      setForm({
        telefone: "",
        nome: "",
        cargo: "",
        email: "",
        tipoObra: "",
        cep: "",
        cidade: "",
        estado: "",
        volume: "",
      });
    } catch (err) {
      toast.error("Falha ao enviar. Tente novamente em instantes.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white" data-testid="orcamento-page">
      <Header />
      <div className="h-20" aria-hidden="true" />
      <Toaster position="top-center" richColors />

      <main className="lg:m-16 px-4 lg:px-8">
        <section className="py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-7xl mx-auto">
            {/* Left column: title + info */}
            <div>
              <header className="mb-8">
                <h1
                  className="text-[#E30613] font-bold text-3xl lg:text-5xl leading-tight"
                  data-testid="orc-title"
                >
                  Toda boa obra começa com uma base sólida.
                </h1>
                <p className="mt-4 text-gray-700 text-base lg:text-lg">
                  Complete o formulário e receba em 48h um orçamento
                  personalizado de concreto conforme as necessidades da sua
                  obra.
                </p>
              </header>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                    <MapPin className="text-[#E30613]" size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Nossas filiais</p>
                    <p className="text-gray-600">
                      Temos 40 filiais distribuídas por todo o Brasil
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                    <Mail className="text-[#E30613]" size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Converse com o SAC</p>
                    <p className="text-gray-600">
                      Nosso time está aqui para te ajudar.
                    </p>
                    <a
                      href="mailto:sac@vcimentos.com"
                      className="font-bold text-gray-800 hover:text-[#E30613]"
                      data-testid="orc-email-sac"
                    >
                      sac@vcimentos.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                    <Phone className="text-[#E30613]" size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Nos ligue</p>
                    <p className="text-gray-600">Seg–Sex de 8h às 18h</p>
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="font-bold text-gray-800 hover:text-[#E30613]"
                      data-testid="orc-tel"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: form */}
            <div className="lg:pl-6">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-10">
                <h3 className="text-xl lg:text-2xl font-semibold text-black pb-2">
                  Solicite seu orçamento de concreto:
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Preencha o formulário e em breve entraremos em contato com
                  você.
                </p>

                <form
                  onSubmit={submit}
                  className="space-y-4"
                  data-testid="orc-form"
                  noValidate
                >
                  <Field
                    label="Telefone / Celular"
                    required
                    id="telefone"
                    value={form.telefone}
                    onChange={set("telefone")}
                    placeholder="Telefone / Celular"
                  />
                  <Field
                    label="Nome"
                    required
                    id="nome"
                    value={form.nome}
                    onChange={set("nome")}
                    placeholder="Nome"
                  />
                  <Field
                    label="Cargo (opcional)"
                    id="cargo"
                    value={form.cargo}
                    onChange={set("cargo")}
                  />
                  <Field
                    label="E-mail (opcional)"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="E-mail"
                  />

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="tipoObra"
                    >
                      Selecione o tipo de obra (opcional)
                    </label>
                    <select
                      id="tipoObra"
                      value={form.tipoObra}
                      onChange={set("tipoObra")}
                      data-testid="orc-tipo-obra"
                      className="w-full h-11 rounded-lg border border-gray-300 px-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                    >
                      <option value="">Selecione</option>
                      {TIPOS_OBRA.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Field
                    label="CEP da obra (opcional)"
                    id="cep"
                    value={form.cep}
                    onChange={set("cep")}
                    placeholder="CEP"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Field
                      label="Cidade (opcional)"
                      id="cidade"
                      value={form.cidade}
                      onChange={set("cidade")}
                      placeholder="Cidade"
                    />
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="estado"
                      >
                        Estado (opcional)
                      </label>
                      <select
                        id="estado"
                        value={form.estado}
                        onChange={set("estado")}
                        data-testid="orc-estado"
                        className="w-full h-11 rounded-lg border border-gray-300 px-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      >
                        <option value="">Selecione o Estado</option>
                        {ESTADOS.map((e) => (
                          <option key={e.v} value={e.v}>
                            {e.l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="volume"
                    >
                      Volume de concreto (m³) | Mínimo de 3m³ (opcional)
                    </label>
                    <input
                      id="volume"
                      type="text"
                      value={form.volume}
                      onChange={set("volume")}
                      placeholder="Volume de concreto (m³)"
                      data-testid="orc-volume"
                      className="w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                    />
                    <small className="text-gray-500">
                      Atendemos volumes a partir de 3m³
                    </small>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    data-testid="orc-submit"
                    className="w-full lg:w-auto bg-[#E30613] hover:bg-[#b40510] text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-60"
                  >
                    {sending ? "Enviando..." : "Solicitar orçamento"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Soluções em concreto - cards clicáveis para WhatsApp */}
        <section className="py-12 lg:py-16" data-testid="orc-solucoes-section">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-10">
            <h2
              className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight"
              data-testid="orc-solucoes-title"
            >
              Soluções em concreto
              <br />
              para sua obra
            </h2>
            <p className="text-gray-700 text-base lg:text-lg">
              A Engemix oferece concreto usinado e soluções técnicas
              desenvolvidas para atender às exigências de qualidade,
              produtividade e segurança em obras de diferentes portes e
              complexidades.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {SOLUCOES.map((s, i) => (
              <a
                key={i}
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("solucao_click", { index: i, title: s.title })
                }
                data-testid={`orc-solucao-${i}`}
                className="group block bg-white border-2 border-[#E30613] rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-[#E30613] transition">
                  {s.title}
                </h3>
                <hr className="border-gray-200 my-4" />
                <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                  {s.desc}
                </p>
              </a>
            ))}
          </div>
        </section>
      </main>

      <FloatingButtons />
      <Footer />
      <OrcamentoSucessoModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        nome={lastNome}
      />
    </div>
  );
}

function Field({ label, id, required, ...rest }) {
  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700 mb-1"
        htmlFor={id}
      >
        {label}
        {required && <span className="text-[#E30613] ml-1">*</span>}
      </label>
      <input
        id={id}
        data-testid={`orc-${id}`}
        aria-required={required || undefined}
        className="w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
        {...rest}
      />
    </div>
  );
}
