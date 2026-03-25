import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getTemperatureBadge(temperature: string | null) {
  if (temperature === "hot") {
    return "bg-red-500/15 text-red-300 border-red-500/30";
  }

  if (temperature === "warm") {
    return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
  }

  if (temperature === "cold") {
    return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  }

  return "bg-zinc-800 text-zinc-300 border-zinc-700";
}

function getTemperatureLabel(temperature: string | null) {
  if (temperature === "hot") return "Hot";
  if (temperature === "warm") return "Warm";
  if (temperature === "cold") return "Cold";
  return "Sem classificação";
}

export default async function ConversationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
      connection: true,
    },
  });

  if (!conversation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard/conversations"
              className="text-sm text-zinc-400 hover:text-white"
            >
              ← Voltar para conversas
            </Link>

            <h1 className="text-3xl font-bold mt-3">
              {conversation.leadName || "Lead desconhecido"}
            </h1>

            <p className="text-zinc-400 mt-1">
              {conversation.companyName || "Empresa não informada"} •{" "}
              {conversation.contactPhone}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getTemperatureBadge(
                conversation.leadTemperature
              )}`}
            >
              {getTemperatureLabel(conversation.leadTemperature)}
            </div>

            <form action="/api/conversations/toggle-takeover" method="POST">
              <input
                type="hidden"
                name="conversationId"
                value={conversation.id}
              />
              <input
                type="hidden"
                name="currentValue"
                value={String(conversation.humanTakeover)}
              />
              <button
                type="submit"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  conversation.humanTakeover
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                }`}
              >
                {conversation.humanTakeover
                  ? "Atendimento humano ativo"
                  : "Ativar atendimento humano"}
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950 min-h-[600px] flex flex-col overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="text-lg font-semibold">Chat da conversa</h2>
              <p className="text-sm text-zinc-400">
                Histórico completo do atendimento no WhatsApp
              </p>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
              {conversation.messages.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  Nenhuma mensagem encontrada.
                </div>
              ) : (
                conversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.fromMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 border ${
                        message.fromMe
                          ? "bg-purple-600/20 border-purple-500/30"
                          : "bg-zinc-900 border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-semibold ${
                            message.fromMe ? "text-purple-300" : "text-zinc-300"
                          }`}
                        >
                          {message.fromMe ? "IA / Atendente" : "Lead"}
                        </span>

                        <span className="text-[11px] text-zinc-500">
                          {message.messageType}
                        </span>
                      </div>

                      <p className="text-sm whitespace-pre-wrap break-words text-zinc-100">
                        {message.content || "(sem conteúdo)"}
                      </p>

                      <p className="text-[11px] text-zinc-500 mt-2">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              action="/api/send-message"
              method="POST"
              className="border-t border-zinc-800 p-4 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="hidden"
                name="conversationId"
                value={conversation.id}
              />

              <input
                type="text"
                name="message"
                placeholder="Digite uma mensagem..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-purple-500"
                required
              />

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 transition px-5 py-2.5 rounded-lg text-sm font-medium"
              >
                Enviar
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <h2 className="text-lg font-semibold mb-4">Informações do lead</h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-zinc-500 mb-1">Nome</p>
                  <p className="text-white">
                    {conversation.leadName || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Empresa</p>
                  <p className="text-white">
                    {conversation.companyName || "Não informada"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Telefone</p>
                  <p className="text-white">
                    {conversation.contactPhone || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Website</p>
                  {conversation.website ? (
                    <a
                      href={
                        conversation.website.startsWith("http")
                          ? conversation.website
                          : `https://${conversation.website}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-300 hover:text-purple-200 break-all"
                    >
                      {conversation.website}
                    </a>
                  ) : (
                    <p className="text-white">Não informado</p>
                  )}
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Interesse</p>
                  <p className="text-white">
                    {conversation.interest || "Não identificado"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Objetivo</p>
                  <p className="text-white">
                    {conversation.objective || "Não identificado"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Próximo passo</p>
                  <p className="text-white">
                    {conversation.nextStep || "Não definido"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Modo de atendimento</p>
                  <p className="text-white">
                    {conversation.humanTakeover ? "Humano" : "IA automática"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Temperatura</p>
                  <div
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getTemperatureBadge(
                      conversation.leadTemperature
                    )}`}
                  >
                    {getTemperatureLabel(conversation.leadTemperature)}
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["hot", "warm", "cold", "null"].map((temp) => (
                      <form
                        key={temp}
                        action="/api/conversations/set-temperature"
                        method="POST"
                      >
                        <input
                          type="hidden"
                          name="conversationId"
                          value={conversation.id}
                        />
                        <input
                          type="hidden"
                          name="temperature"
                          value={temp}
                        />

                        <button
                          type="submit"
                          className={`text-xs px-3 py-1 rounded-full border transition hover:bg-zinc-800 ${
                            temp === "hot"
                              ? "border-red-500 text-red-300"
                              : temp === "warm"
                              ? "border-yellow-500 text-yellow-300"
                              : temp === "cold"
                              ? "border-blue-500 text-blue-300"
                              : "border-zinc-600 text-zinc-300"
                          }`}
                        >
                          {temp === "null"
                            ? "Limpar"
                            : temp.charAt(0).toUpperCase() + temp.slice(1)}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <h2 className="text-lg font-semibold mb-4">Resumo comercial</h2>

              <p className="text-sm text-zinc-300 leading-6">
                {conversation.summary ||
                  "Ainda não há resumo para esta conversa."}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <h2 className="text-lg font-semibold mb-4">Dados técnicos</h2>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-zinc-500 mb-1">Criada em</p>
                  <p className="text-white">
                    {formatDate(conversation.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Última mensagem</p>
                  <p className="text-white">
                    {conversation.lastMessageAt
                      ? formatDate(conversation.lastMessageAt)
                      : "Sem atividade"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 mb-1">Conexão WhatsApp</p>
                  <p className="text-white">
                    {conversation.connection?.phoneNumber ||
                      "Sem número definido"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}