import BackButton from "../components/BackButton";

export default function ReembolsoPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
              <BackButton />      
      </div>
      
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight">
          Política de Reembolso
        </h1>
        <p className="mt-4 text-zinc-400">
          Última atualização: 21/03/2026
        </p>

        <div className="mt-10 space-y-8 text-zinc-300">

          {/* RESUMO SIMPLES */}
          <section className="rounded-[1.5rem] border border-amber-400/20 bg-amber-500/10 p-5">
            <h2 className="text-xl font-bold text-white">
              Resumo importante
            </h2>

            <p className="mt-3 leading-8">
              Antes de ativar o sistema, você pode cancelar sem custo.
            </p>

            <p className="mt-2 leading-8">
              Após ativar e conectar seu WhatsApp, não há reembolso, pois o
              sistema passa a gerar custos técnicos reais.
            </p>
          </section>

          {/* TESTE */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. Período de Teste
            </h2>

            <p className="mt-3 leading-8">
              O SDR AI pode oferecer período de teste gratuito para avaliação do
              sistema antes da continuidade do uso em plano pago.
            </p>
          </section>

          {/* ANTES */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              2. Antes da Ativação
            </h2>

            <p className="mt-3 leading-8">
              O usuário poderá cancelar sem custos antes de ativar o sistema e
              iniciar o uso real da plataforma.
            </p>
          </section>

          {/* DEPOIS */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              3. Após a Ativação
            </h2>

            <p className="mt-3 leading-8">
              Após a ativação do sistema e conexão do WhatsApp, o serviço entra em
              execução, gerando custos operacionais, técnicos e de infraestrutura.
            </p>

            <p className="mt-3 leading-8">
              Por esse motivo, não haverá reembolso após a ativação.
            </p>

            <p className="mt-3 leading-8">
              Ao ativar o sistema, o usuário declara estar ciente e de acordo com
              essa condição.
            </p>
          </section>

          {/* SERVIÇOS PERSONALIZADOS */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              4. Serviços Personalizados
            </h2>

            <p className="mt-3 leading-8">
              Serviços como criação de site, landing page, integrações e
              desenvolvimento sob medida possuem condições específicas de
              contratação e reembolso, definidas em proposta comercial.
            </p>
          </section>

          {/* SOLUÇÃO */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Suporte e Resolução
            </h2>

            <p className="mt-3 leading-8">
              Em caso de dúvidas ou problemas, o usuário deve entrar em contato
              com a equipe do SDR AI, que atuará de boa-fé para analisar a
              situação e buscar uma solução adequada.
            </p>
          </section>

          {/* ALTERAÇÕES */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              6. Alterações
            </h2>

            <p className="mt-3 leading-8">
              Esta política poderá ser atualizada a qualquer momento para refletir
              mudanças operacionais ou legais.
            </p>
          </section>

        </div>
      </div>
      <div className="mx-auto max-w-4xl">
              <BackButton />      
      </div>
    </main>
  )
}