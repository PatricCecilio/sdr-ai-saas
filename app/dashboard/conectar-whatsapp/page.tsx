import Image from "next/image"
import Link from "next/link"
import {
  getWhatsappConnectionData,
  refreshWhatsappConnection,
  saveManualWhatsappConnection,
} from "./actions"

export const dynamic = "force-dynamic"

export default async function ConectarWhatsappPage() {
  const connection = await getWhatsappConnectionData()

  return (
    <main className="min-h-screen bg-[#060606] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">
            Ativação
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Conectar WhatsApp
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
            Nesta fase, a conexão está em modo manual. Informe os dados da sua
            instância Z-API para continuar o teste real do SDR AI.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            {!connection.hasConnection ? (
              <>
                <h2 className="text-2xl font-bold">
                  Informar dados da instância
                </h2>

                <p className="mt-4 leading-8 text-zinc-300">
                  Cole abaixo o ID e o token da instância. O client token é
                  opcional se você já tiver um token global no seu `.env`.
                </p>

                <form action={saveManualWhatsappConnection} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-zinc-300">
                      ID da instância
                    </label>
                    <input
                      name="instanceId"
                      placeholder="Ex: 3F03B5D70A6D42A9A58A0A35E9527144"
                      className="w-full rounded-[1rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-zinc-300">
                      Token da instância
                    </label>
                    <input
                      name="instanceToken"
                      placeholder="Ex: 64803E..."
                      className="w-full rounded-[1rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-zinc-300">
                      Client token (opcional)
                    </label>
                    <input
                      name="clientToken"
                      placeholder="Ex: seu client token"
                      className="w-full rounded-[1rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Salvar e continuar
                  </button>
                </form>
              </>
            ) : connection.connected ? (
              <>
                <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  WhatsApp conectado
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Seu número já está conectado
                </h2>

                <p className="mt-4 leading-8 text-zinc-300">
                  Sua instância já está ativa e pronta para seguir no teste.
                </p>

                <div className="mt-8 flex gap-4">
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Ir para o dashboard
                  </Link>

                  <form action={refreshWhatsappConnection}>
                    <button
                      type="submit"
                      className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
                    >
                      Atualizar status
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
                  Aguardando leitura do QR Code
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Leia o QR Code no WhatsApp
                </h2>

                <p className="mt-4 leading-8 text-zinc-300">
                  Abra o WhatsApp no seu celular, vá em dispositivos conectados
                  e leia o QR abaixo.
                </p>

                {connection.status === "missing-client-token" ? (
                  <div className="mt-8 rounded-[1.25rem] border border-red-400/20 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
                    Não foi encontrado um client token válido. Adicione
                    `ZAPI_CLIENT_TOKEN` no `.env` ou salve um client token nesta
                    conexão.
                  </div>
                ) : connection.qrCodeBase64 ? (
                  <div className="mt-8 flex justify-center rounded-[1.5rem] border border-white/10 bg-white p-6">
                    <Image
                      src={`data:image/png;base64,${connection.qrCodeBase64}`}
                      alt="QR Code para conectar WhatsApp"
                      width={280}
                      height={280}
                      className="h-auto w-[280px]"
                    />
                  </div>
                ) : (
                  <div className="mt-8 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-zinc-300">
                    Não foi possível carregar o QR agora. Clique em atualizar.
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <form action={refreshWhatsappConnection}>
                    <button
                      type="submit"
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                    >
                      Atualizar QR / status
                    </button>
                  </form>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
                  >
                    Voltar
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white">
              Onde encontrar esses dados
            </h3>

            <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-300">
              <div className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                1. Abra sua instância no painel da Z-API.
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                2. Copie o <strong>ID da instância</strong>.
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                3. Copie o <strong>Token da instância</strong>.
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                4. Se necessário, informe também o <strong>Client Token</strong>.
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                5. Salve e use o QR para conectar o número.
              </div>
            </div>

            <div className="mt-8 rounded-[1.25rem] border border-violet-400/20 bg-violet-500/10 p-4 text-sm leading-7 text-violet-100">
              Depois, quando você tiver o token de parceiro da Z-API, a gente
              troca esse fluxo manual por criação automática de instância.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}