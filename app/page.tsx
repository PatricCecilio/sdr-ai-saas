export default function HomePage() {
  const features = [
    {
      title: "Atendimento com padrão premium",
      description:
        "A IA responde com consistência, velocidade e contexto, mantendo uma experiência profissional desde o primeiro contato.",
    },
    {
      title: "Qualificação automática de leads",
      description:
        "Coleta interesse, orçamento e intenção antes de encaminhar para o time comercial.",
    },
    {
      title: "Operação centralizada",
      description:
        "Tenha visão clara de conversas, conexão do WhatsApp, funil de leads e ações do sistema em uma interface elegante.",
    },
    {
      title: "Configuração sob medida",
      description:
        "Defina tom de voz, regras, persona, segmento e objetivos comerciais para a IA atuar alinhada ao seu negócio.",
    },
  ]

  const solutions = [
    {
      title: "Clínicas e estética",
      text: "Automatize agendamentos, dúvidas e triagem inicial pelo WhatsApp.",
    },
    {
      title: "Empresas de serviços",
      text: "Capte leads e organize atendimentos com mais velocidade e padrão.",
    },
    {
      title: "Imobiliárias",
      text: "Responda interessados com agilidade e encaminhe leads mais qualificados.",
    },
    {
      title: "Lojas e e-commerce",
      text: "Aumente conversão com atendimento rápido e follow-up inteligente.",
    },
  ]

  const steps = [
    "Crie sua conta e escolha o plano ideal",
    "Conecte seu WhatsApp e ative o teste de 2 dias",
    "Configure a identidade comercial da IA",
    "Acompanhe leads e conversas em um dashboard premium",
  ]

  const pricing = [
    {
      name: "Starter",
      price: "R$ 247",
      subtitle: "Entrada com estrutura profissional",
      highlight: false,
      items: [
        "1 número de WhatsApp",
        "2 dias grátis para testar",
        "IA para atendimento inicial",
        "Dashboard básico",
        "Até 300 atendimentos/mês",
        "Suporte básico",
      ],
    },
    {
      name: "Pro",
      price: "R$ 397",
      subtitle: "Plano principal para vender mais",
      highlight: true,
      items: [
        "1 número de WhatsApp",
        "2 dias grátis para testar",
        "IA completa e configurável",
        "Dashboard completo",
        "Qualificação automática de leads",
        "Até 1000 atendimentos/mês",
      ],
    },
    {
      name: "Premium",
      price: "R$ 697",
      subtitle: "Para operação com mais escala",
      highlight: false,
      items: [
        "2 números de WhatsApp incluídos",
        "2 dias grátis para testar",
        "IA avançada e fluxos sob medida",
        "Suporte prioritário",
        "Configuração assistida",
        "WhatsApps extras sob consulta",
      ],
    },
  ]

  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "Marcenaria planejada",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Depois que comecei a usar, não perco mais cliente por demora. A IA responde rápido e deixa meu atendimento muito mais profissional.",
    },
    {
      name: "Fernanda Lima",
      role: "Clínica estética",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Antes eu ficava presa no WhatsApp o dia inteiro. Agora a IA filtra melhor e eu foco só nos contatos com real intenção de compra.",
    },
    {
      name: "Juliano Rocha",
      role: "Móveis com LED",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      text: "O SDR AI me passou uma imagem muito mais premium. Parece que tenho um time comercial respondendo 24 horas por dia.",
    },
  ]

  const faq = [
    {
      question: "O teste gratuito realmente conecta meu WhatsApp?",
      answer:
        "Sim. Você pode testar o sistema por 2 dias com seu próprio número conectado, avaliando a experiência real antes da continuidade do plano.",
    },
    {
      question: "Depois do teste o pagamento é automático?",
      answer:
        "Não. Após o período de teste, a continuidade depende da ativação do plano. Isso deixa o processo mais claro e controlado para o cliente.",
    },
    {
      question: "Vocês fazem site, landing page ou implantação personalizada?",
      answer:
        "Sim, mas isso não faz parte dos planos padrão do SaaS. Oferecemos desenvolvimento sob medida, integrações e implantação personalizada mediante orçamento.",
    },
    {
      question: "Posso pedir reembolso depois da ativação?",
      answer:
        "As regras de ativação, continuidade, custos operacionais e reembolso devem estar descritas nos termos e políticas aceitos antes da ativação do serviço.",
    },
  ]

  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_28%)]" />
        <div className="absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[8rem] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      </div>

      <header className="fixed left-1/2 top-4 z-50 w-[min(1100px,calc(100%-24px))] -translate-x-1/2">
        <div className="rounded-full border border-white/10 bg-black/45 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-violet-500/30 to-white/10 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                AI
              </div>

              <div>
                <p className="text-sm font-semibold tracking-[0.25em] text-white/95">
                  SDR AI
                </p>
                <p className="text-xs text-zinc-400">
                  SaaS premium para WhatsApp comercial
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-7 text-sm text-zinc-300 lg:flex">
              <a href="#beneficios" className="transition hover:text-white">
                Benefícios
              </a>
              <a href="#como-funciona" className="transition hover:text-white">
                Como funciona
              </a>
              <a href="#planos" className="transition hover:text-white">
                Planos
              </a>
              <a href="#implantacao" className="transition hover:text-white">
                Implantação
              </a>
              <a href="#faq" className="transition hover:text-white">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="/registrar"
                className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08] md:inline-flex"
              >
                Entrar
              </a>

              <a
                href="/registrar"
                className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Testar 2 dias grátis
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="relative pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[0.92fr_1.08fr] lg:pt-14">
          <div style={{ animation: "fadeUp .8s ease-out both" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-200 shadow-lg shadow-violet-500/10">
              <span className="h-2 w-2 rounded-full bg-violet-300" />
              SDR com IA • WhatsApp • Automação comercial
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.4rem]">
              Automação inteligente de leads no
              <span className="bg-gradient-to-r from-white via-violet-300 to-violet-500 bg-clip-text text-transparent">
                {" "}
                WhatsApp
              </span>
              , com cara de produto premium.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              Teste por 2 dias com seu próprio WhatsApp, veja a IA atendendo na
              prática e só avance para o plano ideal quando fizer sentido para o
              seu negócio.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/registrar"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(139,92,246,0.6)] transition hover:scale-[1.02]"
              >
                Testar 2 dias grátis
              </a>

              <a
                href="#planos"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
              >
                Ver planos
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span>
                2 dias grátis
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span>
                WhatsApp do próprio cliente
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span>
                Foco em conversão
              </div>
            </div>
          </div>

          <div
            className="relative"
            style={{ animation: "fadeUp .95s ease-out .12s both" }}
          >
            <div className="absolute right-6 top-6 z-20 rounded-[1.25rem] border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-2xl">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                WhatsApp
              </p>
              <p className="text-sm font-semibold text-white">
                Atendimento em tempo real
              </p>
            </div>

            <div className="relative overflow-visible rounded-[2.2rem] border border-white/10 bg-white/[0.03] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 overflow-hidden rounded-[2.2rem]">
                <img
                  src="/hero.png"
                  alt="Equipe usando tecnologia e WhatsApp em ambiente profissional"
                  className="h-full w-full object-cover scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/12 via-black/10 to-black/35" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.20),transparent_35%)]" />
              </div>

              <div className="relative px-5 pb-5 pt-28 sm:px-6 sm:pb-6 sm:pt-32">
                <div className="absolute bottom-12 right-0 h-[260px] w-[260px] bg-violet-600/20 blur-[100px]" />

                <div
                  className="ml-auto max-w-[28rem] translate-y-24 rounded-[1.9rem] border border-white/10 bg-[#0b0b0b] p-4 shadow-[0_50px_140px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
                  style={{
                    animation:
                      "fadeUp .95s ease-out .25s both, floatCard 7s ease-in-out 1.4s infinite",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[1.9rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_20%,transparent_72%,rgba(139,92,246,0.10))]" />
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                      </div>

                      <p className="text-xs text-zinc-500">SDR AI Dashboard</p>

                      <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        Online
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-[13px] text-zinc-400">
                          Leads hoje
                        </p>
                        <p className="mt-2 text-3xl font-black">28</p>
                      </div>

                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-[13px] text-zinc-400">
                          Respondidos
                        </p>
                        <p className="mt-2 text-3xl font-black">91%</p>
                      </div>

                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-[13px] text-zinc-400">
                          Aguardando
                        </p>
                        <p className="mt-2 text-3xl font-black">6</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-[15px] font-semibold text-white">
                            Leads recentes
                          </p>
                          <p className="text-[13px] text-zinc-400">
                            Entrada e classificação em tempo real
                          </p>
                        </div>

                        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                          Live
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            name: "Carlos Eduardo",
                            tag: "Marcenaria planejada",
                            status: "Quente",
                          },
                          {
                            name: "Fernanda Lima",
                            tag: "Projeto comercial",
                            status: "Novo",
                          },
                          {
                            name: "Juliano Rocha",
                            tag: "Móvel com LED",
                            status: "Qualificado",
                          },
                        ].map((lead) => (
                          <div
                            key={lead.name}
                            className="flex items-center justify-between rounded-[1rem] border border-white/10 bg-black/35 px-4 py-3"
                          >
                            <div>
                              <p className="text-[15px] font-medium text-white">
                                {lead.name}
                              </p>
                              <p className="text-[13px] text-zinc-400">
                                {lead.tag}
                              </p>
                            </div>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                              {lead.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-32 sm:h-36" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            O problema não é gerar leads. É perder vendas.
          </h2>

          <div className="mt-6 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
              <span className="mt-0.5 text-emerald-400">✔</span>
              Atende visitantes automaticamente
            </div>
            <div className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
              <span className="mt-0.5 text-emerald-400">✔</span>
              Direciona para o WhatsApp
            </div>
            <div className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
              <span className="mt-0.5 text-emerald-400">✔</span>
              Qualifica leads em tempo real
            </div>
            <div className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
              <span className="mt-0.5 text-emerald-400">✔</span>
              Envia follow-ups inteligentes
            </div>
          </div>
        </div>
      </section>

      <section id="solucoes" className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
                Soluções sob medida
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Para cada tipo de negócio que vende por WhatsApp
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {solutions.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/20"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/12 text-violet-200">
                  ✦
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
            Benefícios
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Uma operação comercial com mais velocidade, clareza e presença.
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            O foco aqui é vender o SaaS como produto principal, com valor
            percebido alto e implantação simples para quem quer começar rápido.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/20"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-violet-500/10 text-sm font-bold text-violet-200">
                0{index + 1}
              </div>
              <h3 className="text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="planos" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
            Planos
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Escolha o plano ideal para o seu momento.
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            Todos os planos incluem 2 dias grátis para testar. A implantação
            personalizada é um serviço separado e cobrado sob medida.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[2rem] border p-7 ${
                plan.highlight
                  ? "border-violet-400/30 bg-gradient-to-b from-violet-500/12 to-white/[0.03] shadow-[0_20px_100px_rgba(76,29,149,0.16)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {plan.highlight ? (
                <div className="mb-4 inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                  Mais escolhido
                </div>
              ) : null}

              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">
                {plan.name}
              </p>
              <h3 className="mt-3 text-4xl font-black">{plan.price}</h3>
              <p className="mt-3 text-zinc-400">{plan.subtitle}</p>

              <div className="mt-6 space-y-3 text-sm text-zinc-300">
                {plan.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <a
                href="/registrar"
                className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-white text-black hover:scale-[1.02]"
                    : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                }`}
              >
                Testar 2 dias grátis
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="implantacao" className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
            Implantação personalizada
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Precisa de algo sob medida para o seu negócio?
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Além do SDR AI, também oferecemos desenvolvimento personalizado para
            quem precisa de implantação completa, integração com site existente,
            landing page, site institucional ou solução SaaS sob medida.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
              Integração com site atual
            </div>
            <div className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
              Landing page personalizada
            </div>
            <div className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
              Site sob medida
            </div>
            <div className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
              SaaS personalizado por orçamento
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <a
              href="https://wa.me/5541987485246?text=Ol%C3%A1%2C%20quero%20solicitar%20um%20or%C3%A7amento%20personalizado."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Solicitar orçamento
            </a>

            <a
              href="/registrar"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
            >
              Quero só testar o SaaS
            </a>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
              Como funciona
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Comece com teste real e avance com segurança.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">
              A proposta é ser simples para testar e profissional para operar,
              sem confundir SaaS com desenvolvimento gratuito.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-[1.75rem] border border-white/10 bg-black/40 p-5 backdrop-blur transition duration-300 hover:border-violet-400/20"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                  {index + 1}
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{step}</p>
                  <p className="mt-1 text-sm leading-7 text-zinc-400">
                    Fluxo desenhado para ativação simples, clareza comercial e
                    melhor conversão.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
            Prova social
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Empresários satisfeitos com o atendimento da IA.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-[1.9rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/20"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-full border border-white/10 object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-zinc-400">{item.role}</p>
                </div>
              </div>

              <div className="mt-5 text-yellow-400">★★★★★</div>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                “{item.text}”
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-white/[0.04] p-[1px] shadow-[0_20px_120px_rgba(76,29,149,0.22)]">
          <div className="rounded-[2.2rem] bg-[#090909]/95 px-8 py-12 text-center sm:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
              Pronto para testar?
            </p>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Teste o SDR AI por 2 dias e veja a operação funcionando na prática.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
              E se precisar de implantação personalizada, integração com site ou
              desenvolvimento sob medida, solicite um orçamento separado.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/registrar"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Testar 2 dias grátis
              </a>
              <a
                href="https://wa.me/5541999999999?text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento%20personalizado."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
              >
                Solicitar orçamento
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.75rem] border border-white/10 bg-black/40 p-6 backdrop-blur"
              >
                <h3 className="text-lg font-semibold text-white">
                  {item.question}
                </h3>
                <p className="mt-3 leading-8 text-zinc-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© SDR AI. Todos os direitos reservados.</p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="/termos" className="transition hover:text-white">
              Termos de Uso
            </a>
            <a href="/privacidade" className="transition hover:text-white">
              Política de Privacidade
            </a>
            <a href="/reembolso" className="transition hover:text-white">
              Política de Reembolso
            </a>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/5541999999999?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20o%20SDR%20AI."
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_50px_rgba(37,211,102,0.45)] transition duration-300 hover:scale-110"
        style={{ animation: "pulseWhats 2.8s ease-in-out infinite" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-8 w-8 fill-current"
          aria-hidden="true"
        >
          <path d="M19.11 17.34c-.29-.14-1.71-.84-1.98-.94-.27-.1-.46-.14-.65.14-.19.29-.75.94-.91 1.13-.17.19-.33.22-.62.07-.29-.14-1.23-.45-2.35-1.44-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.59.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.57-.89-2.16-.23-.56-.47-.48-.65-.49h-.55c-.19 0-.5.07-.77.36-.26.29-1 1-.99 2.44 0 1.44 1.04 2.83 1.19 3.03.14.19 2.05 3.12 4.97 4.38.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33zM16 3C8.83 3 3 8.73 3 15.8c0 2.28.61 4.51 1.77 6.48L3 29l6.95-1.81A13.05 13.05 0 0 0 16 28.6c7.17 0 13-5.73 13-12.8C29 8.73 23.17 3 16 3zm0 23.5c-1.93 0-3.81-.51-5.46-1.48l-.39-.23-4.12 1.07 1.1-4-.25-.41a11.42 11.42 0 0 1-1.75-6.07C5.13 9.1 10.02 4.5 16 4.5c5.98 0 10.87 4.6 10.87 10.88 0 6.29-4.89 11.12-10.87 11.12z" />
        </svg>
      </a>
    </main>
  )
}
