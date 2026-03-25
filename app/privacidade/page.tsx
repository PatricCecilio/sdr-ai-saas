import BackButton from "../components/BackButton"



export default function PrivacidadePage() {
  return (

    
    <main className="min-h-screen bg-[#060606] px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
        <BackButton />      
        </div>

      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight">
          Política de Privacidade
        </h1>        
        <p className="mt-4 text-zinc-400">
          Última atualização: 21/03/2026
        </p>

        <div className="mt-10 space-y-8 text-zinc-300">

          {/* COLETA */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. Coleta de Dados
            </h2>

            <p className="mt-3 leading-8">
              O SDR AI poderá coletar dados fornecidos pelo usuário durante o
              cadastro, uso da plataforma e integração com serviços externos.
            </p>

            <p className="mt-3 leading-8">
              Isso pode incluir informações como nome, e-mail, dados de acesso,
              mensagens processadas pelo sistema e dados relacionados ao uso da
              plataforma.
            </p>
          </section>

          {/* FINALIDADE */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              2. Finalidade do Uso
            </h2>

            <p className="mt-3 leading-8">
              Os dados são utilizados para:
            </p>

            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Operação da plataforma</li>
              <li>Autenticação e segurança</li>
              <li>Melhoria da experiência do usuário</li>
              <li>Execução das integrações (como WhatsApp e IA)</li>
              <li>Suporte técnico e atendimento</li>
            </ul>
          </section>

          {/* IA */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              3. Uso de Inteligência Artificial
            </h2>

            <p className="mt-3 leading-8">
              A plataforma pode utilizar serviços de inteligência artificial para
              gerar respostas automatizadas, analisar mensagens e auxiliar na
              qualificação de leads.
            </p>

            <p className="mt-3 leading-8">
              O usuário reconhece que dados processados podem ser utilizados para
              execução dessas funcionalidades, conforme necessário para o
              funcionamento do sistema.
            </p>
          </section>

          {/* TERCEIROS */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              4. Compartilhamento com Terceiros
            </h2>

            <p className="mt-3 leading-8">
              O SDR AI poderá utilizar serviços de terceiros para funcionamento
              da plataforma, incluindo:
            </p>

            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>APIs de WhatsApp</li>
              <li>Serviços de inteligência artificial</li>
              <li>Infraestrutura em nuvem</li>
              <li>Meios de pagamento</li>
            </ul>

            <p className="mt-3 leading-8">
              Esses serviços podem processar dados conforme necessário para a
              operação da plataforma.
            </p>
          </section>

          {/* SEGURANÇA */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Segurança dos Dados
            </h2>

            <p className="mt-3 leading-8">
              O SDR AI adota medidas razoáveis para proteção dos dados, porém não
              garante segurança absoluta contra falhas externas, ataques ou
              indisponibilidades de terceiros.
            </p>
          </section>

          {/* RESPONSABILIDADE */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              6. Responsabilidade do Usuário
            </h2>

            <p className="mt-3 leading-8">
              O usuário é responsável pelos dados inseridos na plataforma,
              incluindo contatos, mensagens e informações utilizadas no sistema.
            </p>
          </section>

          {/* DIREITOS */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              7. Direitos do Usuário
            </h2>

            <p className="mt-3 leading-8">
              O usuário poderá solicitar atualização, correção ou exclusão de
              dados, dentro dos limites técnicos e legais aplicáveis.
            </p>
          </section>

          {/* COOKIES */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              8. Cookies e Tecnologias
            </h2>

            <p className="mt-3 leading-8">
              A plataforma poderá utilizar cookies e tecnologias similares para
              melhorar desempenho, segurança e experiência do usuário.
            </p>
          </section>

          {/* ALTERAÇÕES */}
          <section>
            <h2 className="text-2xl font-bold text-white">
              9. Alterações
            </h2>

            <p className="mt-3 leading-8">
              Esta Política poderá ser atualizada a qualquer momento para refletir
              melhorias ou mudanças legais e operacionais.
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