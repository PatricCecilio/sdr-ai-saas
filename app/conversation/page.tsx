import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createMessage,
  generateAIMessage,
  markLeadReadyForCloser,
  assumeHumanService,
  returnLeadToAI,
} from "../actions";
import { getCurrentUserPlan } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

type ConversationPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function ConversationPage({
  searchParams,
}: ConversationPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { isPro } = await getCurrentUserPlan();

  if (!isPro) {
    redirect("/upgrade");
  }

  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  const temperatureColor =
    lead.leadTemperature === "quente"
      ? "text-red-600 bg-red-50 border-red-200"
      : lead.leadTemperature === "morno"
      ? "text-yellow-700 bg-yellow-50 border-yellow-200"
      : "text-blue-600 bg-blue-50 border-blue-200";

  const handoffColor =
    lead.handoffStatus === "PRONTO_CLOSER"
      ? "text-green-700 bg-green-50 border-green-200"
      : "text-orange-700 bg-orange-50 border-orange-200";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Conversa com o lead
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Atendimento e qualificação do SDR IA
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Voltar ao dashboard
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {lead.name}
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium text-gray-900">
                {lead.phone || "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">
                {lead.email || "Não informado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Empresa</p>
              <p className="font-medium text-gray-900">
                {lead.company || "Não informada"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-blue-600">{lead.status}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Criado em</p>
              <p className="font-medium text-gray-900">
                {new Date(lead.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Qualificação da IA
            </h3>

            <div>
              <p className="text-sm text-gray-500">Nível de interesse</p>
              <p className="font-medium text-gray-900">
                {lead.interestLevel || "Não identificado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Temperatura</p>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${temperatureColor}`}
              >
                {lead.leadTemperature || "Não identificado"}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Interesse principal</p>
              <p className="font-medium text-gray-900">
                {lead.mainInterest || "Não identificado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Orçamento</p>
              <p className="font-medium text-gray-900">
                {lead.budgetInfo || "Não identificado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Prazo</p>
              <p className="font-medium text-gray-900">
                {lead.timelineInfo || "Não identificado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Resumo para closer</p>
              <p className="font-medium text-gray-900">
                {lead.qualifiedSummary || "Não identificado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Handoff</p>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${handoffColor}`}
              >
                {lead.handoffStatus || "PENDENTE"}
              </span>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Histórico da conversa
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Mensagens do cliente, da IA e do humano
              </p>
            </div>

              <div className="flex gap-3">
                {lead.handoffStatus !== "EM_ATENDIMENTO_HUMANO" && (
                  <form action={generateAIMessage}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <button
                      type="submit"
                      className="rounded-xl bg-green-600 px-4 py-2 text-white hover:opacity-90"
                    >
                      Gerar resposta IA
                    </button>
                  </form>
                )}

                {lead.handoffStatus !== "PRONTO_CLOSER" &&
                  lead.handoffStatus !== "EM_ATENDIMENTO_HUMANO" && (
                    <form action={markLeadReadyForCloser}>
                      <input type="hidden" name="leadId" value={lead.id} />
                      <button
                        type="submit"
                        className="rounded-xl bg-orange-600 px-4 py-2 text-white hover:opacity-90"
                      >
                        Marcar pronto para closer
                      </button>
                    </form>
                  )}

                {lead.handoffStatus !== "EM_ATENDIMENTO_HUMANO" ? (
                  <form action={assumeHumanService}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <button
                      type="submit"
                      className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:opacity-90"
                    >
                      Assumir atendimento humano
                    </button>
                  </form>
                ) : (
                  <form action={returnLeadToAI}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 px-4 py-2 text-white hover:opacity-90"
                    >
                      Devolver para IA
                    </button>
                  </form>
                )}
              </div>
          </div>

          <div className="mb-6 min-h-[420px] space-y-4 rounded-2xl bg-gray-50 p-4">
            {lead.messages.length === 0 ? (
              <p className="text-gray-500">Nenhuma mensagem ainda.</p>
            ) : (
              lead.messages.map((message: { id: string; role: string; content: string; createdAt: Date | string }) => {
                const isClient = message.role === "user";
                const isAssistant = message.role === "assistant";
                const isHuman = message.role === "human";

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isClient ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                        isClient
                          ? "bg-white text-gray-900"
                          : isAssistant
                          ? "bg-black text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <p className="mb-1 text-xs font-semibold uppercase opacity-80">
                        {isClient
                          ? "Cliente"
                          : isAssistant
                          ? "IA"
                          : isHuman
                          ? "Humano"
                          : message.role}
                      </p>

                      <p className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </p>

                      <p className="mt-2 text-[11px] opacity-70">
                        {new Date(message.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form action={createMessage} className="grid gap-4">
            <input type="hidden" name="leadId" value={lead.id} />

            <select
              name="role"
              defaultValue="assistant"
              className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900 focus:border-black"
            >
              <option value="assistant">IA</option>
              <option value="user">Cliente</option>
              <option value="human">Humano</option>
            </select>

            <textarea
              name="content"
              placeholder="Digite uma mensagem..."
              rows={5}
              className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900 placeholder-gray-500 focus:border-black"
              required
            />

            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90"
            >
              Salvar mensagem
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}