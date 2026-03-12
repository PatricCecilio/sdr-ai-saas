import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LeadStatusForm from "./components/LeadStatusForm";

function getTemperatureBadge(temp?: string | null) {
  if (temp === "quente") return "bg-red-100 text-red-700 border-red-200";
  if (temp === "morno") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

export default async function Home() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const hotLeads = leads.filter(
    (lead) => lead.handoffStatus === "PRONTO_CLOSER"
  );

  const humanLeads = leads.filter(
    (lead) => lead.handoffStatus === "EM_ATENDIMENTO_HUMANO"
  );

  const warmLeads = leads.filter(
    (lead) =>
      lead.leadTemperature === "morno" &&
      lead.handoffStatus !== "PRONTO_CLOSER" &&
      lead.handoffStatus !== "EM_ATENDIMENTO_HUMANO"
  );

  const newLeads = leads.filter(
    (lead) =>
      lead.status === "NOVO" &&
      lead.handoffStatus !== "PRONTO_CLOSER" &&
      lead.handoffStatus !== "EM_ATENDIMENTO_HUMANO"
  );

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-8 text-3xl font-bold">Painel SDR IA</h1>

      <div className="mb-10 grid grid-cols-5 gap-4">
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold">{leads.length}</p>
        </div>

        <div className="rounded-xl bg-red-100 p-4">
          <p className="text-sm text-red-700">Leads Quentes</p>
          <p className="text-2xl font-bold">{hotLeads.length}</p>
        </div>

        <div className="rounded-xl bg-purple-100 p-4">
          <p className="text-sm text-purple-700">Atendimento Humano</p>
          <p className="text-2xl font-bold">{humanLeads.length}</p>
        </div>

        <div className="rounded-xl bg-yellow-100 p-4">
          <p className="text-sm text-yellow-700">Leads Mornos</p>
          <p className="text-2xl font-bold">{warmLeads.length}</p>
        </div>

        <div className="rounded-xl bg-blue-100 p-4">
          <p className="text-sm text-blue-700">Leads Novos</p>
          <p className="text-2xl font-bold">{newLeads.length}</p>
        </div>
      </div>

      {/* LEADS QUENTES */}

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-red-600">
            🔥 Leads prontos para closer
          </h2>

          {hotLeads.length > 0 && (
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
              AÇÃO IMEDIATA
            </span>
          )}
        </div>

        {hotLeads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-500">
            Nenhum lead pronto para closer.
          </div>
        ) : (
          <div className="grid gap-4">
            {hotLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between rounded-xl border-2 border-red-200 bg-red-50 p-4 shadow"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-lg font-semibold">{lead.name}</p>

                    <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      QUENTE
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">📱 {lead.phone}</p>

                  <p className="text-sm text-gray-700">
                    🎯 Interesse: {lead.mainInterest || "não identificado"}
                  </p>

                  <p className="text-sm text-gray-700">
                    🔥 Temperatura: {lead.leadTemperature || "não identificado"}
                  </p>

                  <p className="text-sm text-gray-700">
                    🧠 Resumo: {lead.qualifiedSummary || "sem resumo"}
                  </p>

                  <LeadStatusForm
                    leadId={lead.id}
                    currentStatus={lead.status}
                  />
                </div>

                <Link
                  href={`/conversation?id=${lead.id}`}
                  className="h-fit rounded-lg bg-black px-4 py-2 text-white"
                >
                  Abrir conversa
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ATENDIMENTO HUMANO */}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-purple-600">
          👤 Em atendimento humano
        </h2>

        {humanLeads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-500">
            Nenhum lead em atendimento humano.
          </div>
        ) : (
          <div className="grid gap-4">
            {humanLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between rounded-xl bg-white p-4 shadow"
              >
                <div>
                  <p className="text-lg font-semibold">{lead.name}</p>

                  <p className="text-sm text-gray-500">📱 {lead.phone}</p>

                  <p className="text-sm text-gray-600">
                    🎯 Interesse: {lead.mainInterest || "não identificado"}
                  </p>

                  <p className="text-sm text-gray-600">
                    🔥 Temperatura: {lead.leadTemperature || "não identificado"}
                  </p>

                  <p className="text-sm text-gray-600">
                    🧠 Resumo: {lead.qualifiedSummary || "sem resumo"}
                  </p>

                  <LeadStatusForm
                    leadId={lead.id}
                    currentStatus={lead.status}
                  />
                </div>

                <Link
                  href={`/conversation?id=${lead.id}`}
                  className="h-fit rounded-lg bg-black px-4 py-2 text-white"
                >
                  Abrir conversa
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LEADS MORNOS */}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-yellow-600">
          🟡 Leads em aquecimento
        </h2>

        {warmLeads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-500">
            Nenhum lead em aquecimento.
          </div>
        ) : (
          <div className="grid gap-4">
            {warmLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between rounded-xl bg-white p-4 shadow"
              >
                <div>
                  <p className="text-lg font-semibold">{lead.name}</p>

                  <p className="text-sm text-gray-500">📱 {lead.phone}</p>

                  <p className="text-sm text-gray-600">
                    🎯 Interesse: {lead.mainInterest || "não identificado"}
                  </p>

                  <p className="text-sm text-gray-600">
                    🔥 Temperatura: {lead.leadTemperature || "não identificado"}
                  </p>

                  <p className="text-sm text-gray-600">
                    🧠 Resumo: {lead.qualifiedSummary || "sem resumo"}
                  </p>

                  <LeadStatusForm
                    leadId={lead.id}
                    currentStatus={lead.status}
                  />
                </div>

                <Link
                  href={`/conversation?id=${lead.id}`}
                  className="h-fit rounded-lg bg-black px-4 py-2 text-white"
                >
                  Abrir conversa
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LEADS NOVOS */}

      <section>
        <h2 className="mb-4 text-xl font-semibold text-blue-600">
          🆕 Leads novos
        </h2>

        {newLeads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-500">
            Nenhum lead novo no momento.
          </div>
        ) : (
          <div className="grid gap-4">
            {newLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between rounded-xl bg-white p-4 shadow"
              >
                <div>
                  <p className="text-lg font-semibold">{lead.name}</p>

                  <p className="text-sm text-gray-500">📱 {lead.phone}</p>

                  <p className="text-sm text-gray-600">
                    🎯 Interesse: {lead.mainInterest || "não identificado"}
                  </p>

                  <p className="text-sm text-gray-600">
                    🔥 Temperatura: {lead.leadTemperature || "não identificado"}
                  </p>

                  <p className="text-sm text-gray-600">
                    🧠 Resumo: {lead.qualifiedSummary || "sem resumo"}
                  </p>

                  <LeadStatusForm
                    leadId={lead.id}
                    currentStatus={lead.status}
                  />
                </div>

                <Link
                  href={`/conversation?id=${lead.id}`}
                  className="h-fit rounded-lg bg-black px-4 py-2 text-white"
                >
                  Abrir conversa
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}