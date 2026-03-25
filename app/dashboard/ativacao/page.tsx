import Link from "next/link"
import { startTrialActivation } from "./actions"

export default function AtivacaoPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-200">
            Teste gratuito • 2 dias
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Ative seu teste com WhatsApp real
          </h1>

          <p className="mt-4 text-lg leading-8 text-zinc-300">
            Você poderá testar o SDR AI por <strong>2 dias</strong> com seu
            próprio número de WhatsApp conectado, avaliando a experiência real do
            sistema antes da continuidade do plano.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <h2 className="text-xl font-bold text-white">
              Importante antes de continuar
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
              <p>
                • Ao iniciar o teste, uma estrutura técnica será preparada para a
                sua conta, incluindo integração e provisionamento do ambiente.
              </p>
              <p>
                • Após a ativação e conexão do WhatsApp, o serviço entra em fase
                de execução real.
              </p>
              <p>
                • O uso da IA é uma ferramenta de apoio e o usuário continua
                responsável pela validação das respostas e comunicações do seu
                negócio.
              </p>
              <p>
                • Os detalhes sobre termos, privacidade e política de reembolso
                estão disponíveis nos documentos da plataforma.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-amber-400/20 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">
            Leia com atenção: ao prosseguir, você confirma que leu e entendeu os
            documentos da plataforma e autoriza o início do teste e da preparação
            técnica da sua conta.
          </div>

          <form action={startTrialActivation} className="mt-8 space-y-6">
            <label className="flex items-start gap-3 text-sm leading-7 text-zinc-300">
              <input
                type="checkbox"
                name="acceptActivation"
                required
                className="mt-1 h-4 w-4"
              />
              <span>
                Eu confirmo que li os{" "}
                <Link href="/termos" className="underline underline-offset-4 hover:text-white">
                  Termos de Uso
                </Link>
                , a{" "}
                <Link
                  href="/privacidade"
                  className="underline underline-offset-4 hover:text-white"
                >
                  Política de Privacidade
                </Link>{" "}
                e a{" "}
                <Link
                  href="/reembolso"
                  className="underline underline-offset-4 hover:text-white"
                >
                  Política de Reembolso
                </Link>
                . Também entendi que o teste envolve ativação técnica da conta e
                autorizo o início do teste de 2 dias.
              </span>
            </label>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Iniciar teste de 2 dias
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
              >
                Voltar
              </Link>
            </div>
          </form>

          <p className="mt-6 text-xs leading-6 text-zinc-500">
            Ao clicar em iniciar, você seguirá para a etapa de conexão do seu
            número de WhatsApp.
          </p>
        </div>
      </div>
    </main>
  )
}