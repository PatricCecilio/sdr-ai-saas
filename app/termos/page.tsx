import BackButton from "../components/BackButton";

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-6 py-16 text-white">

        <div className="mx-auto max-w-4xl">
            <BackButton />      
        </div>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight">Termos de Uso</h1>
        <p className="mt-4 text-zinc-400">
          Última atualização: 21/03/2026
        </p>

        <div className="mt-10 space-y-8 text-zinc-300">

          {/* OBJETO */}
          <section>
            <h2 className="text-2xl font-bold text-white">1. Objeto</h2>
            <p className="mt-3 leading-8">
              O SDR AI é uma plataforma SaaS voltada à automação de atendimento,
              qualificação de leads e integração com WhatsApp para uso comercial.
            </p>
          </section>

          {/* CADASTRO */}
          <section>
            <h2 className="text-2xl font-bold text-white">2. Cadastro</h2>
            <p className="mt-3 leading-8">
              O usuário é responsável por fornecer informações corretas, manter
              seus dados atualizados e preservar a segurança de acesso à sua conta.
            </p>
          </section>

          {/* TESTE */}
          <section>
            <h2 className="text-2xl font-bold text-white">3. Período de Teste</h2>
            <p className="mt-3 leading-8">
              A plataforma pode oferecer teste gratuito por período limitado,
              permitindo avaliação real do sistema com integração ao WhatsApp.
            </p>
          </section>

          {/* ATIVAÇÃO */}
          <section>
            <h2 className="text-2xl font-bold text-white">4. Ativação do Serviço</h2>
            <p className="mt-3 leading-8">
              Ao conectar o WhatsApp e iniciar o uso da plataforma, o usuário
              reconhece o início da execução do serviço, incluindo custos técnicos
              e operacionais.
            </p>
          </section>

          {/* PLANOS */}
          <section>
            <h2 className="text-2xl font-bold text-white">5. Planos e Cobrança</h2>
            <p className="mt-3 leading-8">
              Os valores e recursos variam conforme o plano contratado. Serviços
              personalizados, integrações adicionais e desenvolvimento sob medida
              não estão incluídos automaticamente e poderão ser cobrados à parte.
            </p>
          </section>

          {/* REEMBOLSO (CLARO + FORTE) */}
          <section>
            <h2 className="text-2xl font-bold text-white">6. Reembolso</h2>

            <p className="mt-3 leading-8">
              Antes da ativação do serviço, o usuário poderá cancelar sem custos.
            </p>

            <p className="mt-3 leading-8">
              Após a ativação do sistema e conexão do WhatsApp, não haverá
              reembolso, uma vez que o serviço passa a gerar custos técnicos,
              operacionais e de infraestrutura.
            </p>

            <p className="mt-3 leading-8">
              Ao ativar o sistema, o usuário declara estar ciente e de acordo com
              essa condição.
            </p>
          </section>

          {/* IA */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              7. Uso de Inteligência Artificial
            </h2>

            <p className="mt-3 leading-8">
              A plataforma utiliza inteligência artificial para auxiliar no
              atendimento e qualificação de leads.
            </p>

            <p className="mt-3 leading-8">
              O SDR AI não garante a precisão das respostas geradas pela IA,
              sendo responsabilidade do usuário revisar, validar e supervisionar
              todas as interações com seus clientes.
            </p>

            <p className="mt-3 leading-8">
              A IA é uma ferramenta de apoio e não deve ser utilizada como única
              base para decisões comerciais.
            </p>
          </section>

          {/* TERCEIROS */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              8. Serviços de Terceiros
            </h2>

            <p className="mt-3 leading-8">
              O funcionamento da plataforma depende de serviços externos como APIs,
              infraestrutura e integração com WhatsApp.
            </p>

            <p className="mt-3 leading-8">
              O SDR AI não se responsabiliza por falhas, interrupções ou limitações
              causadas por terceiros.
            </p>
          </section>

          {/* USO INDEVIDO */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              9. Uso Indevido
            </h2>

            <p className="mt-3 leading-8">
              É proibido utilizar a plataforma para práticas ilegais, spam,
              comunicações enganosas ou qualquer atividade que viole a legislação.
            </p>

            <p className="mt-3 leading-8">
              O usuário é responsável pelo conteúdo enviado e pelas interações
              realizadas com seus clientes.
            </p>
          </section>

          {/* LIMITES */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              10. Limites de Uso
            </h2>

            <p className="mt-3 leading-8">
              A utilização pode estar sujeita a limites operacionais conforme o
              plano contratado ou critérios de uso justo.
            </p>
          </section>

          {/* RESPONSABILIDADE */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              11. Limitação de Responsabilidade
            </h2>

            <p className="mt-3 leading-8">
              O SDR AI não se responsabiliza por decisões comerciais, negociações,
              perdas financeiras ou resultados obtidos pelo usuário.
            </p>
          </section>

          {/* INDENIZAÇÃO */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              12. Limitação de Indenização
            </h2>

            <p className="mt-3 leading-8">
              Em qualquer hipótese, a responsabilidade da empresa será limitada
              ao valor pago pelo usuário nos últimos 30 dias.
            </p>
          </section>

          {/* BOA-FÉ */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              13. Boa-fé e Suporte
            </h2>

            <p className="mt-3 leading-8">
              O SDR AI atua de boa-fé e busca oferecer uma solução estável e
              transparente.
            </p>

            <p className="mt-3 leading-8">
              Em caso de dúvidas ou problemas, a empresa se coloca à disposição
              para análise e busca de solução entre as partes.
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